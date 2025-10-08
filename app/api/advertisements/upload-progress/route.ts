import { NextRequest } from 'next/server'
import { TwelveLabs } from 'twelvelabs-js'

/**
 * Server-Sent Events endpoint for streaming video upload and indexing progress
 * This provides real-time status updates to the frontend
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const userId = formData.get('userId') as string
  const videoFile = formData.get('videoFile') as File | null
  const videoUrl = formData.get('videoUrl') as string | null

  if (!userId) {
    return new Response('User ID is required', { status: 400 })
  }

  if (!videoFile && !videoUrl) {
    return new Response('Either video file or video URL is required', { status: 400 })
  }

  // Set up SSE headers
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  const encoder = new TextEncoder()

  // Helper function to send progress updates
  const sendProgress = async (status: string, message: string, progress: number) => {
    const data = JSON.stringify({ status, message, progress })
    await writer.write(encoder.encode(`data: ${data}\n\n`))
  }

  // Start the upload and indexing process
  ;(async () => {
    try {
      await sendProgress('initializing', 'Initializing upload...', 0)

      // Initialize Twelve Labs client
      const client = new TwelveLabs({
        apiKey: process.env.TWELVE_LABS_API_KEY!
      })

      const indexId = process.env.TWELVE_LABS_INDEX_ID!
      if (!indexId) {
        await sendProgress('error', 'Twelve Labs index not configured', 0)
        await writer.close()
        return
      }

      await sendProgress('uploading', 'Uploading video to Twelve Labs...', 10)

      // Create the upload task
      let task
      try {
        if (videoFile) {
          task = await (client as unknown as {
            tasks: {
              create: (params: { indexId: string; videoFile: File; enableVideoStream: boolean }) => Promise<{ id: string; videoId: string }>
            }
          }).tasks.create({
            indexId,
            videoFile,
            enableVideoStream: true
          })
        } else if (videoUrl) {
          task = await (client as unknown as {
            tasks: {
              create: (params: { indexId: string; videoUrl: string; enableVideoStream: boolean }) => Promise<{ id: string; videoId: string }>
            }
          }).tasks.create({
            indexId,
            videoUrl,
            enableVideoStream: true
          })
        }

        if (!task) {
          await sendProgress('error', 'Failed to create upload task', 0)
          await writer.close()
          return
        }

        await sendProgress('uploaded', 'Video uploaded successfully!', 30)

        // Wait for indexing to complete with progress tracking
        const completedTask = await (client as unknown as {
          tasks: {
            waitForDone: (taskId: string, options?: {
              sleepInterval?: number;
              callback?: (task: { status: string; videoId?: string }) => void
            }) => Promise<{ status: string; videoId: string; id: string }>
          }
        }).tasks.waitForDone(task.id, {
          sleepInterval: 5,
          callback: async (currentTask) => {
            // Map TwelveLabs status to progress percentage and user-friendly messages
            switch (currentTask.status) {
              case 'uploading':
                await sendProgress('uploading', 'Uploading video to Twelve Labs...', 20)
                break
              case 'validating':
                await sendProgress('validating', 'Validating video format and metadata...', 40)
                break
              case 'pending':
                await sendProgress('pending', 'Preparing video for indexing...', 50)
                break
              case 'queued':
                await sendProgress('queued', 'Video queued for processing...', 60)
                break
              case 'indexing':
                await sendProgress('indexing', 'Generating video embeddings and analysis data...', 75)
                break
              default:
                await sendProgress('processing', `Processing: ${currentTask.status}`, 70)
            }
          }
        })

        // Check if indexing was successful
        if (completedTask.status !== 'ready') {
          await sendProgress('error', `Video indexing failed with status: ${completedTask.status}`, 0)
          await writer.close()
          return
        }

        await sendProgress('indexing_complete', 'Video successfully indexed!', 90)

        // Import MongoDB operations here to save the advertisement
        const { ObjectId } = await import('mongodb')
        const clientPromise = (await import('@/lib/mongodb/client')).default
        const { AdvertisementModel } = await import('@/lib/mongodb/models/Advertisement')

        const mongoClient = await clientPromise
        const db = mongoClient.db()

        const advertisementData = AdvertisementModel.createAdvertisement(
          new ObjectId(userId),
          {
            video_url: videoUrl || undefined,
            video_filename: videoFile?.name,
            video_file_size: videoFile?.size
          }
        )

        const advertisement = {
          ...advertisementData,
          twelve_labs_index_id: indexId,
          twelve_labs_task_id: completedTask.id,
          twelve_labs_video_id: completedTask.videoId
        }

        const result = await db
          .collection(AdvertisementModel.collectionName)
          .insertOne(advertisement)

        await sendProgress('complete', 'Video ready for analysis!', 100)

        // Send final success message with IDs
        const finalData = JSON.stringify({
          status: 'success',
          message: 'Upload complete',
          progress: 100,
          data: {
            taskId: completedTask.id,
            videoId: completedTask.videoId,
            advertisementId: result.insertedId.toString()
          }
        })
        await writer.write(encoder.encode(`data: ${finalData}\n\n`))

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed'
        await sendProgress('error', errorMessage, 0)
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred'
      await sendProgress('error', errorMessage, 0)
    } finally {
      await writer.close()
    }
  })()

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
