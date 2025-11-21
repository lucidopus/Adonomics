import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb/client'
import { UserPreferencesModel } from '@/lib/mongodb/models/UserPreferences'
import {
  ROLE_OPTIONS,
  PRIMARY_GOAL_OPTIONS,
  DECISION_FACTOR_OPTIONS,
  TECHNICAL_COMFORT_OPTIONS,
  CAMPAIGN_TYPE_OPTIONS,
  PLATFORM_OPTIONS,
  INSIGHT_TIMING_OPTIONS,
  RESULT_SPEED_OPTIONS,
  TEAM_MEMBER_OPTIONS,
  SHARING_FORMAT_OPTIONS,
  PAIN_POINT_OPTIONS,
  UserRole,
  PrimaryGoal,
  DecisionFactor,
  TechnicalComfort,
  CampaignType,
  Platform,
  InsightTiming,
  ResultSpeed,
  TeamMember,
  SharingFormat,
  PainPoint
} from '@/types/database'
import { searchSimilarVideosById, analyzeVideo } from './twelve-labs'

import Groq from 'groq-sdk'

// Note: Twelve Labs analysis would be done via their API
// For now, we'll mock the analysis result
interface TwelveLabsAnalysis {
  task_id: string
  video_id: string
  analysis_data: {
    summary?: string
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

interface UserProfile {
  summary: string
  generated_at: Date
}

interface CompetitiveSearch {
  similar_ads: Array<{
    id: string
    title?: string
    score?: number
    performance_indicators: {
      engagement_rate: number
      conversion_rate: number
      success_factors: string[]
    }
  }>
  searched_at: Date
}

interface AnalysisResults {
  video_analysis?: TwelveLabsAnalysis
  user_profile?: UserProfile
  competitive_search?: CompetitiveSearch
  synthesis?: {
    report: AnalysisReport
    generated_at: Date
  }
}

interface AnalysisReport {
  twelve_labs_summary?: string // Raw summary from Twelve Labs
  metadata?: {
    ad_id: string
    brand?: string
    campaign_name?: string
    year?: number
    quarter?: string
    platform?: string
    region?: string
  }
  creative_features?: {
    scene_id?: string
    scene_duration?: number
    objects_present?: string[]
    faces_detected?: number
    brand_logo_presence?: boolean
    text_on_screen?: string[]
    audio_elements?: string[]
    music_tempo?: string
    music_mode?: string
    color_palette_dominant?: string[]
    editing_pace?: number
  }
  emotional_features?: {
    emotion_primary?: string
    emotion_intensity?: number
    emotional_arc_timeline?: string[]
    tone_of_voice?: string
    facial_expression_emotions?: Record<string, number>
    audience_perceived_sentiment?: string
    cultural_sensitivity_flag?: boolean
  }
  success_prediction: {
    confidence_score: number
    key_strengths: string[]
    performance_factors: string[]
    audience_fit: string
    competitive_advantage: string
  }
  risk_assessment: {
    risk_level: 'low' | 'medium' | 'high'
    potential_issues: string[]
    failure_risks: string[]
    mitigation_suggestions: string[]
  }
  personalized_recommendations: {
    decision_suggestion: 'approve' | 'suspend' | 'reject'
    action_items: string[]
    optimization_priorities: string[]
    user_specific_insights: string
    performance_based_rationale?: string
    expected_roi_impact?: string
    competitive_benchmarking?: string
  }
  creative_analysis: {
    storytelling_effectiveness: string
    visual_impact: string
    emotional_resonance: string
    technical_quality: string
  }
  competitive_intelligence: {
    market_positioning: string
    benchmark_comparison: string
    differentiation_opportunities: string
    trend_alignment: string
  }
}

/**
 * Generate user profile summary directly from database (server-side only)
 */
export async function generateUserProfileSummaryDirect(userId: string): Promise<string> {
  try {
    // Fetch user preferences from database directly
    const client = await clientPromise
    const db = client.db()

    const preferences = await db.collection(UserPreferencesModel.collectionName).findOne({
      user_id: new ObjectId(userId)
    })

    if (!preferences) {
      // Return empty preferences summary for new users
      return 'New user with no profile information available yet.'
    }

    // Convert database document to UserPreferences interface
    const userPreferences: {
      role?: UserRole
      primary_goals?: PrimaryGoal[]
      decision_factors?: DecisionFactor[]
      technical_comfort?: TechnicalComfort
      campaign_types?: CampaignType[]
      platforms?: Platform[]
      insight_timing?: InsightTiming[]
      result_speed?: ResultSpeed
      team_members?: TeamMember[]
      sharing_formats?: SharingFormat[]
      pain_points?: PainPoint[]
    } = {
      role: preferences.role,
      primary_goals: preferences.primary_goals,
      decision_factors: preferences.decision_factors,
      technical_comfort: preferences.technical_comfort,
      campaign_types: preferences.campaign_types,
      platforms: preferences.platforms,
      insight_timing: preferences.insight_timing,
      result_speed: preferences.result_speed,
      team_members: preferences.team_members,
      sharing_formats: preferences.sharing_formats,
      pain_points: preferences.pain_points
    }

    // Build the summary
    const summaryParts: string[] = []

    // Role
    if (userPreferences.role) {
      const roleOption = ROLE_OPTIONS.find(opt => opt.value === userPreferences.role)
      if (roleOption) {
        summaryParts.push(`The user is a ${roleOption.label.toLowerCase()}.`)
      }
    }

    // Primary goals
    if (userPreferences.primary_goals && userPreferences.primary_goals.length > 0) {
      const goalLabels = userPreferences.primary_goals
        .map((goal: PrimaryGoal) => PRIMARY_GOAL_OPTIONS.find(opt => opt.value === goal)?.label.toLowerCase())
        .filter(Boolean)

      if (goalLabels.length > 0) {
        const goalsText = goalLabels.length === 1
          ? goalLabels[0]
          : goalLabels.length === 2
            ? goalLabels.join(' and ')
            : goalLabels.slice(0, -1).join(', ') + ', and ' + goalLabels[goalLabels.length - 1]

        summaryParts.push(`Their primary goals are to ${goalsText}.`)
      }
    }

    // Decision factors (prioritized)
    if (userPreferences.decision_factors && userPreferences.decision_factors.length > 0) {
      const factorLabels = userPreferences.decision_factors
        .map((factor: DecisionFactor) => DECISION_FACTOR_OPTIONS.find(opt => opt.value === factor)?.label.toLowerCase())
        .filter(Boolean)

      if (factorLabels.length > 0) {
        summaryParts.push(`They prioritize ${factorLabels.join(', ')} when evaluating creative performance.`)
      }
    }

    // Technical comfort
    if (userPreferences.technical_comfort) {
      const comfortOption = TECHNICAL_COMFORT_OPTIONS.find(opt => opt.value === userPreferences.technical_comfort)
      if (comfortOption) {
        summaryParts.push(`They prefer ${comfortOption.label.toLowerCase()}.`)
      }
    }

    // Campaign types and platforms
    const campaignLabels = userPreferences.campaign_types
      ?.map((type: CampaignType) => CAMPAIGN_TYPE_OPTIONS.find(opt => opt.value === type)?.label.toLowerCase())
      .filter(Boolean) || []

    const platformLabels = userPreferences.platforms
      ?.map((platform: Platform) => PLATFORM_OPTIONS.find(opt => opt.value === platform)?.label)
      .filter(Boolean) || []

    if (campaignLabels.length > 0 || platformLabels.length > 0) {
      const contextParts: string[] = []

      if (campaignLabels.length > 0) {
        contextParts.push(`runs ${campaignLabels.join(', ')} campaigns`)
      }

      if (platformLabels.length > 0) {
        contextParts.push(`advertises on ${platformLabels.join(', ')}`)
      }

      if (contextParts.length > 0) {
        summaryParts.push(`They typically ${contextParts.join(' and ')}.`)
      }
    }

    // Insight timing and result speed
    const timingLabels = userPreferences.insight_timing
      ?.map((timing: InsightTiming) => INSIGHT_TIMING_OPTIONS.find(opt => opt.value === timing)?.label.toLowerCase())
      .filter(Boolean) || []

    if (userPreferences.result_speed) {
      const speedOption = RESULT_SPEED_OPTIONS.find(opt => opt.value === userPreferences.result_speed)
      if (speedOption) {
        const timingText = timingLabels.length > 0
          ? `during ${timingLabels.join(', ')} phases`
          : ''

        summaryParts.push(`They need insights ${timingText} ${speedOption.label.toLowerCase()}.`)
      }
    }

    // Team members and sharing formats
    const teamLabels = userPreferences.team_members
      ?.map((member: TeamMember) => TEAM_MEMBER_OPTIONS.find(opt => opt.value === member)?.label.toLowerCase())
      .filter(Boolean) || []

    const formatLabels = userPreferences.sharing_formats
      ?.map((format: SharingFormat) => SHARING_FORMAT_OPTIONS.find(opt => opt.value === format)?.label.toLowerCase())
      .filter(Boolean) || []

    if (teamLabels.length > 0 || formatLabels.length > 0) {
      const collaborationParts: string[] = []

      if (teamLabels.length > 0) {
        collaborationParts.push(`shares insights with ${teamLabels.join(', ')}`)
      }

      if (formatLabels.length > 0) {
        collaborationParts.push(`prefers ${formatLabels.join(', ')} for sharing`)
      }

      if (collaborationParts.length > 0) {
        summaryParts.push(`They ${collaborationParts.join(' and ')}.`)
      }
    }

    // Pain points
    if (userPreferences.pain_points && userPreferences.pain_points.length > 0) {
      const painLabels = userPreferences.pain_points
        .map((point: PainPoint) => PAIN_POINT_OPTIONS.find(opt => opt.value === point)?.label.toLowerCase())
        .filter(Boolean)

      if (painLabels.length > 0) {
        summaryParts.push(`Their main frustrations include ${painLabels.join(', ')}.`)
      }
    }

    // Combine all parts into a coherent summary
    return summaryParts.length > 0
      ? summaryParts.join(' ')
      : 'No profile information available.'

  } catch (error) {
    console.error('Error generating user profile summary:', error)
    return 'Unable to generate profile summary at this time.'
  }
}

/**
 * Analyze video using Twelve Labs API
 */
async function analyzeVideoWithTwelveLabs(videoId: string): Promise<TwelveLabsAnalysis> {
  try {
    // Call the real Twelve Labs analysis API
    const analysisResult = await analyzeVideo(videoId)
    return analysisResult
  } catch (error) {
    console.error('❌ Error analyzing video with Twelve Labs:', error)
    throw new Error(`Failed to analyze video with Twelve Labs: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get competitive intelligence by searching similar ads
 */
async function getCompetitiveIntelligence(videoId: string): Promise<CompetitiveSearch> {
  try {
    console.log('🔍 Starting competitive intelligence search for videoId:', videoId)

    // Use existing search function to find similar videos
    const searchResults = await searchSimilarVideosById(videoId)
    console.log('📈 Found similar videos:', searchResults.data.length)

    const competitiveResults = {
      similar_ads: searchResults.data.map(ad => ({
        id: ad.id,
        title: ad.title,
        score: ad.score,
        performance_indicators: {
          // Mock performance data - in production, get from database
          engagement_rate: Math.random() * 0.1,
          conversion_rate: Math.random() * 0.05,
          success_factors: ["strong hook", "clear value prop"]
        }
      })),
      searched_at: new Date()
    }

    console.log('✅ Competitive intelligence gathered:', {
      similar_ads_count: competitiveResults.similar_ads.length,
      top_score: competitiveResults.similar_ads[0]?.score || 'N/A'
    })

    return competitiveResults
  } catch (error) {
    // Pegasus index doesn't support search - this is expected
    if (error instanceof Error && error.message.includes('index_not_supported_for_search')) {
      console.log('⚠️  Competitive intelligence skipped - Pegasus index does not support search (generation-only model)')
      return {
        similar_ads: [],
        searched_at: new Date()
      }
    }
    console.error('Error getting competitive intelligence:', error)
    return {
      similar_ads: [],
      searched_at: new Date()
    }
  }
}

/**
 * Execute the three-step analysis pipeline
 */
export async function executeAnalysisPipeline(
  videoId: string,
  userId: string
): Promise<AnalysisResults> {
  const results: AnalysisResults = {}

  try {
    // Step 1: Deep Video Understanding
    console.log('Step 1: Analyzing video with Twelve Labs')
    results.video_analysis = await analyzeVideoWithTwelveLabs(videoId)

    // Step 2: User Personalization
    console.log('Step 2: Generating user profile summary')
    const profileSummary = await generateUserProfileSummaryDirect(userId)
    results.user_profile = {
      summary: profileSummary,
      generated_at: new Date()
    }

    // Step 3: Competitive Intelligence
    console.log('Step 3: Gathering competitive intelligence')
    results.competitive_search = await getCompetitiveIntelligence(videoId)

    return results
  } catch (error) {
    console.error('Error in analysis pipeline:', error)
    throw error
  }
}

/**
 * Generate final analysis report using AI synthesis with Groq API
 */
export async function generateAnalysisReport(
  analysisResults: AnalysisResults
): Promise<AnalysisReport> {
  try {
    // Validate Groq API key
    if (!process.env.GROQ_API_KEY) {
      throw new Error('Groq API key is not configured')
    }

    // Initialize Groq client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    })

    // Prepare the context from analysis results
    const context = {
      twelve_labs_summary: analysisResults.video_analysis?.analysis_data?.summary,
      video_analysis: analysisResults.video_analysis,
      user_profile: analysisResults.user_profile,
      competitive_search: analysisResults.competitive_search
    }

    // Create a simplified synthesis prompt
    const synthesisPrompt = `Generate a JSON analysis report for this video advertisement using the following data:

Video Summary: ${context.twelve_labs_summary || 'No summary available'}

User Profile: ${context.user_profile?.summary || 'No profile available'}

Competitive Data: ${context.competitive_search?.similar_ads?.length || 0} similar ads found

Return ONLY a valid JSON object with this exact same structure:
{
  "twelve_labs_summary": "string",
  "metadata": {"ad_id": "string", "brand": "string", "campaign_name": "string", "year": 2024, "quarter": "Q4", "platform": "YouTube", "region": "Global"},
  "creative_features": {"scene_id": "main", "scene_duration": 30, "objects_present": ["product"], "faces_detected": 1, "brand_logo_presence": true, "text_on_screen": ["CTA"], "audio_elements": ["music"], "music_tempo": "moderate", "music_mode": "positive", "color_palette_dominant": ["#000"], "editing_pace": 1.0},
  "emotional_features": {"emotion_primary": "positive", "emotion_intensity": 7, "emotional_arc_timeline": ["intro", "body", "cta"], "tone_of_voice": "confident", "facial_expression_emotions": {"happy": 0.8}, "audience_perceived_sentiment": "positive", "cultural_sensitivity_flag": false},
  "success_prediction": {"confidence_score": 80, "key_strengths": ["Clear message"], "performance_factors": ["Good targeting"], "audience_fit": "Target demographic", "competitive_advantage": "Unique value prop"},
  "risk_assessment": {"risk_level": "low", "potential_issues": ["Minor issues"], "failure_risks": ["Low engagement"], "mitigation_suggestions": ["Monitor performance"]},
  "personalized_recommendations": {"decision_suggestion": "approve", "action_items": ["Launch campaign"], "optimization_priorities": ["Audience targeting"], "user_specific_insights": "Based on your profile", "performance_based_rationale": "Meets KPIs", "expected_roi_impact": "Positive ROI", "competitive_benchmarking": "Above average"},
  "creative_analysis": {"storytelling_effectiveness": "Good", "visual_impact": "Strong", "emotional_resonance": "High", "technical_quality": "Professional"},
  "competitive_intelligence": {"market_positioning": "Competitive", "benchmark_comparison": "Above average", "differentiation_opportunities": ["Unique features"], "trend_alignment": "Current trends"}
}

Fill in the values based on the provided data. Respond with ONLY the JSON object, no additional text.`

    console.log('📝 Final synthesis prompt being sent to Groq:')
    console.log('--- SYNTHESIS PROMPT START ---')
    console.log(synthesisPrompt.substring(0, 500) + '...')
    console.log('--- SYNTHESIS PROMPT END ---')

    // Try with a reliable model
    console.log('🔄 Making Groq API call with model: openai/gpt-oss-120b')
    console.log('📝 Synthesis prompt length:', synthesisPrompt.length)

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that generates structured JSON analysis reports for video advertisements. Always respond with valid JSON only, no additional text."
        },
        {
          role: "user",
          content: synthesisPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000
    })

    console.log('✅ Groq API response received')
    console.log('📊 Response choices:', completion.choices?.length)

    // Extract the JSON response
    const messageContent = completion.choices[0]?.message?.content
    console.log('📄 Response content length:', messageContent?.length)

    if (!messageContent) {
      throw new Error('No content received from AI')
    }

    console.log('🔍 Parsing JSON response...')
    console.log('📄 Raw response preview:', messageContent.substring(0, 200) + '...')

    const report = JSON.parse(messageContent)
    console.log('✅ Successfully parsed analysis report')

    return report

  } catch (error) {
    console.error('❌ Error generating analysis report with Groq:', error)
    console.error('🔍 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.constructor.name : 'Unknown',
      stack: error instanceof Error ? error.stack?.substring(0, 500) : 'No stack trace'
    })

    throw new Error(`Failed to generate analysis report: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Main function to analyze an advertisement
 * Orchestrates the entire analysis pipeline
 */
export async function analyzeAdvertisement(
  videoId: string,
  userId: string
): Promise<AnalysisResults> {
  try {
    console.log(`Starting analysis for video ${videoId} by user ${userId}`)

    // Execute the three-step pipeline
    const analysisResults = await executeAnalysisPipeline(videoId, userId)

    // Generate final report
    const report = await generateAnalysisReport(analysisResults)

    // Add synthesis to results
    analysisResults.synthesis = {
      report,
      generated_at: new Date()
    }

    console.log('Analysis completed successfully')
    return analysisResults

  } catch (error) {
    console.error('❌ Error analyzing advertisement:', error)
    console.error('🔍 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      phase: 'advertisement_analysis'
    })
    throw error // Re-throw the original error for better debugging
  }
}

/**
 * Synthesize advertisement analysis (alias for generateAnalysisReport)
 */
export async function synthesizeAdAnalysis(
  analysisResults: AnalysisResults
): Promise<AnalysisReport> {
  return generateAnalysisReport(analysisResults)
}

/**
 * Creative Genome Agent class (placeholder for future agent implementation)
 */
export class CreativeGenomeAgent {
  async analyze(videoId: string, userId: string) {
    return analyzeAdvertisement(videoId, userId)
  }
}

