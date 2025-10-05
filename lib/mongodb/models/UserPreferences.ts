import { ObjectId } from 'mongodb'
import { UserRole, PrimaryGoal, DecisionFactor, TechnicalComfort, CampaignType, Platform, InsightTiming, ResultSpeed, TeamMember, SharingFormat, PainPoint } from '@/types/database'

export interface UserPreferences {
  _id?: ObjectId
  user_id: ObjectId
  // Onboarding progress tracking
  current_step: number
  onboarding_completed: boolean

  // Step 1: User Profile
  role?: UserRole

  // Step 2: Primary Goals
  primary_goals?: PrimaryGoal[]

  // Step 3: Key Decision Factors
  decision_factors?: DecisionFactor[]

  // Step 4: Technical Comfort Level
  technical_comfort?: TechnicalComfort

  // Step 5: Campaign Context
  campaign_types?: CampaignType[]
  platforms?: Platform[]

  // Step 6: Time Constraints
  insight_timing?: InsightTiming[]
  result_speed?: ResultSpeed

  // Step 7: Team Collaboration
  team_members?: TeamMember[]
  sharing_formats?: SharingFormat[]

  // Step 8: Pain Points
  pain_points?: PainPoint[]

  created_at: Date
  updated_at: Date
}

export class UserPreferencesModel {
  static collectionName = 'preferences'

  static createEmptyPreferences(userId: ObjectId): Omit<UserPreferences, '_id'> {
    return {
      user_id: userId,
      current_step: 1,
      onboarding_completed: false,
      created_at: new Date(),
      updated_at: new Date(),
    }
  }

  static updatePreferences(
    existing: UserPreferences,
    updates: Partial<Omit<UserPreferences, '_id' | 'user_id' | 'created_at'>>
  ): UserPreferences {
    return {
      ...existing,
      ...updates,
      updated_at: new Date(),
    }
  }

  static toPreferencesDocument(preferences: Partial<UserPreferences>): UserPreferences {
    return {
      _id: preferences._id || new ObjectId(),
      user_id: preferences.user_id || new ObjectId(),
      current_step: preferences.current_step || 1,
      onboarding_completed: preferences.onboarding_completed || false,
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
      pain_points: preferences.pain_points,
      created_at: preferences.created_at || new Date(),
      updated_at: preferences.updated_at || new Date(),
    }
  }
}