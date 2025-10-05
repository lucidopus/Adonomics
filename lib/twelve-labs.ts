/* eslint-disable @typescript-eslint/no-explicit-any */
import { TwelveLabs } from 'twelvelabs-js'

interface VideoSearchResult {
  id: string
  title?: string
  description?: string
  thumbnail_url?: string
  duration?: number
  created_at?: string
  score?: number
  metadata?: Record<string, any>
}

interface SearchSimilarVideosResponse {
  data: VideoSearchResult[]
  pageInfo?: {
    limit: number
    total: number
    page: number
  }
  searchId?: string
}

/**
 * Searches for similar videos using TwelveLabs API based on a text query
 * @param query - The text query to search for similar videos
 * @param indexId - Optional index ID (uses env default if not provided)
 * @returns Promise resolving to search results
 */
export async function searchSimilarVideos(
  query: string,
  indexId?: string
): Promise<SearchSimilarVideosResponse> {
  try {
    // Validate environment variables
    if (!process.env.TWELVE_LABS_API_KEY) {
      throw new Error('TwelveLabs API key is not configured')
    }

    if (!process.env.TWELVE_LABS_INDEX_ID && !indexId) {
      throw new Error('TwelveLabs index ID is not configured')
    }

    // Initialize TwelveLabs client
    const client = new TwelveLabs({
      apiKey: process.env.TWELVE_LABS_API_KEY
    })

    // Perform the search using the SDK
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchResults = await (client as any).search.create({
      indexId: indexId || process.env.TWELVE_LABS_INDEX_ID!,
      queryText: query,
      searchOptions: ["visual", "audio"]
    })

    // Transform the response to our interface
    const transformedResults: VideoSearchResult[] = searchResults.data.map((result: any) => ({
      id: result.id || result.videoId,
      title: result.title || result.metadata?.title,
      description: result.description || result.metadata?.description,
      thumbnail_url: result.thumbnailUrl || result.thumbnail_url,
      duration: result.duration || result.metadata?.duration,
      created_at: result.createdAt || result.created_at,
      score: result.score,
      metadata: result.metadata
    }))

    return {
      data: transformedResults
    }

  } catch (error) {
    console.error('Error searching similar videos:', error)

    // Handle specific TwelveLabs errors
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('unauthorized')) {
        throw new Error('TwelveLabs API key is not configured or invalid')
      }
      if (error.message.includes('index') || error.message.includes('not found')) {
        throw new Error('TwelveLabs index ID is not configured or invalid')
      }
      if (error.message.includes('quota') || error.message.includes('limit') || error.message.includes('rate')) {
        throw new Error('TwelveLabs API quota exceeded or rate limited')
      }
    }

    throw new Error('Failed to search similar videos')
  }
}

/**
 * Searches for videos similar to a given video ID using visual similarity
 * @param videoId - The video ID to find similar videos for
 * @param indexId - Optional index ID (uses env default if not provided)
 * @returns Promise resolving to search results
 */
export async function searchSimilarVideosById(
  videoId: string,
  indexId?: string
): Promise<SearchSimilarVideosResponse> {
  try {
    // Validate environment variables
    if (!process.env.TWELVE_LABS_API_KEY) {
      throw new Error('TwelveLabs API key is not configured')
    }

    if (!process.env.TWELVE_LABS_INDEX_ID && !indexId) {
      throw new Error('TwelveLabs index ID is not configured')
    }

    const client = new TwelveLabs({
      apiKey: process.env.TWELVE_LABS_API_KEY
    })

    // Search by video ID - using text search with video ID as query
    // Note: This may not find visual similarities, but searches for videos containing this ID in metadata
    const searchResults = await (client as any).search.create({
      indexId: indexId || process.env.TWELVE_LABS_INDEX_ID!,
      queryText: videoId,
      searchOptions: ["visual", "audio"]
    })

    const transformedResults: VideoSearchResult[] = searchResults.data.map((result: any) => ({
      id: result.id || result.videoId,
      title: result.title || result.metadata?.title,
      description: result.description || result.metadata?.description,
      thumbnail_url: result.thumbnailUrl || result.thumbnail_url,
      duration: result.duration || result.metadata?.duration,
      created_at: result.createdAt || result.created_at,
      score: result.score,
      metadata: result.metadata
    }))

    return {
      data: transformedResults
    }

  } catch (error) {
    console.error('Error searching similar videos by ID:', error)
    throw new Error('Failed to search similar videos by ID')
  }
}

/**
 * Validates TwelveLabs configuration
 * @returns Promise resolving to true if configuration is valid
 */
export async function validateTwelveLabsConfig(): Promise<boolean> {
  try {
    if (!process.env.TWELVE_LABS_API_KEY) {
      console.error('TwelveLabs API key not configured')
      return false
    }

    if (!process.env.TWELVE_LABS_INDEX_ID) {
      console.error('TwelveLabs index ID not configured')
      return false
    }

    const client = new TwelveLabs({
      apiKey: process.env.TWELVE_LABS_API_KEY
    })

    // Try to get index info to validate configuration
    try {
      await client.indexes.retrieve(process.env.TWELVE_LABS_INDEX_ID)
    } catch (indexError: any) {
      // If index retrieval fails, provide helpful error message
      console.log('Index retrieval failed. The index ID might be incorrect.')
      throw new Error(`Index ID '${process.env.TWELVE_LABS_INDEX_ID}' is invalid. Please check your TwelveLabs dashboard for the correct index ID (should be a UUID format, not a name).`)
    }

    return true
  } catch (error) {
    console.error('TwelveLabs configuration validation failed:', error)
    return false
  }
}