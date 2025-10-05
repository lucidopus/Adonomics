export type UserRole =
  | 'marketing_brand_manager'
  | 'creative_director_designer'
  | 'media_buyer_performance'
  | 'data_analyst_insights'
  | 'agency_account_manager'
  | 'c_suite_executive'
  | 'video_editor_producer'
  | 'product_manager'

export type PrimaryGoal =
  | 'maximize_roi_conversions'
  | 'improve_brand_awareness'
  | 'reduce_creative_testing'
  | 'faster_approval_cycles'
  | 'understand_emotional_impact'
  | 'identify_winning_patterns'
  | 'ensure_brand_compliance'
  | 'beat_competitor_performance'
  | 'optimize_platform_specific'
  | 'improve_team_alignment'

export type DecisionFactor =
  | 'performance_predictions'
  | 'emotional_resonance'
  | 'brand_safety_compliance'
  | 'scene_breakdown'
  | 'competitor_benchmarking'
  | 'cost_efficiency'
  | 'audience_segment_performance'
  | 'creative_element_impact'
  | 'drop_off_points'
  | 'platform_optimization'

export type TechnicalComfort =
  | 'high_level_summary'
  | 'visual_dashboards'
  | 'detailed_tables'
  | 'mixed_visuals_data'
  | 'ai_narrative_insights'
  | 'raw_data_exports'

export type CampaignType =
  | 'brand_awareness'
  | 'direct_response_performance'
  | 'product_launches'
  | 'app_install'
  | 'ecommerce_sales'
  | 'b2b_lead_generation'
  | 'event_promotion'
  | 'brand_repositioning'

export type Platform =
  | 'meta_facebook_instagram'
  | 'tiktok'
  | 'youtube'
  | 'linkedin'
  | 'connected_tv'
  | 'programmatic_display'
  | 'snapchat'
  | 'twitter_x'

export type InsightTiming =
  | 'pre_production'
  | 'pre_flight'
  | 'in_flight'
  | 'post_campaign'

export type ResultSpeed =
  | 'real_time'
  | 'same_day'
  | 'within_24_48_hours'
  | 'week_long_dive'

export type TeamMember =
  | 'just_me'
  | 'creative_team'
  | 'media_buying_team'
  | 'executive_leadership'
  | 'clients_agency'
  | 'external_partners'

export type SharingFormat =
  | 'dashboard_screenshots'
  | 'pdf_reports'
  | 'live_dashboard_link'
  | 'powerpoint_slides'
  | 'csv_excel_data'
  | 'api_integration'

export type PainPoint =
  | 'too_much_data_insights'
  | 'results_too_late'
  | 'cant_explain_why'
  | 'team_buy_in_difficult'
  | 'expensive_testing'
  | 'hard_compare_platforms'
  | 'lack_qualitative_feedback'
  | 'compliance_manual_slow'
  | 'cant_predict_performance'
  | 'other'

export interface UserPreferences {
  id: string
  user_id: string
  role: UserRole
  primary_goals: PrimaryGoal[]
  decision_factors: DecisionFactor[]
  technical_comfort: TechnicalComfort
  campaign_types: CampaignType[]
  platforms: Platform[]
  insight_timing: InsightTiming[]
  result_speed: ResultSpeed
  team_members: TeamMember[]
  sharing_formats: SharingFormat[]
  pain_points: PainPoint[]
  onboarding_completed: boolean
  created_at?: string
  updated_at?: string
}

export const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'marketing_brand_manager',
    label: 'Marketing/Brand Manager',
    description: 'Focus on ROI, brand awareness, and campaign performance'
  },
  {
    value: 'creative_director_designer',
    label: 'Creative Director/Designer',
    description: 'Emphasize emotional impact and creative storytelling'
  },
  {
    value: 'media_buyer_performance',
    label: 'Media Buyer/Performance Marketer',
    description: 'Optimize for conversions, CTR, and cost efficiency'
  },
  {
    value: 'data_analyst_insights',
    label: 'Data Analyst/Insights Manager',
    description: 'Deep dive into metrics and statistical analysis'
  },
  {
    value: 'agency_account_manager',
    label: 'Agency Account Manager',
    description: 'Client-facing insights and comprehensive reporting'
  },
  {
    value: 'c_suite_executive',
    label: 'C-Suite Executive (CMO, CEO)',
    description: 'Strategic overview and business impact focus'
  },
  {
    value: 'video_editor_producer',
    label: 'Video Editor/Producer',
    description: 'Technical video analysis and scene-level insights'
  },
  {
    value: 'product_manager',
    label: 'Product Manager',
    description: 'Feature optimization and user experience insights'
  }
]

