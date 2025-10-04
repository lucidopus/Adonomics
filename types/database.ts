export type UserRole = 'creative_director' | 'brand_manager' | 'media_planner' | 'agency_executive'

export type PrimaryMetric = 'emotional_impact' | 'brand_lift' | 'audience_targeting'

export interface UserPreferences {
  id: string
  user_id: string
  role: UserRole
  primary_metric: PrimaryMetric
  focus_segments: string[]
  onboarding_completed: boolean
  created_at?: string
  updated_at?: string
}

export const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'creative_director',
    label: 'Creative Director',
    description: 'Focus on emotional impact and creative storytelling'
  },
  {
    value: 'brand_manager',
    label: 'Brand Manager',
    description: 'Track brand lift and awareness metrics'
  },
  {
    value: 'media_planner',
    label: 'Media Planner',
    description: 'Optimize audience targeting and reach'
  },
  {
    value: 'agency_executive',
    label: 'Agency Executive',
    description: 'Comprehensive view across all metrics'
  }
]

export const METRIC_OPTIONS: { value: PrimaryMetric; label: string; description: string }[] = [
  {
    value: 'emotional_impact',
    label: 'Emotional Impact',
    description: 'How creative elements drive emotional responses'
  },
  {
    value: 'brand_lift',
    label: 'Brand Lift',
    description: 'Impact on brand awareness and perception'
  },
  {
    value: 'audience_targeting',
    label: 'Audience Targeting',
    description: 'Performance across demographic segments'
  }
]

export const DEMOGRAPHIC_SEGMENTS = [
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+'
] as const