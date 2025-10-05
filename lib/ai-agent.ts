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
import { SYSTEM_PROMPT, TOOL_DEFINITIONS, SYNTHESIS_PROMPT } from './prompts'
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
    console.error('Error analyzing video with Twelve Labs:', error)
    // Fallback to basic mock data if API fails
    return {
      task_id: `fallback_${videoId}`,
      video_id: videoId,
      analysis_data: {
        scenes: [
          {
            start: 0,
            end: 10,
            description: "Video content analysis pending",
            objects: ["video"],
            emotions: ["neutral"]
          }
        ],
        themes: ["content"],
        target_audience: "general",
        strengths: ["uploaded successfully"],
        weaknesses: ["analysis failed"]
      },
      extracted_at: new Date()
    }
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

    // Create the synthesis prompt with context
    const synthesisPrompt = `${SYNTHESIS_PROMPT}

Context from analysis pipeline:
${JSON.stringify(context, null, 2)}

Please provide your analysis in the required function call format.`

    console.log('📝 Final synthesis prompt being sent to Groq:')
    console.log('--- SYNTHESIS PROMPT START ---')
    console.log(synthesisPrompt)
    console.log('--- SYNTHESIS PROMPT END ---')

    // Make the API call with function calling
    console.log('🔄 Making Groq API call with model: openai/gpt-oss-20b')
    console.log('📝 Synthesis prompt length:', synthesisPrompt.length)
    console.log('🛠️ Tools count:', TOOL_DEFINITIONS.length)
    console.log('🤖 System prompt preview:', SYSTEM_PROMPT.substring(0, 200) + '...')
    console.log('🔧 Tool definitions:', TOOL_DEFINITIONS.map(t => t.function.name))

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: synthesisPrompt
        }
      ],
      tools: TOOL_DEFINITIONS,
      tool_choice: { type: "function", function: { name: "generate_analysis_report" } },
      temperature: 0.3,
      max_tokens: 2000
    })

    console.log('✅ Groq API response received')
    console.log('📊 Response choices:', completion.choices?.length)
    console.log('🔧 Tool calls:', completion.choices?.[0]?.message?.tool_calls?.length)

    // Extract the function call from the response
    const toolCall = completion.choices[0]?.message?.tool_calls?.[0]
    console.log('🎯 Tool call function name:', toolCall?.function?.name)
    console.log('📄 Tool call arguments length:', toolCall?.function?.arguments?.length)

    if (!toolCall || toolCall.function.name !== 'generate_analysis_report') {
      console.error('❌ Invalid tool call:', toolCall)
      throw new Error('Failed to get analysis report from AI response')
    }

    // Parse the function arguments
    console.log('🔍 Parsing function arguments...')
    const report = JSON.parse(toolCall.function.arguments)
    console.log('✅ Successfully parsed analysis report')

    return report

  } catch (error) {
    console.error('❌ Error generating analysis report with Groq:', error)
    console.error('🔍 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.constructor.name : 'Unknown',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })

    // Fallback to mock data if API fails
    console.log('Falling back to mock analysis report')
    return {
      twelve_labs_summary: "This video advertisement presents a comprehensive solution for modern productivity challenges. The 45-second spot opens with relatable scenarios of professionals struggling with time management and information overload. The product demonstration showcases intuitive features through clean, modern UI animations. Customer testimonials highlight significant efficiency improvements, with one user reporting 40% time savings. The ad maintains professional production quality throughout, with clear audio and engaging visuals. Target audience analysis indicates strong appeal to tech-savvy millennials aged 25-35 working in knowledge-based industries.",
      success_prediction: {
        confidence_score: 75,
        key_strengths: ["Video uploaded successfully"],
        performance_factors: ["Analysis pipeline completed"],
        audience_fit: "General audience",
        competitive_advantage: "New campaign"
      },
      risk_assessment: {
        risk_level: "medium",
        potential_issues: ["API integration in progress"],
        failure_risks: ["Technical issues during analysis"],
        mitigation_suggestions: ["Retry analysis", "Check API configuration"]
      },
      personalized_recommendations: {
        decision_suggestion: "suspend",
        action_items: ["Complete API integration", "Test analysis pipeline"],
        optimization_priorities: ["Fix Groq API connection"],
        user_specific_insights: analysisResults.user_profile?.summary || "Analysis in development"
      },
      creative_analysis: {
        storytelling_effectiveness: "Analysis pending API integration",
        visual_impact: "Video uploaded successfully",
        emotional_resonance: "To be determined",
        technical_quality: "Video processing completed"
      },
      competitive_intelligence: {
        market_positioning: "Analysis in progress",
        benchmark_comparison: "Data collection ongoing",
        differentiation_opportunities: "To be evaluated",
        trend_alignment: "Market research pending"
      }
    }
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
    console.error('Error analyzing advertisement:', error)
    throw new Error('Failed to complete advertisement analysis')
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