export const PRIMARY_GOAL_OPTIONS: { value: PrimaryGoal; label: string; description: string }[] = [
  {
    value: 'maximize_roi_conversions',
    label: 'Maximize ROI and conversion rates',
    description: 'Focus on driving sales and measurable business outcomes'
  },
  {
    value: 'improve_brand_awareness',
    label: 'Improve brand awareness and recall',
    description: 'Build brand recognition and top-of-mind awareness'
  },
  {
    value: 'reduce_creative_testing',
    label: 'Reduce creative testing costs',
    description: 'Minimize expensive A/B testing and iteration cycles'
  },
  {
    value: 'faster_approval_cycles',
    label: 'Get faster creative approval cycles',
    description: 'Speed up the creative review and approval process'
  },
  {
    value: 'understand_emotional_impact',
    label: 'Understand emotional impact of ads',
    description: 'Measure how ads make people feel and connect'
  },
  {
    value: 'identify_winning_patterns',
    label: 'Identify winning creative patterns',
    description: 'Discover what creative elements consistently perform'
  },
  {
    value: 'ensure_brand_compliance',
    label: 'Ensure brand compliance and safety',
    description: 'Maintain brand guidelines and avoid risky content'
  },
  {
    value: 'beat_competitor_performance',
    label: 'Beat competitor creative performance',
    description: 'Outperform competitors in creative effectiveness'
  },
  {
    value: 'optimize_platform_specific',
    label: 'Optimize for specific platforms',
    description: 'Tailor creative for Meta, TikTok, YouTube, etc.'
  },
  {
    value: 'improve_team_alignment',
    label: 'Improve team alignment on creative decisions',
    description: 'Get everyone on the same page about what works'
  }
]

export const DECISION_FACTOR_OPTIONS: { value: DecisionFactor; label: string; description: string }[] = [
  {
    value: 'performance_predictions',
    label: 'Performance predictions (CTR, VTR, conversions)',
    description: 'Predicted engagement and conversion metrics'
  },
  {
    value: 'emotional_resonance',
    label: 'Emotional resonance and sentiment',
    description: 'How viewers emotionally connect with the content'
  },
  {
    value: 'brand_safety_compliance',
    label: 'Brand safety and compliance',
    description: 'Content safety and brand guideline adherence'
  },
  {
    value: 'scene_breakdown',
    label: 'Scene-by-scene breakdown',
    description: 'Detailed analysis of each part of the video'
  },
  {
    value: 'competitor_benchmarking',
    label: 'Competitor benchmarking',
    description: 'How your creative compares to competitors'
  },
  {
    value: 'cost_efficiency',
    label: 'Cost efficiency (predicted ROAS)',
    description: 'Return on ad spend and budget optimization'
  },
  {
    value: 'audience_segment_performance',
    label: 'Audience segment performance',
    description: 'How different demographics respond'
  },
  {
    value: 'creative_element_impact',
    label: 'Creative element impact (what\'s working)',
    description: 'Which specific elements drive performance'
  },
  {
    value: 'drop_off_points',
    label: 'Drop-off points and retention',
    description: 'Where viewers lose interest in the video'
  },
  {
    value: 'platform_optimization',
    label: 'Platform-specific optimization',
    description: 'Tailored recommendations for each platform'
  }
]

export const TECHNICAL_COMFORT_OPTIONS: { value: TechnicalComfort; label: string; description: string }[] = [
  {
    value: 'high_level_summary',
    label: 'High-level summary with key takeaways only',
    description: 'Executive summaries and main insights'
  },
  {
    value: 'visual_dashboards',
    label: 'Visual dashboards with charts and graphs',
    description: 'Interactive charts and visual representations'
  },
  {
    value: 'detailed_tables',
    label: 'Detailed tables with all metrics',
    description: 'Comprehensive data tables and spreadsheets'
  },
  {
    value: 'mixed_visuals_data',
    label: 'Mix of visuals and detailed data',
    description: 'Best of both worlds - charts and detailed metrics'
  },
  {
    value: 'ai_narrative_insights',
    label: 'AI-generated narrative insights',
    description: 'Written explanations and storytelling insights'
  },
  {
    value: 'raw_data_exports',
    label: 'Raw data exports for my own analysis',
    description: 'CSV files and raw data for custom analysis'
  }
]

