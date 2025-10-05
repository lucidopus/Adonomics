import { NextRequest, NextResponse } from 'next/server'
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

interface UserPreferences {
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
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Fetch user preferences from database
    const client = await clientPromise
    const db = client.db()

    const preferences = await db.collection(UserPreferencesModel.collectionName).findOne({
      user_id: new ObjectId(userId)
    })

    if (!preferences) {
      // Return empty preferences summary for new users
      return NextResponse.json({
        summary: 'New user with no profile information available yet.'
      })
    }

    // Convert database document to UserPreferences interface
    const userPreferences: UserPreferences = {
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
    const summary = summaryParts.length > 0
      ? summaryParts.join(' ')
      : 'No profile information available.'

    return NextResponse.json({ summary })

  } catch (error) {
    console.error('Error generating user profile summary:', error)
    return NextResponse.json(
      { error: 'Failed to generate profile summary', summary: 'Unable to generate profile summary at this time.' },
      { status: 500 }
    )
  }
}