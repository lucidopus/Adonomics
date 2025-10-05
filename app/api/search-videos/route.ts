import { NextRequest, NextResponse } from 'next/server'
import { searchSimilarVideos } from '@/lib/twelve-labs'

interface SearchVideosRequest {
  query: string
  indexId?: string
}

// Response interface not used - removed to fix unused variable warning

/**
 * API endpoint for searching videos using TwelveLabs
 */
export async function POST(request: NextRequest) {
  try {
    const body: SearchVideosRequest = await request.json()
    const { query, indexId } = body

    // Validate required parameters
    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      )
    }

    // Perform the search
    const result = await searchSimilarVideos(query, indexId)

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error: unknown) {
    const err = error as Error
    console.error('Error searching videos:', err)

    // Handle specific TwelveLabs errors
    if (err.message?.includes('API key') || err.message?.includes('unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'TwelveLabs API key is invalid' },
        { status: 401 }
      )
    }

    if (err.message?.includes('index') && err.message?.includes('not found')) {
      return NextResponse.json(
        { success: false, error: 'TwelveLabs index not found' },
        { status: 404 }
      )
    }

    if (err.message?.includes('quota') || err.message?.includes('limit') || err.message?.includes('rate')) {
      return NextResponse.json(
        { success: false, error: 'API quota exceeded or rate limited' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to search videos' },
      { status: 500 }
    )
  }
}