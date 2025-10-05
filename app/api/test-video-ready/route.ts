import { NextRequest, NextResponse } from 'next/server'
import { isVideoReadyForAnalysis } from '@/lib/twelve-labs'

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json()

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Video ID is required' },
        { status: 400 }
      )
    }

    const isReady = await isVideoReadyForAnalysis(videoId)

    return NextResponse.json({
      success: true,
      isReady,
      videoId
    })

  } catch (error: any) {
    console.error('Error checking video readiness:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check video readiness' },
      { status: 500 }
    )
  }
}