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
 * Compares against live ads to predict performance
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

    // Fetch live ads for benchmarking
    console.log('📊 Fetching live ads for benchmarking...')
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'adonomics')
    const liveAds = await db.collection('advertisements')
      .find({ status: 'live' })
      .limit(10)
      .toArray()

    console.log(`✅ Found ${liveAds.length} live ads for comparison`)

    // Extract detailed Twelve Labs analysis
    const videoAnalysis = analysisResults.video_analysis?.analysis_data
    const scenes = videoAnalysis?.scenes || []
    const summary = videoAnalysis?.summary || ''
    const themes = videoAnalysis?.themes || []
    const targetAudience = videoAnalysis?.target_audience || ''
    const strengths = videoAnalysis?.strengths || []
    const weaknesses = videoAnalysis?.weaknesses || []

    // Calculate video metadata from scenes
    const totalDuration = scenes.length > 0 ? Math.max(...scenes.map(s => s.end)) : 0
    const sceneCount = scenes.length
    const avgSceneDuration = sceneCount > 0 ? totalDuration / sceneCount : 0

    // Extract objects and emotions across all scenes
    const allObjects = [...new Set(scenes.flatMap(s => s.objects || []))]
    const allEmotions = [...new Set(scenes.flatMap(s => s.emotions || []))]

    // Prepare benchmark data from live ads
    const benchmarkData = liveAds.map(ad => ({
      video_title: ad.video_title,
      duration: ad.duration_seconds,
      platform: ad.platform,
      metrics: ad.metrics,
      creative: ad.creative,
      insights: ad.insights,
      performance_grade: ad.insights?.performance_grade
    }))

    // Calculate average metrics from live ads
    const avgMetrics = {
      ctr: liveAds.reduce((sum, ad) => sum + (ad.metrics?.ctr || 0), 0) / liveAds.length,
      vtr: liveAds.reduce((sum, ad) => sum + (ad.metrics?.vtr || 0), 0) / liveAds.length,
      conversion_rate: liveAds.reduce((sum, ad) => sum + (ad.metrics?.conversion_rate || 0), 0) / liveAds.length,
      completion_rate: liveAds.reduce((sum, ad) => sum + (ad.metrics?.completion_rate || 0), 0) / liveAds.length,
      engagement_score: liveAds.reduce((sum, ad) => sum + (ad.metrics?.engagement_score || 0), 0) / liveAds.length,
      roas: liveAds.reduce((sum, ad) => sum + (ad.metrics?.roas || 0), 0) / liveAds.length
    }

    // Create comprehensive synthesis prompt
    const synthesisPrompt = `You are an expert advertising analyst. Analyze this video advertisement and predict its performance by comparing it against live ad benchmarks.

## VIDEO ANALYSIS DATA

### Summary
${summary}

### Video Metadata
- Total Duration: ${totalDuration}s
- Scene Count: ${sceneCount}
- Average Scene Duration: ${avgSceneDuration.toFixed(1)}s
- Pacing: ${avgSceneDuration < 3 ? 'fast' : avgSceneDuration < 6 ? 'medium' : 'slow'}

### Scene-by-Scene Breakdown
${scenes.slice(0, 15).map((scene, idx) => `
Scene ${idx + 1} (${scene.start}s - ${scene.end}s):
- Description: ${scene.description}
- Objects: ${scene.objects?.join(', ') || 'none'}
- Emotions: ${scene.emotions?.join(', ') || 'none'}
`).join('\n')}

### Creative Elements Detected
- Objects Present: ${allObjects.join(', ') || 'none detected'}
- Emotions Conveyed: ${allEmotions.join(', ') || 'none detected'}
- Themes: ${themes.join(', ') || 'none identified'}

### Target Audience
${targetAudience}

### Twelve Labs Analysis
Strengths: ${strengths.join(' | ')}
Weaknesses: ${weaknesses.join(' | ')}

## USER PROFILE & PRIORITIES
${analysisResults.user_profile?.summary || 'No profile available'}

**IMPORTANT:** This analysis MUST be tailored to this specific user's profile. Address their:
- Primary goals (what metrics and outcomes they care about most)
- Decision factors (what they prioritize when evaluating creative)
- Campaign types and platforms they use
- Pain points and frustrations they experience
- How quickly they need results and in what format

Your recommendations, predictions, and insights should speak directly to THEIR needs, not generic best practices.

## LIVE AD BENCHMARKS (for comparison)

Average Performance Metrics Across Live Ads:
- CTR: ${avgMetrics.ctr.toFixed(2)}%
- VTR: ${avgMetrics.vtr.toFixed(0)}%
- Conversion Rate: ${avgMetrics.conversion_rate.toFixed(1)}%
- Completion Rate: ${avgMetrics.completion_rate.toFixed(0)}%
- Engagement Score: ${avgMetrics.engagement_score.toFixed(0)}
- ROAS: ${avgMetrics.roas.toFixed(2)}x

Live Ad Examples:
${benchmarkData.slice(0, 5).map(ad => `
- "${ad.video_title}" (${ad.duration}s on ${ad.platform})
  Grade: ${ad.performance_grade}
  CTR: ${ad.metrics?.ctr}%, VTR: ${ad.metrics?.vtr}%, Conv: ${ad.metrics?.conversion_rate}%
  Creative: ${ad.creative?.pacing} pacing, ${ad.creative?.dominant_emotion} emotion
  Has CTA: ${ad.creative?.has_cta}, Has Music: ${ad.creative?.has_music}, Has Faces: ${ad.creative?.has_faces}
  Top Strength: ${ad.insights?.strengths?.[0]?.element || 'N/A'}
