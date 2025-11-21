import { NextRequest } from 'next/server'
import { TwelveLabs } from 'twelvelabs-js'

export const maxDuration = 300; // 5 minutes

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
      const task = await client.tasks.create(
        videoFile
          ? {
              indexId,
              videoFile,
              enableVideoStream: true
            }
          : {
              indexId,
              videoUrl: videoUrl!,
              enableVideoStream: true
            },
        { timeoutInSeconds: 600 }
      )

      if (!task) {
        await sendProgress('error', 'Failed to create upload task', 0)
        await writer.close()
        return
      }

      await sendProgress('uploaded', 'Video uploaded successfully!', 30)

      // Wait for indexing to complete with progress tracking
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let completedTask: any = null
      let isDone = false
      while (!isDone) {
        const currentTask = await client.tasks.retrieve(task.id!)

        switch (currentTask.status) {
          case 'ready':
            completedTask = currentTask
            isDone = true
            break
          case 'failed':
            await sendProgress(
              'error',
              `Video indexing failed with status: ${currentTask.status}`,
              0
            )
            await writer.close()
            return
          case 'uploading':
            await sendProgress(
              'uploading',
              'Uploading video to Twelve Labs...',
              20
            )
            break
          case 'validating':
            await sendProgress(
              'validating',
              'Validating video format and metadata...',
              40
            )
            break
          case 'pending':
            await sendProgress('pending', 'Preparing video for indexing...', 50)
            break
          case 'queued':
            await sendProgress(
              'queued',
              'Video queued for processing...',
              60
            )
            break
          case 'indexing':
            await sendProgress(
              'indexing',
              'Generating video embeddings and analysis data...',
              75
            )
            break
          default:
            await sendProgress(
              'processing',
              `Processing: ${currentTask.status}`,
              70
            )
        }

        if (!isDone) {
          await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds before polling again
        }
      }

      // Check if indexing was successful
      if (!completedTask || completedTask.status !== 'ready') {
        await sendProgress(
          'error',
          `Video indexing failed with status: ${completedTask?.status || 'unknown'}`,
          0
        )
        await writer.close()
        return
      }

        await sendProgress('indexing_complete', 'Video successfully indexed!', 90)

        try {
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
          twelve_labs_task_id: completedTask!.id,
          twelve_labs_video_id: completedTask!.videoId
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
            taskId: completedTask!.id,
            videoId: completedTask!.videoId,
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
