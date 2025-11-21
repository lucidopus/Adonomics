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

export interface VideoAnalysisResult {
  task_id: string
  video_id: string
  analysis_data: {
    summary?: string // Raw summary from Twelve Labs
    scenes: Array<{
      start: number
      end: number
      description: string
      objects: string[]
      emotions: string[]
    }>
    themes: string[]
    target_audience: string
    strengths: string[]
    weaknesses: string[]
  }
  extracted_at: Date
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

    const searchResults = await client.search.query({
      indexId: indexId || process.env.TWELVE_LABS_INDEX_ID!,
      queryText: query,
      searchOptions: ["visual", "audio"]
    })

    // Collect all search results (the response is a Page that implements AsyncIterable)
    const allResults: any[] = []
    for await (const item of searchResults) {
      if (item.clips && item.id) {
        // Grouped by video - take the first clip for video-level info
        const firstClip = item.clips[0]
        allResults.push({
          ...firstClip,
          id: item.id,
          userMetadata: item.userMetadata
        })
      } else {
        // Individual clips
        allResults.push(item)
      }
    }

    // Transform the response to our interface
    const transformedResults: VideoSearchResult[] = allResults.map((result: any) => ({
      id: result.videoId,
      title: result.userMetadata?.title || result.transcription?.substring(0, 100) || 'Video result',
      description: result.transcription || result.userMetadata?.description || '',
      thumbnail_url: result.thumbnailUrl,
      duration: result.end - result.start,
      created_at: new Date().toISOString(), // Not available in search results
      score: result.score,
      metadata: result.userMetadata
    }))

    return {
      data: transformedResults
    }

  } catch (error) {
    console.error('Error searching similar videos:', error)

    // Handle specific TwelveLabs errors
    if (error instanceof Error) {
      // Check for search not supported (Pegasus doesn't support search)
      if (error.message.includes('index_not_supported_for_search')) {
        throw new Error('Search is not supported with Pegasus index. Pegasus is optimized for video generation/analysis only. To use search features, you need a Marengo index.')
      }
      // Check for 403 authorization errors
      if (error.message.includes('403') || error.message.includes('read_not_allowed') || error.message.includes('not authorized')) {
        throw new Error('API key is not authorized to access this index. Please verify your TWELVE_LABS_INDEX_ID matches your API key account.')
      }
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
    const searchResults = await client.search.query({
      indexId: indexId || process.env.TWELVE_LABS_INDEX_ID!,
      queryText: videoId,
      searchOptions: ["visual", "audio"]
    })

    // Collect all search results
    const allResults: any[] = []
    for await (const item of searchResults) {
      if (item.clips && item.id) {
        // Grouped by video - take the first clip for video-level info
        const firstClip = item.clips[0]
        allResults.push({
          ...firstClip,
          id: item.id,
          userMetadata: item.userMetadata
        })
      } else {
        // Individual clips
        allResults.push(item)
      }
    }

    const transformedResults: VideoSearchResult[] = allResults.map((result: any) => ({
      id: result.videoId,
      title: result.userMetadata?.title || result.transcription?.substring(0, 100) || 'Video result',
      description: result.transcription || result.userMetadata?.description || '',
      thumbnail_url: result.thumbnailUrl,
      duration: result.end - result.start,
      created_at: new Date().toISOString(),
      score: result.score,
      metadata: result.userMetadata
    }))

    return {
      data: transformedResults
    }

  } catch (error) {
    console.error('Error searching similar videos by ID:', error)

    // Handle specific TwelveLabs errors
    if (error instanceof Error) {
      // Check for search not supported (Pegasus doesn't support search)
      if (error.message.includes('index_not_supported_for_search')) {
        throw new Error('index_not_supported_for_search')
      }
      // Check for 403 authorization errors
      if (error.message.includes('403') || error.message.includes('read_not_allowed') || error.message.includes('not authorized')) {
        throw new Error('API key is not authorized to access this index. Please verify your TWELVE_LABS_INDEX_ID matches your API key account.')
      }
      if (error.message.includes('API key') || error.message.includes('unauthorized')) {
        throw new Error('TwelveLabs API key is not configured or invalid')
      }
      if (error.message.includes('index') || error.message.includes('not found')) {
        throw new Error('TwelveLabs index ID is not configured or invalid')
      }
    }

    throw new Error('Failed to search similar videos by ID')
  }
}

/**
 * Analyzes a video using TwelveLabs API
 * @param videoId - The video ID to analyze
 * @param indexId - Optional index ID (uses env default if not provided)
 * @returns Promise resolving to analysis results
 */
