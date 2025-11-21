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
      prompt: `Analyze this advertisement and return a JSON array of scenes. Each scene must have exact timestamps, objects, and emotions.

Return ONLY a valid JSON array in this exact format:
[
  {
    "start": number (seconds from video start),
    "end": number (seconds from video start),
    "description": "Detailed description of what happens in this scene",
    "objects": ["array", "of", "visible", "objects"],
    "emotions": ["array", "of", "emotions", "conveyed"]
  }
]

Requirements:
- Use REAL timestamps from the video (don't estimate)
- Include ALL major scenes and transitions
- Objects should be specific (e.g., "iPhone 16 Pro Max", "person holding phone", "product logo")
- Emotions should be specific (e.g., "excitement", "curiosity", "aspiration")
- Description should be detailed and analytical
- Return ONLY the JSON array, no additional text`,
      temperature: 0.1
    })

    console.log('🎬 Raw scene analysis text:', sceneAnalysis?.data);

    // Get creative strengths and weaknesses
    console.log('💪 Analyzing creative strengths and weaknesses...')
    const strengthsAnalysis = await client.analyze({
      videoId,
      prompt: `Analyze the creative strengths and weaknesses of this advertisement.

Return ONLY a valid JSON object in this exact format:
{
  "strengths": ["Specific strength 1 with explanation", "Specific strength 2 with explanation"],
  "weaknesses": ["Specific weakness 1 with explanation", "Specific weakness 2 with explanation"]
}

Consider:
- Storytelling effectiveness and narrative flow
- Visual impact and production quality
- Emotional resonance and audience connection
- Technical execution and editing
- Audience engagement potential
- Brand alignment and messaging clarity

Each item should be specific, actionable, and include why it matters for ad performance.`,
      temperature: 0.1
    })

    // Get target audience insights
    console.log('👥 Analyzing target audience...')
    const audienceAnalysis = await client.analyze({
      videoId,
      prompt: `Based on this advertisement's content, visuals, and messaging, identify the target audience.

Return ONLY a string describing the target audience in 2-3 detailed sentences. Include:
- Demographics (age range, gender, location, profession)
- Psychographics (lifestyle, values, interests, aspirations)
- Why they would be interested in this product
- Cultural or social context that resonates

Be specific and data-driven based on the ad's content.`,
      temperature: 0.2
    })

    // Extract themes from topics
    const themes = gistResult?.topics || []

    // Parse scene analysis to extract structured scene data
    const scenes = parseSceneAnalysis(sceneAnalysis?.data || '')

    // Parse strengths and weaknesses from LLM response
    const { strengths, weaknesses } = parseStrengthsWeaknessesLLM(strengthsAnalysis?.data || '')

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
 * Parses scene analysis text into structured scene objects using LLM-generated JSON
 */
function parseSceneAnalysis(analysisText: string): Array<{
  start: number
  end: number
  description: string
  objects: string[]
  emotions: string[]
}> {
  try {
    // Try to parse as JSON first (if LLM returned structured data)
    const parsed = JSON.parse(analysisText)
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].start !== undefined) {
      return parsed
    }
  } catch {
    // Not JSON, continue with text parsing
  }

  // If LLM didn't return JSON, try to extract structured data from text
  const scenes: Array<{
    start: number
    end: number
    description: string
    objects: string[]
    emotions: string[]
  }> = []

  // Look for structured scene data in the text
  const sceneRegex = /Scene\s*\d+[:\s]*\(?(\d+)s?\s*-\s*(\d+)s?\)?[:\s]*(.*?)(?=Scene\s*\d+|$)/gis
  let match

  while ((match = sceneRegex.exec(analysisText)) !== null) {
    const start = parseInt(match[1], 10)
    const end = parseInt(match[2], 10)
    const description = match[3].trim()

    if (!isNaN(start) && !isNaN(end) && description) {
      scenes.push({
        start,
        end,
        description,
        objects: [], // LLM should provide this
        emotions: []  // LLM should provide this
      })
    }
  }

  // If no structured scenes found, this indicates LLM failed to provide proper format
  if (scenes.length === 0) {
    throw new Error('LLM did not provide scene analysis in expected format. Please check the prompt and try again.')
  }

  return scenes
}

/**
 * Parses strengths and weaknesses from LLM analysis text
 */
function parseStrengthsWeaknessesLLM(analysisText: string): { strengths: string[], weaknesses: string[] } {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(analysisText)
    if (parsed.strengths && parsed.weaknesses) {
      return {
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [parsed.strengths],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [parsed.weaknesses]
      }
    }
  } catch {
    // Not JSON, continue with text parsing
  }

  // Extract from text format
  const strengths: string[] = []
  const weaknesses: string[] = []

  // Look for structured sections
  const strengthSection = analysisText.match(/(?:strengths?|advantages?)(?:\s*:|\n)(.*?)(?:\n\n|\n(?:weaknesses?|disadvantages?)|$)/is)
  const weaknessSection = analysisText.match(/(?:weaknesses?|disadvantages?)(?:\s*:|\n)(.*?)(?:\n\n|$)/is)

  if (strengthSection) {
    const strengthItems = strengthSection[1].split(/[•\-\*\d+\.]/).filter(item => item.trim().length > 5)
    strengths.push(...strengthItems.map(item => item.trim()))
  }

  if (weaknessSection) {
    const weaknessItems = weaknessSection[1].split(/[•\-\*\d+\.]/).filter(item => item.trim().length > 5)
    weaknesses.push(...weaknessItems.map(item => item.trim()))
  }

  // If no structured data found, extract from general text
  if (strengths.length === 0 || weaknesses.length === 0) {
    const lines = analysisText.split('\n').filter(line => line.trim().length > 10)

    lines.forEach(line => {
      const lowerLine = line.toLowerCase().trim()

      if (lowerLine.includes('strength') || lowerLine.includes('good') || lowerLine.includes('effective') ||
          lowerLine.includes('strong') || lowerLine.includes('excellent') || lowerLine.includes('well') ||
          lowerLine.includes('advantage')) {
        strengths.push(line.trim())
      }

      if (lowerLine.includes('weakness') || lowerLine.includes('improve') || lowerLine.includes('could') ||
          lowerLine.includes('weak') || lowerLine.includes('lacking') || lowerLine.includes('issue') ||
          lowerLine.includes('disadvantage')) {
        weaknesses.push(line.trim())
      }
    })
  }

  // If still no data, throw error to indicate LLM didn't provide expected format
  if (strengths.length === 0) {
    throw new Error('LLM did not provide strengths analysis in expected format')
  }

  if (weaknesses.length === 0) {
    throw new Error('LLM did not provide weaknesses analysis in expected format')
  }

  return { strengths, weaknesses }
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