export const CAMPAIGN_TYPE_OPTIONS: { value: CampaignType; label: string }[] = [
  { value: 'brand_awareness', label: 'Brand awareness campaigns' },
  { value: 'direct_response_performance', label: 'Direct response / Performance' },
  { value: 'product_launches', label: 'Product launches' },
  { value: 'app_install', label: 'App install campaigns' },
  { value: 'ecommerce_sales', label: 'E-commerce / Sales' },
  { value: 'b2b_lead_generation', label: 'B2B lead generation' },
  { value: 'event_promotion', label: 'Event promotion' },
  { value: 'brand_repositioning', label: 'Brand repositioning' }
]

export const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
  { value: 'meta_facebook_instagram', label: 'Meta (Facebook/Instagram)' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'connected_tv', label: 'Connected TV (CTV)' },
  { value: 'programmatic_display', label: 'Programmatic Display' },
  { value: 'snapchat', label: 'Snapchat' },
  { value: 'twitter_x', label: 'Twitter/X' }
]

export const INSIGHT_TIMING_OPTIONS: { value: InsightTiming; label: string }[] = [
  { value: 'pre_production', label: 'Pre-production (before shooting)' },
  { value: 'pre_flight', label: 'Pre-flight (before launching campaign)' },
  { value: 'in_flight', label: 'In-flight (during active campaigns)' },
  { value: 'post_campaign', label: 'Post-campaign (retrospective analysis)' }
]

export const RESULT_SPEED_OPTIONS: { value: ResultSpeed; label: string }[] = [
  { value: 'real_time', label: 'Real-time (within minutes)' },
  { value: 'same_day', label: 'Same day' },
  { value: 'within_24_48_hours', label: 'Within 24-48 hours' },
  { value: 'week_long_dive', label: 'Week-long deep dive' }
]

export const TEAM_MEMBER_OPTIONS: { value: TeamMember; label: string }[] = [
  { value: 'just_me', label: 'Just me' },
  { value: 'creative_team', label: 'Creative team' },
  { value: 'media_buying_team', label: 'Media buying team' },
  { value: 'executive_leadership', label: 'Executive leadership' },
  { value: 'clients_agency', label: 'Clients (agency context)' },
  { value: 'external_partners', label: 'External partners/vendors' }
]

export const SHARING_FORMAT_OPTIONS: { value: SharingFormat; label: string }[] = [
  { value: 'dashboard_screenshots', label: 'Dashboard screenshots' },
  { value: 'pdf_reports', label: 'PDF reports' },
  { value: 'live_dashboard_link', label: 'Live dashboard link' },
  { value: 'powerpoint_slides', label: 'PowerPoint slides' },
  { value: 'csv_excel_data', label: 'CSV/Excel data' },
  { value: 'api_integration', label: 'API integration with our tools' }
]

export const PAIN_POINT_OPTIONS: { value: PainPoint; label: string }[] = [
  { value: 'too_much_data_insights', label: 'Too much data, not enough actionable insights' },
  { value: 'results_too_late', label: 'Results come too late to be useful' },
  { value: 'cant_explain_why', label: 'Can\'t explain WHY a creative worked/failed' },
  { value: 'team_buy_in_difficult', label: 'Difficult to get team buy-in on changes' },
  { value: 'expensive_testing', label: 'Expensive to test multiple variants' },
  { value: 'hard_compare_platforms', label: 'Hard to compare across platforms' },
  { value: 'lack_qualitative_feedback', label: 'Lack of emotional/qualitative feedback' },
  { value: 'compliance_manual_slow', label: 'Compliance checking is manual and slow' },
  { value: 'cant_predict_performance', label: 'Can\'t predict performance before launch' }
]

export const DEMOGRAPHIC_SEGMENTS = [
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+'
] as const