export async function analyzeVideo(
  videoId: string,
  indexId?: string
): Promise<VideoAnalysisResult> {
  try {
    console.log('🎬 Starting Twelve Labs video analysis for videoId:', videoId)

    // First check if video is ready for analysis
    const isReady = await isVideoReadyForAnalysis(videoId)
    if (!isReady) {
      throw new Error('Video is still being processed by Twelve Labs. Please wait for indexing to complete (typically 5-15 minutes) before analyzing.')
    }

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

    console.log('🔑 Twelve Labs client initialized')

    // Get comprehensive summary using Twelve Labs API
    console.log('📝 Generating video summary...')
    const summaryResult = await client.summarize({
      videoId,
      type: 'summary',
      prompt: 'Create a detailed summary of this advertisement video, including the product/service being advertised, key messaging, target audience, and overall creative approach.'
    })

    // Get gist information (titles, topics, hashtags)
    console.log('🏷️ Extracting video gist...')
    const gistResult = await client.gist({
      videoId,
      types: ['title', 'topic', 'hashtag']
    })

    // Get detailed scene-by-scene analysis
    console.log('🎭 Analyzing scenes and creative elements...')
    const sceneAnalysis = await client.analyze({
      videoId,
      prompt: `Analyze this advertisement scene by scene. For each major scene, describe:
      - What happens visually
      - Key objects and elements present
      - Emotional tone and audience reactions
      - How it contributes to the overall message
      Format as a structured list of scenes with timestamps.`,
      temperature: 0.2
    })

    // Get creative strengths and weaknesses
    console.log('💪 Analyzing creative strengths and weaknesses...')
    const strengthsAnalysis = await client.analyze({
      videoId,
      prompt: `Evaluate the creative strengths and weaknesses of this advertisement. Consider:
      - Storytelling effectiveness
      - Visual impact and production quality
      - Emotional resonance
      - Technical execution
      - Audience engagement potential
      Provide specific examples and actionable insights.`,
      temperature: 0.2
    })

    // Get target audience insights
    console.log('👥 Analyzing target audience...')
    const audienceAnalysis = await client.analyze({
      videoId,
      prompt: `Based on the content, visuals, and messaging in this advertisement, identify:
      - Primary target audience demographics (age, gender, interests, profession)
      - Psychographic profile (lifestyle, values, aspirations)
      - Why this audience would be interested in the product/service
      - Cultural or social context that resonates with them`,
      temperature: 0.2
    })

    // Extract themes from topics
    const themes = gistResult?.topics || []

    // Parse scene analysis to extract structured scene data
    const scenes = parseSceneAnalysis(sceneAnalysis?.data || '')

    // Parse strengths and weaknesses
    const { strengths, weaknesses } = parseStrengthsWeaknesses(strengthsAnalysis?.data || '')

    // Extract target audience
    const targetAudience = audienceAnalysis?.data || 'General audience'

    // Get summary text based on response type
    let summaryText = 'Analysis summary not available'
    if ('summary' in summaryResult && summaryResult.summary) {
      summaryText = summaryResult.summary
    }

    const analysisResult = {
      task_id: `analysis_${videoId}_${Date.now()}`,
      video_id: videoId,
      analysis_data: {
        summary: summaryText,
        scenes,
        themes,
        target_audience: targetAudience,
        strengths,
        weaknesses
      },
      extracted_at: new Date()
    }

    console.log('✅ Twelve Labs analysis completed:', {
      task_id: analysisResult.task_id,
      video_id: analysisResult.video_id,
      summary_length: analysisResult.analysis_data.summary?.length || 0,
      scenes_count: analysisResult.analysis_data.scenes.length,
      themes_count: analysisResult.analysis_data.themes.length,
      strengths_count: analysisResult.analysis_data.strengths.length,
      weaknesses_count: analysisResult.analysis_data.weaknesses.length
    })
    console.log('📝 Raw Twelve Labs summary:', analysisResult.analysis_data.summary)

    return analysisResult

  } catch (error) {
    console.error('❌ Error analyzing video with Twelve Labs:', error)

    // Provide more specific error messages
    if (error instanceof Error) {
      // Check for 403 authorization errors
      if (error.message.includes('403') || error.message.includes('read_not_allowed') || error.message.includes('not authorized')) {
        throw new Error('API key is not authorized to access this index. Please verify your TWELVE_LABS_INDEX_ID matches your API key account.')
      }
      if (error.message.includes('video_not_ready') || error.message.includes('still being indexed')) {
        throw new Error('Video is still being processed by Twelve Labs. Please wait for indexing to complete (typically 5-15 minutes) before analyzing.')
      }
      if (error.message.includes('not found')) {
        throw new Error('Video not found in Twelve Labs index')
      }
      if (error.message.includes('API key') || error.message.includes('unauthorized')) {
        throw new Error('Twelve Labs API key is invalid')
      }
      if (error.message.includes('quota') || error.message.includes('limit') || error.message.includes('rate')) {
        throw new Error('Twelve Labs API quota exceeded or rate limited')
      }
    }

    throw new Error('Failed to analyze video')
  }
}