`).join('\n')}

## YOUR TASK

Compare this new ad against the live ad benchmarks and generate a comprehensive, data-driven analysis report.

**Critical Instructions:**
1. Analyze how this ad's creative elements compare to successful live ads
2. Identify specific patterns from high-performing ads (A/B grade) that this ad has or lacks
3. Predict specific performance metrics (CTR, VTR, conversion rate, engagement score, ROAS) with rationale
4. Provide actionable recommendations with expected impact percentages
5. Assign a realistic performance grade (A/B/C/D/F) based on comparison to live ads
6. Be specific and quantitative - use numbers, timestamps, percentages, and concrete examples

Return ONLY a valid JSON object with this EXACT structure (all fields required for UI compatibility):
{
  "twelve_labs_summary": "2-3 sentence summary of the ad's key creative approach",
  "metadata": {
    "brand": "extracted brand name",
    "campaign_name": "inferred campaign theme/name",
    "year": ${new Date().getFullYear()},
    "quarter": "Q${Math.ceil((new Date().getMonth() + 1) / 3)}",
    "platform": "youtube/meta/tiktok/instagram based on duration and style",
    "region": "Global or specific region if identifiable"
  },
  "creative_features": {
    "scene_id": "main",
    "scene_duration": ${totalDuration},
    "scene_count": ${sceneCount},
    "avg_scene_duration": ${avgSceneDuration.toFixed(1)},
    "pacing": "fast/medium/slow",
    "objects_present": ${JSON.stringify(allObjects.slice(0, 10))},
    "faces_detected": number (count from video),
    "brand_logo_presence": true/false,
    "text_on_screen": ["text elements visible"],
    "audio_elements": ["music", "voiceover", "sound effects"],
    "music_tempo": "fast/moderate/slow",
    "music_mode": "upbeat/neutral/dramatic",
    "color_palette_dominant": ["#hexcolor1", "#hexcolor2"],
    "editing_pace": number (cuts per second, estimate based on scene count/duration)
  },
  "emotional_features": {
    "emotion_primary": "joy/excitement/inspiration/calm/humor/etc",
    "emotion_intensity": number (1-10 scale),
    "emotional_arc_timeline": ["beginning emotion", "middle emotion", "end emotion"],
    "tone_of_voice": "confident/playful/serious/aspirational",
    "facial_expression_emotions": {"happy": 0-1, "surprised": 0-1, "excited": 0-1},
    "audience_perceived_sentiment": "positive/neutral/negative",
    "cultural_sensitivity_flag": false (true only if issues detected)
  },
  "success_prediction": {
    "confidence_score": number (0-100, based on comparison to successful live ads),
    "key_strengths": ["Short strength 1", "Short strength 2", "Short strength 3"],
    "performance_factors": ["Factor contributing to success 1", "Factor 2"],
    "audience_fit": "Brief description of target audience alignment",
    "competitive_advantage": "What makes this ad stand out vs competitors",
    "predicted_metrics": {
      "ctr": number,
      "vtr": number,
      "conversion_rate": number,
      "completion_rate": number,
      "engagement_score": number,
      "roas": number,
      "grade": "A/B/C/D/F",
      "grade_rationale": "Why this grade based on benchmarks"
    }
  },
  "risk_assessment": {
    "risk_level": "low/medium/high",
    "potential_issues": ["Issue 1 with severity", "Issue 2"],
    "failure_risks": ["Risk that could cause poor performance"],
    "mitigation_suggestions": ["Specific action to reduce risk 1", "Action 2"]
  },
  "personalized_recommendations": {
    "decision_suggestion": "approve/suspend/reject",
    "action_items": ["Specific action 1", "Specific action 2", "Specific action 3"],
    "optimization_priorities": ["Priority 1", "Priority 2", "Priority 3"],
    "user_specific_insights": "1-2 paragraph explanation of how this ad aligns with user's goals, platforms, pain points, and decision factors. Be specific about metrics they care about.",
    "performance_based_rationale": "Why approve/reject based on predicted performance vs benchmarks",
    "expected_roi_impact": "Expected ROI range or description (e.g., '3.2x-3.8x ROAS, above 3.63x benchmark')",
    "competitive_benchmarking": "How this compares to live ad performance (e.g., 'CTR 15% above average, completion rate similar to top performers')"
  },
  "creative_analysis": {
    "storytelling_effectiveness": "Excellent/Good/Fair/Poor - brief explanation",
    "visual_impact": "Strong/Moderate/Weak - brief explanation",
    "emotional_resonance": "High/Medium/Low - brief explanation",
    "technical_quality": "Professional/Competent/Basic - brief explanation"
  },
  "competitive_intelligence": {
    "market_positioning": "How this ad positions against competitors in the market",
    "benchmark_comparison": "Performance prediction vs average live ads (e.g., 'Above average on engagement, at par on conversion')",
    "differentiation_opportunities": "What could make this ad more unique",
    "trend_alignment": "How well this aligns with current advertising trends"
  },
  "detailed_strengths": [
    {
      "element": "Specific creative element with timestamp",
      "impact": "+X% metric based on live ad patterns",
      "timestamp": number,
      "benchmark_comparison": "Comparison to successful ads"
    }
  ],
  "detailed_weaknesses": [
    {
      "element": "Specific weakness",
      "impact": "-X% estimated impact",
      "severity": "critical/high/medium/low",
      "examples_from_live_ads": "How top performers handle this"
    }
  ],
  "detailed_recommendations": [
    {
      "title": "Actionable recommendation",
      "priority": "critical/high/medium/low",
      "expected_lift": "+X% specific metric",
      "rationale": "Why this works based on benchmarks",
      "implementation": "How to implement"
    }
  ],
  "executive_summary": "2-3 paragraph detailed summary covering: (1) creative strengths/weaknesses vs live ads, (2) predicted performance with specific metrics and grade, (3) clear recommendation with key actions and reasoning"
}

Generate thoughtful, specific, data-driven analysis. Use the live ad benchmarks extensively to justify every prediction and recommendation.`

    console.log('📝 Sending comprehensive synthesis prompt to Groq')
    console.log(`📊 Prompt length: ${synthesisPrompt.length} chars`)
    console.log(`📈 Analyzing against ${liveAds.length} live ads`)

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Better model for complex analysis
      messages: [
        {
          role: "system",
          content: "You are an expert advertising analyst and data scientist specializing in video ad creative performance prediction. You provide detailed, quantitative analysis comparing new ads against successful benchmarks. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: synthesisPrompt
        }
      ],
      temperature: 0.3, // Slightly higher for more nuanced analysis
      max_tokens: 8000 // More tokens for detailed analysis
    })

    console.log('✅ Groq API response received')

    const messageContent = completion.choices[0]?.message?.content
    if (!messageContent) {
      throw new Error('No content received from AI')
    }

    console.log('📄 Response length:', messageContent.length, 'chars')
    console.log('🔍 Parsing JSON response...')

    // Clean potential markdown code blocks
    let cleanedContent = messageContent.trim()
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }

    const report = JSON.parse(cleanedContent)
    console.log('✅ Successfully parsed comprehensive analysis report')
    console.log(`📊 Generated ${report.strengths?.length || 0} strengths, ${report.weaknesses?.length || 0} weaknesses, ${report.recommendations?.length || 0} recommendations`)

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

