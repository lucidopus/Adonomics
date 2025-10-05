import { NextRequest, NextResponse } from 'next/server'
import { TwelveLabs } from 'twelvelabs-js'

interface AnalyzeVideoRequest {
  videoId: string
  analysisType: 'gist' | 'summary' | 'open-ended'
  prompt?: string
  indexId?: string
}

interface AnalyzeVideoResponse {
  success: boolean
  data?: any
  error?: string
}

/**
 * API endpoint for analyzing videos using TwelveLabs
 * Supports different types of analysis for advertising content
 */
export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeVideoRequest = await request.json()
    const { videoId, analysisType, prompt, indexId } = body

    // Validate required parameters
    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Video ID is required' },
        { status: 400 }
      )
    }

    if (!analysisType) {
      return NextResponse.json(
        { success: false, error: 'Analysis type is required' },
        { status: 400 }
      )
    }

    // Validate environment variables
    if (!process.env.TWELVE_LABS_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'TwelveLabs API key not configured' },
        { status: 500 }
      )
    }

    // Initialize TwelveLabs client
    const client = new TwelveLabs({
      apiKey: process.env.TWELVE_LABS_API_KEY
    })

    let result: any

    switch (analysisType) {
      case 'gist':
        // Generate titles, topics, and hashtags
        result = await (client as any).gist({
          videoId,
          types: ['title', 'topic', 'hashtag']
        })
        break

      case 'summary':
        // Generate summary with custom prompt if provided
        result = await (client as any).summarize({
          videoId,
          type: 'summary',
          prompt: prompt || 'Create a concise summary of this video for advertising analysis.'
        })
        break

      case 'open-ended':
        // Open-ended analysis with custom prompt
        if (!prompt) {
          return NextResponse.json(
            { success: false, error: 'Prompt is required for open-ended analysis' },
            { status: 400 }
          )
        }
        result = await (client as any).analyze({
          videoId,
          prompt,
          temperature: 0.2 // Lower temperature for more consistent results
        })
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid analysis type. Use: gist, summary, or open-ended' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error: any) {
    console.error('Error analyzing video:', error)

    // Handle specific TwelveLabs errors
    if (error.message?.includes('API key') || error.message?.includes('unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'TwelveLabs API key is invalid' },
        { status: 401 }
      )
    }

    if (error.message?.includes('video') && error.message?.includes('not found')) {
      return NextResponse.json(
        { success: false, error: 'Video not found in the index' },
        { status: 404 }
      )
    }

    if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('rate')) {
      return NextResponse.json(
        { success: false, error: 'API quota exceeded or rate limited' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to analyze video' },
      { status: 500 }
    )
  }
}