/**
 * Parses scene analysis text into structured scene objects
 */
function parseSceneAnalysis(analysisText: string): Array<{
  start: number
  end: number
  description: string
  objects: string[]
  emotions: string[]
}> {
  // Simple parsing logic - in production, you might want more sophisticated NLP
  const scenes: Array<{
    start: number
    end: number
    description: string
    objects: string[]
    emotions: string[]
  }> = []

  // Split by common scene delimiters
  const sceneBlocks = analysisText.split(/\n\s*(?=Scene|scene|\d+\.|\-)/)

  sceneBlocks.forEach((block, index) => {
    if (block.trim().length < 20) return // Skip very short blocks

    // Estimate timing based on index (this is approximate)
    const start = index * 10 // Rough estimate: 10 seconds per scene
    const end = (index + 1) * 10

    // Extract description
    const description = block.replace(/^(Scene|scene|\d+\.|\-)\s*/i, '').trim()

    // Simple object extraction (look for common objects)
    const objects = extractObjects(description)

    // Simple emotion extraction
    const emotions = extractEmotions(description)

    scenes.push({
      start,
      end,
      description,
      objects,
      emotions
    })
  })

  // If no scenes were parsed, throw an error
  if (scenes.length === 0) {
    throw new Error('Failed to parse any scenes from the analysis text')
  }

  return scenes
}

/**
 * Parses strengths and weaknesses from analysis text
 */
function parseStrengthsWeaknesses(analysisText: string): { strengths: string[], weaknesses: string[] } {
  const strengths: string[] = []
  const weaknesses: string[] = []

  // Split into lines and look for strength/weakness indicators
  const lines = analysisText.split('\n')

  lines.forEach(line => {
    const lowerLine = line.toLowerCase().trim()

    if (lowerLine.includes('strength') || lowerLine.includes('good') || lowerLine.includes('effective') ||
        lowerLine.includes('strong') || lowerLine.includes('excellent') || lowerLine.includes('well')) {
      if (line.length > 10) strengths.push(line.trim())
    }

    if (lowerLine.includes('weakness') || lowerLine.includes('improve') || lowerLine.includes('could') ||
        lowerLine.includes('weak') || lowerLine.includes('lacking') || lowerLine.includes('issue')) {
      if (line.length > 10) weaknesses.push(line.trim())
    }
  })

  // If no specific strengths/weaknesses found, throw an error
  if (strengths.length === 0) {
    throw new Error('Failed to identify any strengths in the analysis text')
  }

  if (weaknesses.length === 0) {
    throw new Error('Failed to identify any weaknesses in the analysis text')
  }

  return { strengths, weaknesses }
}

/**
 * Extracts common objects from description text
 */
function extractObjects(description: string): string[] {
  const commonObjects = ['person', 'people', 'product', 'logo', 'text', 'screen', 'phone', 'computer', 'car', 'house', 'food', 'drink']
  const foundObjects: string[] = []

  commonObjects.forEach(obj => {
    if (description.toLowerCase().includes(obj)) {
      foundObjects.push(obj)
    }
  })

  return foundObjects.length > 0 ? foundObjects : ['advertisement elements']
}

/**
 * Extracts emotions from description text
 */
function extractEmotions(description: string): string[] {
  const commonEmotions = ['happy', 'sad', 'excited', 'frustrated', 'curious', 'trust', 'aspiration', 'joy', 'anger', 'surprise']
  const foundEmotions: string[] = []

  commonEmotions.forEach(emotion => {
    if (description.toLowerCase().includes(emotion)) {
      foundEmotions.push(emotion)
    }
  })

  return foundEmotions.length > 0 ? foundEmotions : ['engagement']
}

/**
 * Checks if a video is ready for analysis
 * @param videoId - The video ID to check
 * @returns Promise resolving to true if video is ready
 */
export async function isVideoReadyForAnalysis(videoId: string): Promise<boolean> {
  try {
    if (!process.env.TWELVE_LABS_API_KEY) {
      throw new Error('TwelveLabs API key is not configured')
    }

    const client = new TwelveLabs({
      apiKey: process.env.TWELVE_LABS_API_KEY
    })

    // Try a simple analysis call to check if video is ready
    try {
      await client.summarize({
        videoId,
        type: 'summary',
        prompt: 'Test summary'
      })
      return true
    } catch (error: any) {
      if (error.message?.includes('video_not_ready') || error.message?.includes('still being indexed')) {
        return false
      }
      // If it's a different error, the video might be ready but there was another issue
      return true
    }
  } catch (error) {
    console.error('Error checking video readiness:', error)
    return false
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
    } catch {
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