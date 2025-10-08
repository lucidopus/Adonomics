import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb/client'
import { AdvertisementModel } from '@/lib/mongodb/models/Advertisement'
import { TwelveLabs } from 'twelvelabs-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')
    const view = searchParams.get('view') // 'gallery' or 'list'

    const client = await clientPromise
    const db = client.db()

    // Build query filter
    const filter: Record<string, unknown> = {}

    // For gallery view, only show analyzed advertisements
    if (view === 'gallery') {
      filter['analysis_results.synthesis.report'] = { $exists: true, $ne: null }
    }

    if (status) {
      filter.status = status
    }

    if (userId) {
      filter.user_id = new ObjectId(userId)
    }

    const advertisements = await db
      .collection('advertisements')
      .find(filter)
      .sort({ analyzed_at: -1, updated_at: -1 })
      .toArray()

    return NextResponse.json(advertisements, { status: 200 })
  } catch (error) {
    console.error('Error fetching advertisements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch advertisements' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const userId = formData.get('userId') as string
    const videoFile = formData.get('videoFile') as File | null
    const videoUrl = formData.get('videoUrl') as string | null

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!videoFile && !videoUrl) {
      return NextResponse.json(
        { error: 'Either video file or video URL is required' },
        { status: 400 }
      )
    }

    // Initialize Twelve Labs client
    const client = new TwelveLabs({
      apiKey: process.env.TWELVE_LABS_API_KEY!
    })

    // TODO: Get index ID from environment or user preferences
    const indexId = process.env.TWELVE_LABS_INDEX_ID!
    if (!indexId) {
      return NextResponse.json(
        { error: 'Twelve Labs index not configured' },
        { status: 500 }
      )
    }

    let task
    try {
      if (videoFile) {
        // Upload file - pass the File object directly
        task = await (client as unknown as { tasks: { create: (params: { indexId: string; videoFile: File; enableVideoStream: boolean }) => Promise<{ id: string; videoId: string }> } }).tasks.create({
          indexId,
          videoFile,
          enableVideoStream: true
        })
      } else if (videoUrl) {
        // Upload URL
        task = await (client as unknown as { tasks: { create: (params: { indexId: string; videoUrl: string; enableVideoStream: boolean }) => Promise<{ id: string; videoId: string }> } }).tasks.create({
          indexId,
          videoUrl,
          enableVideoStream: true
        })
      }
    } catch (twelveLabsError) {
      console.error('Twelve Labs upload error:', twelveLabsError)
      return NextResponse.json(
        { error: 'Failed to upload video to Twelve Labs' },
        { status: 500 }
      )
    }

    if (!task) {
      return NextResponse.json(
        { error: 'Failed to create upload task' },
        { status: 500 }
      )
    }

    // Save to MongoDB
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

    // Add Twelve Labs data
    const advertisement = {
      ...advertisementData,
      twelve_labs_index_id: indexId,
      twelve_labs_task_id: task.id,
      twelve_labs_video_id: task.videoId
    }

    const result = await db
      .collection(AdvertisementModel.collectionName)
      .insertOne(advertisement)

    return NextResponse.json({
      success: true,
      taskId: task.id,
      videoId: task.videoId,
      advertisementId: result.insertedId
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating advertisement:', error)
    return NextResponse.json(
      { error: 'Failed to create advertisement' },
      { status: 500 }
    )
  }
}
