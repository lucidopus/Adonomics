# Live Tracker Schema Documentation

This document defines the complete data schema for tracking live ad performance. The schema balances **realism, actionability, and feasibility** for both real data and simulation.

---

## Schema Design Principles

1. **Realistic Correlations** - Metrics must correlate logically (e.g., high thumb-stop → higher CTR)
2. **Platform-Specific** - Different platforms have different performance patterns
3. **Time-Series Aware** - Performance changes over time (ad fatigue is real)
4. **Actionable** - Every metric should inform a decision
5. **Comparative** - Learn from similar ads' success/failure

---

## Complete Schema Structure

### MongoDB Document Model

```typescript
{
  _id: ObjectId,
  video_id: string, // Unique indexed identifier

  metadata: { ... },                    // Section 1: Basic video info
  engagement_metrics: { ... },           // Section 2: Viewing & interaction
  business_metrics: { ... },             // Section 3: Conversions & ROI
  creative_analysis: { ... },            // Section 4: AI-powered insights
  performance_drivers: { ... },          // Section 5: What's working/not working
  risks_and_compliance: { ... },         // Section 6: Alerts & safety
  recommendations: [ ... ],              // Section 7: AI suggestions
  comparative_analysis: { ... },         // Section 8: vs similar ads
  performance_history: [ ... ],          // Section 9: Time-series data
  user_decision: { ... },                // Section 10: Approval workflow

  created_at: ISO date,
  updated_at: ISO date,
  last_analysis_run: ISO date
}
```

---

## Section 1: Video Metadata

**Purpose:** Core identifiers and campaign context. Ads don't exist in isolation - they're part of campaigns with budgets and objectives.

```typescript
metadata: {
  // Core Identifiers
  video_id: string,              // Unique ID, indexed for fast lookup
  video_title: string,           // Human-readable title
  video_url: string,             // Storage location (Supabase Storage)
  thumbnail_url: string,         // Preview image URL
  duration_seconds: number,      // Total video length
  aspect_ratio: "9:16" | "1:1" | "16:9" | "4:5", // Format determines platform suitability
  file_size_mb: number,          // For storage tracking
  upload_timestamp: string,      // ISO date - when uploaded
  last_updated: string,          // ISO date - last modification

  // Campaign Context - Critical for understanding performance goals
  campaign_id: string,           // Parent campaign ID
  campaign_name: string,         // E.g., "Q1 Product Launch"
  campaign_objective: string,    // "brand_awareness" | "conversions" | "engagement" | "app_installs" | "lead_generation"
                                 // Why: Different objectives need different success metrics

  target_platform: string,       // "meta" | "tiktok" | "youtube" | "linkedin" | "snapchat" | "twitter"
                                 // Why: Platform affects benchmarks and best practices

  target_audience: string,       // E.g., "Women 25-34, Tech Enthusiasts"
                                 // Why: Helps personalize insights based on who should see it

  budget_allocated: number,      // Total budget for this ad (USD)
  spend_to_date: number,         // How much spent so far (USD)
                                 // Why: Essential for calculating ROAS and cost efficiency

  // Status Tracking
  status: string,                // "active" | "paused" | "completed" | "draft"
                                 // Why: Only active ads should be in live tracker

  analysis_status: string,       // "pending" | "processing" | "complete" | "failed"
                                 // Why: Shows if AI analysis is ready

  performance_grade: string      // "A" | "B" | "C" | "D" | "F"
                                 // Why: Quick visual assessment at a glance
}
```

---

## Section 2: Engagement Metrics

**Purpose:** Real performance data showing how viewers interact with the ad. These are actual numbers from platform analytics.

```typescript
engagement_metrics: {
  // Viewing Metrics - How many people saw and watched
  impressions: number,                    // Total times ad was shown
                                          // Why: Volume metric, denominator for rates

  views: number,                          // Counted views (definition varies by platform)
                                          // Why: Higher quality metric than impressions

  thumb_stop_rate_pct: number,            // % who stopped scrolling (0-100)
                                          // Why: Measures hook strength, critical first 0-3 seconds

  avg_watch_time_seconds: number,         // Average time viewers watched
                                          // Why: Shows content quality and engagement

  completion_rate_pct: number,            // % who watched to the end (0-100)
                                          // Why: High completion = compelling content

  // Retention Curve - Viewer retention at key milestones
  vtr_3sec_pct: number,                   // % still watching at 3 seconds (0-100)
                                          // Why: Hook effectiveness - most crucial moment

  vtr_25pct: number,                      // % who reached 25% of video (0-100)
  vtr_50pct: number,                      // % who reached 50% of video (0-100)
  vtr_75pct: number,                      // % who reached 75% of video (0-100)
  vtr_100pct: number,                     // % who watched to completion (0-100)
                                          // Why: Identifies where viewers drop off

  // Interaction Metrics - What viewers did beyond watching
  ctr_pct: number,                        // Click-through rate (0-100)
                                          // Why: Primary action metric for performance ads

  clicks: number,                         // Total clicks on ad
  likes: number,                          // Social engagement signals
  shares: number,                         // Viral potential indicator
  comments: number,                       // Conversation driver
  saves_bookmarks: number,                // Intent signal - people want to revisit
                                          // Why: Social signals boost algorithmic reach

  engagement_rate_pct: number,            // (likes + shares + comments + saves) / impressions * 100
                                          // Why: Overall engagement health metric

  // Drop-off Analysis - Where and why people leave
  critical_dropoff_timestamp_sec: number, // Specific moment of highest drop-off
                                          // Why: Pinpoints problem areas to fix

  dropoff_3sec_pct: number,               // % who left at 3 seconds
  dropoff_6sec_pct: number,               // % who left at 6 seconds
  dropoff_15sec_pct: number,              // % who left at 15 seconds
                                          // Why: Early drop-offs indicate weak hook or pacing issues

  retention_curve: number[]               // Array: retention % at each second [100, 95, 90, 85...]
                                          // Why: Enables detailed retention charts showing exact drop-off points
}
```

---

## Section 3: Business Impact Metrics

**Purpose:** Revenue and ROI metrics. Performance ads must drive business results, not just engagement.

```typescript
business_metrics: {
  // Conversion Metrics - Real business outcomes
  conversions: number,                    // Total conversions (purchases, sign-ups, etc.)
                                          // Why: The ultimate success metric for performance ads

  conversion_rate_pct: number,            // % of clicks that converted (0-100)
                                          // Why: Measures ad quality + landing page effectiveness

  cost_per_conversion: number,            // Spend / conversions (USD)
                                          // Why: Efficiency metric - lower is better

  attributed_revenue: number,             // Total revenue driven by this ad (USD)
                                          // Why: Top-line business impact

  roas: number,                           // Return on ad spend (e.g., 3.5 = $3.50 per $1 spent)
                                          // Why: Key profitability metric

  // Brand Metrics - Survey-based or modeled (not always available)
  brand_lift_pct: number,                 // Change in brand perception (-100 to +100)
                                          // Why: Measures brand-building impact (can be negative!)

  ad_recall_pct: number,                  // % who remember seeing the ad (0-100)
                                          // Why: Memorability and cut-through

  purchase_intent_lift_pct: number,       // Change in intent to buy (-100 to +100)
                                          // Why: Leading indicator of future conversions

  brand_awareness_lift_pct: number,       // Change in brand awareness (-100 to +100)
                                          // Why: Top-of-funnel brand building

  favorability_score: number,             // How positively people view the brand (0-100)
                                          // Why: Long-term brand health

  // Efficiency Metrics - Cost optimization
  cpm: number,                            // Cost per thousand impressions (USD)
                                          // Why: Reach efficiency

  cpv: number,                            // Cost per view (USD)
                                          // Why: Engagement cost

  cpc: number                             // Cost per click (USD)
                                          // Why: Action cost - critical for direct response
}
```

---

## Section 4: Creative Intelligence

**Purpose:** AI-powered analysis from Twelve Labs API. Understands what's IN the video and how it impacts performance.

### 4a. Emotional Analysis

```typescript
creative_analysis: {
  emotional_analysis: {
    // Overall Emotional Profile
    emotional_resonance_score: number,    // Overall emotional impact (0-100)
                                          // Why: Emotion drives sharing and memory

    emotional_arc: string,                // "rising" | "falling" | "stable" | "peak_middle" | "U_shaped"
                                          // Why: Story structure affects engagement

    dominant_emotion: string,             // "joy" | "excitement" | "trust" | "surprise" | "neutral" | "inspiration" | "sadness" | "fear"
                                          // Why: Different emotions work for different objectives

    emotional_consistency_score: number,  // How consistent emotion is throughout (0-100)
                                          // Why: Emotional whiplash confuses viewers

    peak_emotional_moment_sec: number,    // When emotion peaks (timestamp)
                                          // Why: Aligning peak with CTA improves conversions

    // Scene-by-Scene Emotion - Granular emotional journey
    scene_emotions: [
      {
        scene_id: string,                 // Unique scene identifier
        start_sec: number,                // Scene start time
        end_sec: number,                  // Scene end time

        valence: number,                  // Emotional positivity (-1 to +1)
                                          // Why: Negative emotions work for problem-awareness, positive for solutions

        arousal: number,                  // Emotional intensity (0 to 1)
                                          // Why: High arousal = attention-grabbing

        dominant_emotion: string,         // Primary emotion in this scene
        emotion_confidence: number        // AI confidence in detection (0-100)
                                          // Why: Low confidence = needs human review
      }
    ]
  },
```

### 4b. Visual Elements Detected

```typescript
  visual_elements: {
    // Brand Presence - How visible is the brand?
    logo_visibility_pct: number,          // % of frames with visible logo (0-100)
                                          // Why: Brand recall requires logo presence

    logo_first_appearance_sec: number,    // When logo first appears
                                          // Why: Early = brand-focused, late = story-first

    product_shown_pct: number,            // % of video showing the product (0-100)
                                          // Why: Product visibility drives consideration

    product_closeup_timestamps: number[], // When product shown in detail
                                          // Why: Closeups at right moments boost intent

    brand_colors_detected: string[],      // Array of hex codes
                                          // Why: Consistent brand colors improve recognition

    brand_color_dominance_pct: number,    // % of frames using brand colors (0-100)
                                          // Why: Too much = boring, too little = off-brand

    // Visual Composition - How is it shot and styled?
    color_temperature: string,            // "warm" | "cool" | "neutral"
                                          // Why: Warm = friendly/approachable, cool = premium/tech

    color_contrast_score: number,         // Visual contrast level (0-100)
                                          // Why: Low contrast = hard to read, high = eye-catching

    visual_complexity_score: number,      // How busy/cluttered the frames are (0-100)
                                          // Why: High complexity reduces comprehension

    lighting_quality: string,             // "bright" | "dim" | "natural" | "dramatic"
                                          // Why: Lighting affects mood and professionalism

    // Human Elements - People drive connection
    faces_detected_count: number,         // Total unique faces detected
                                          // Why: Faces grab attention and build trust

    avg_faces_per_frame: number,          // Average faces visible per frame
                                          // Why: Too many = confusing, one = personal

    face_screen_time_pct: number,         // % of video with faces visible (0-100)
                                          // Why: Face time correlates with engagement

    facial_expressions: {
      smiling_pct: number,                // % of face time smiling (0-100)
      neutral_pct: number,                // % of face time neutral (0-100)
      surprised_pct: number,              // % of face time surprised (0-100)
      other_pct: number                   // % of other expressions (0-100)
    },                                    // Why: Smiling = approachable, surprise = attention

    gaze_direction_camera_pct: number,    // % of face time looking at camera (0-100)
                                          // Why: Direct gaze = connection and trust

    // Text & CTA - Written messaging
    text_present: boolean,                // Any text overlays?
                                          // Why: Text increases comprehension 30%+

    captions_present: boolean,            // Subtitles/captions present?
                                          // Why: Captions boost VTR by 15-25% (many watch muted)

    text_readability_score: number,       // How easy to read the text (0-100)
                                          // Why: Unreadable text wastes the opportunity

    text_density_wpm: number,             // Words per minute on screen
                                          // Why: Too fast = can't read, too slow = boring

    cta_present: boolean,                 // Call-to-action included?
                                          // Why: Explicit CTAs improve conversion 20-40%

    cta_timestamp_sec: number,            // When CTA appears
                                          // Why: Timing matters - too early = no context, too late = missed

    cta_visibility_score: number,         // How visible/prominent the CTA is (0-100)
                                          // Why: Subtle CTAs get ignored

    cta_text: string                      // Actual CTA copy
                                          // Why: Copy analysis reveals messaging effectiveness
  },
```

### 4c. Audio Elements

```typescript
  audio_elements: {
    music_present: boolean,               // Background music included?
                                          // Why: Music affects emotion and pacing

    music_tempo_bpm: number,              // Beats per minute
                                          // Why: Fast = energetic, slow = calm/emotional

    music_energy: string,                 // "low" | "medium" | "high"
                                          // Why: Energy should match message intensity

    voiceover_present: boolean,           // Narration included?
                                          // Why: VO clarifies message but can feel corporate

    speech_rate_wpm: number,              // Words per minute spoken
                                          // Why: Too fast = incomprehensible, too slow = boring

    audio_clarity_score: number,          // Audio quality (0-100)
                                          // Why: Poor audio kills credibility instantly

    silence_gaps: number[],               // Timestamps of silence > 2 seconds
                                          // Why: Awkward pauses lose viewers

    sound_effects_count: number           // Number of distinct sound effects
                                          // Why: Strategic SFX boost attention at key moments
  },
```

### 4d. Scene-Level Breakdown

```typescript
  scenes: [
    {
      scene_id: string,                   // Unique identifier
      scene_number: number,               // Sequence position
      start_sec: number,                  // Scene start time
      end_sec: number,                    // Scene end time
      duration_sec: number,               // Scene length

      scene_type: string,                 // "hook" | "problem" | "solution" | "demo" | "testimonial" | "social_proof" | "cta" | "outro"
                                          // Why: Narrative function determines what content should be here

      elements_present: string[],         // ["product", "person", "text", "logo", "music", etc.]
                                          // Why: Element combinations reveal creative patterns

      // Performance Impact - How this scene affects overall metrics
      predicted_ctr_impact_pct: number,   // Predicted impact on CTR (-50 to +50)
                                          // Why: Identifies high-value vs low-value scenes

      predicted_vtr_impact_pct: number,   // Predicted impact on VTR (-50 to +50)
                                          // Why: Shows which scenes retain or lose viewers

      scene_engagement_score: number,     // Overall scene quality (0-100)
                                          // Why: Quick assessment of scene effectiveness

      // Actual Retention - Real viewer behavior during this scene
      avg_retention_this_scene_pct: number, // Average retention during scene (0-100)
                                          // Why: Shows if predictions match reality

      dropoff_during_scene_pct: number    // % who left during this scene (0-100)
                                          // Why: Identifies problem scenes to fix or cut
    }
  ]
}
```

---

## Section 5: Performance Drivers & Insights

**Purpose:** Identify specific elements driving success or causing problems. Makes insights actionable.

### 5a. Positive Drivers (What's Working)

```typescript
performance_drivers: {
  positive: [
    {
      driver_id: string,                  // Unique identifier

      element_name: string,               // E.g., "Fast-paced product reveal 0-3s"
                                          // Why: Specific naming makes it reproducible

      element_type: string,               // "visual" | "audio" | "text" | "pacing" | "emotion"
                                          // Why: Categorization helps pattern recognition

      timestamp_range: {
        start: number,                    // When element starts
        end: number                       // When element ends
      },                                  // Why: Precise location enables editing/learning

      // Quantified Impact - How much this helps
      impact_ctr_pct: number,             // E.g., +8 (improves CTR by 8 percentage points)
      impact_vtr_pct: number,             // E.g., +12 (improves VTR by 12 percentage points)
      impact_conversions_pct: number,     // E.g., +15 (improves conversions by 15%)
                                          // Why: Quantified impact proves value

      confidence_score: number,           // AI confidence in this assessment (0-100)
                                          // Why: Low confidence = needs validation

      benchmark_comparison: string        // "above_average" | "best_in_class" | "industry_leading"
                                          // Why: Shows if this is good or exceptional
    }
  ],
```

### 5b. Negative Drivers (What's Hurting Performance)

```typescript
  negative: [
    {
      driver_id: string,                  // Unique identifier

      element_name: string,               // E.g., "No captions 3-12s"
                                          // Why: Specific naming enables fixing

      element_type: string,               // "visual" | "audio" | "text" | "pacing" | "emotion"

      timestamp_range: {
        start: number,
        end: number
      },

      // Quantified Impact - How much this hurts
      impact_ctr_pct: number,             // E.g., -5 (reduces CTR by 5 percentage points)
      impact_vtr_pct: number,             // E.g., -18 (reduces VTR by 18 percentage points)
      impact_conversions_pct: number,     // E.g., -22 (reduces conversions by 22%)
                                          // Why: Quantified damage prioritizes fixes

      severity: string,                   // "critical" | "high" | "medium" | "low"
                                          // Why: Prioritization for limited resources

      fixable: boolean,                   // Can this be fixed in post-production?
                                          // Why: Determines if ad can be saved

      fix_difficulty: string              // "easy" | "medium" | "hard" | "requires_reshoot"
                                          // Why: Informs decision to fix vs reshoot vs abandon
    }
  ]
}
```

---

## Section 6: Risk Alerts & Compliance

**Purpose:** Identify problems before they cause damage. Brand safety and compliance are non-negotiable.

```typescript
risks_and_compliance: {
  // Creative Risks - Performance and quality issues
  creative_risks: [
    {
      risk_id: string,                    // Unique identifier

      risk_type: string,                  // "pacing" | "visibility" | "readability" | "audio" | "compliance" | "platform_spec"
                                          // Why: Categorization for filtering/reporting

      severity: string,                   // "critical" | "high" | "medium" | "low"
                                          // Why: Critical = must fix, low = nice to fix

      description: string,                // Human-readable explanation
                                          // Why: Non-technical stakeholders need to understand

      timestamp_sec: number,              // Where the issue occurs
                                          // Why: Enables quick navigation to problem

      resolution_status: string,          // "open" | "acknowledged" | "resolved" | "ignored"
                                          // Why: Track risk management workflow

      resolution_notes: string            // Comments on how/why resolved/ignored
                                          // Why: Audit trail for decisions
    }
  ],

  // Brand Compliance - Safety and guideline adherence
  brand_compliance: {
    brand_safety_score: number,           // Overall safety rating (0-100)
                                          // Why: Single metric for exec dashboards

    logo_usage_compliant: boolean,        // Logo follows brand guidelines?
                                          // Why: Off-brand logos damage brand equity

    brand_color_compliant: boolean,       // Colors match brand palette?
                                          // Why: Inconsistent colors weaken recognition

    prohibited_content_detected: boolean, // Any banned content found?
                                          // Why: Hard stop for legal/brand safety

    prohibited_content_types: string[],   // If any, what types? ["violence", "profanity", etc.]
                                          // Why: Specific violations need specific responses

    platform_guidelines_met: {
      meta: boolean,                      // Meets Meta/Facebook/Instagram guidelines?
      tiktok: boolean,                    // Meets TikTok guidelines?
      youtube: boolean,                   // Meets YouTube guidelines?
      linkedin: boolean                   // Meets LinkedIn guidelines?
    },                                    // Why: Platform rejection wastes time and budget

    compliance_notes: string              // Additional context
                                          // Why: Nuance matters in gray areas
  }
}
```

---

## Section 7: Recommendations (AI-Generated)

**Purpose:** Actionable suggestions to improve performance. Bridges analysis to action.

```typescript
recommendations: [
  {
    recommendation_id: string,            // Unique identifier

    priority: string,                     // "critical" | "high" | "medium" | "low"
                                          // Why: Prioritizes limited resources

    category: string,                     // "creative" | "targeting" | "budget" | "platform" | "timing"
                                          // Why: Routes to appropriate team member

    title: string,                        // E.g., "Add captions to boost VTR by 15%"
                                          // Why: Concise, benefit-focused summary

    description: string,                  // Detailed explanation of recommendation
                                          // Why: Context for why this matters

    expected_impact: {
      metric: string,                     // "ctr" | "vtr" | "conversions" | "engagement" | "roas"
      current_value: number,              // Current metric value
      predicted_value: number,            // Predicted value after implementing
      lift_pct: number                    // % improvement (e.g., +15)
    },                                    // Why: ROI estimation for prioritization

    implementation: {
      difficulty: string,                 // "easy" | "medium" | "hard"
      estimated_time_hours: number,       // How long to implement
      estimated_cost: number,             // Cost in USD (if applicable)
      requires: string[]                  // ["video editor", "motion graphics", etc.]
    },                                    // Why: Resource planning and feasibility

    timestamp_to_modify: number | null,   // Specific location to edit (if applicable)
                                          // Why: Precise guidance speeds implementation

    status: string,                       // "pending" | "in_progress" | "implemented" | "rejected"
                                          // Why: Track recommendation lifecycle

    status_notes: string                  // Why implemented/rejected, results, etc.
                                          // Why: Learning for future recommendations
  }
]
```

---

## Section 8: Comparative Intelligence

**Purpose:** Learn from similar ads' success and failure. Context is everything in performance prediction.

```typescript
comparative_analysis: {
  similar_ads_analyzed: number,           // How many similar ads were compared
                                          // Why: More comparisons = more reliable insights

  performance_percentile: number,         // Where this ad ranks among similar (0-100)
                                          // Why: Quick "is this good?" assessment

  // vs Category Average - How this compares to typical performance
  vs_category_average: {
    ctr_vs_avg_pct: number,               // E.g., +15 means 15% above average
    vtr_vs_avg_pct: number,               // Performance vs average VTR
    roas_vs_avg: number,                  // E.g., 1.2x means 20% better ROAS
    engagement_vs_avg_pct: number         // Engagement rate vs average
  },                                      // Why: Understand if performance is normal or exceptional

  // vs Top Performer - Gap analysis to best-in-class
  vs_top_performer: {
    gap_to_top_ctr_pct: number,           // How far behind the leader in CTR
    gap_to_top_vtr_pct: number,           // How far behind the leader in VTR
    gap_to_top_roas: number,              // ROAS gap to leader

    key_differences: string[]             // ["Leader uses captions", "Leader has CTA at 5s", etc.]
                                          // Why: Learn what top performers do differently
  },

  // Similar Successful Ads - Learn from winners
  similar_successful_ads: [
    {
      ad_id: string,                      // Reference to other ad
      ad_title: string,                   // Title for context
      similarity_score: number,           // How similar to current ad (0-100)
                                          // Why: More similar = more relevant lessons

      performance_score: number,          // How well this ad performed (0-100)

      key_success_factors: string[]       // ["Strong hook 0-3s", "Clear value prop", etc.]
                                          // Why: Identify reproducible patterns
    }
  ],

  // Similar Failed Ads - Learn from mistakes
  similar_failed_ads: [
    {
      ad_id: string,                      // Reference to failed ad
      ad_title: string,                   // Title for context
      similarity_score: number,           // How similar to current ad (0-100)
                                          // Why: High similarity to failures = warning sign

      key_failure_factors: string[]       // ["No clear CTA", "Confusing message", etc.]
                                          // Why: Avoid repeating mistakes
    }
  ]
}
```

---

## Section 9: Time-Series Performance

**Purpose:** Track how performance changes over time. Ad fatigue and optimization are dynamic processes.

```typescript
performance_history: [
  {
    timestamp: string,                    // ISO date - when this snapshot was taken
                                          // Why: Track performance evolution

    // Volume Metrics at this timestamp
    impressions: number,                  // Impressions at this point
    views: number,                        // Views at this point
    clicks: number,                       // Clicks at this point
    conversions: number,                  // Conversions at this point
    spend: number,                        // Spend at this point (USD)

    // Cumulative Metrics - Running totals
    cumulative_impressions: number,       // Total impressions to date
    cumulative_conversions: number,       // Total conversions to date
    cumulative_spend: number,             // Total spend to date
    cumulative_roas: number,              // ROAS to date
                                          // Why: Track overall campaign health

    // Rate Metrics at this timestamp - Show performance quality
    ctr_pct: number,                      // CTR at this snapshot (0-100)
    vtr_pct: number,                      // VTR at this snapshot (0-100)
    engagement_rate_pct: number,          // Engagement rate at this snapshot (0-100)
                                          // Why: Rates show if performance improving/declining

    // Performance Indicators
    performance_trend: string,            // "improving" | "stable" | "declining"
                                          // Why: Quick health check

    alert_triggered: boolean,             // Was an alert triggered at this point?
    alert_reason: string                  // If alert, why? "Ad fatigue detected", "Budget depleted", etc.
                                          // Why: Automated monitoring catches issues early
  }
]
```

---

## Section 10: User Decision Tracking

**Purpose:** Track approval workflow. Creates learning loop between AI predictions and human decisions.

```typescript
user_decision: {
  decision: string,                       // "approved" | "suspended" | "rejected" | "pending"
                                          // Why: Core workflow state

  decided_by: string,                     // User ID who made the decision
                                          // Why: Accountability and preferences learning

  decided_at: string,                     // ISO date when decision made
                                          // Why: Track decision speed and workflow

  decision_notes: string,                 // User's explanation for the decision
                                          // Why: Qualitative feedback improves AI over time

  decision_confidence: number             // How confident was the user? (0-100)
                                          // Why: Low confidence + good results = user calibration opportunity
}
```

---

## Realistic Data Correlations for Simulation

When generating simulated data, these correlations must hold:

### Strong Positive Correlations
```
High thumb_stop_rate → Higher CTR
  - If 70% stop scrolling, expect CTR 2-4%
  - If 30% stop scrolling, expect CTR 0.5-1.5%

Strong hook (0-3s) → Higher VTR@25
  - vtr_3sec > 60% → vtr_25pct likely > 40%
  - vtr_3sec < 40% → vtr_25pct likely < 25%

Captions present → +15-25% VTR boost
  - captions_present: true → multiply base VTR by 1.15-1.25

Face-to-camera → Higher trust & engagement
  - gaze_direction_camera_pct > 60% → higher favorability_score and engagement_rate

CTA present → Higher conversions
  - cta_present: true → 20-40% higher conversion_rate_pct

Shorter duration → Higher completion
  - duration < 15s → completion_rate 35-50%
  - duration 30-60s → completion_rate 20-35%
  - duration > 60s → completion_rate 10-25%
```

### Platform-Specific Benchmarks
```
TikTok:
  - Higher engagement_rate (3-8%)
  - Lower conversion_rate (0.5-1.5%)
  - Faster pacing required
  - Vertical (9:16) format dominant

Meta (Facebook/Instagram):
  - Moderate metrics across the board
  - Strong targeting = better performance
  - Square (1:1) and vertical (4:5) work well

YouTube:
  - Longer watch time acceptable
  - Lower CTR (0.5-2%)
  - Higher consideration for expensive products
  - Horizontal (16:9) format

LinkedIn:
  - B2B focused
  - Lower engagement (0.5-2%)
  - Higher value per conversion
  - Professional tone required
```

### Realistic Metric Ranges
```
CTR: 0.5% - 3%           (>2% is strong)
VTR@50%: 20% - 60%       (platform dependent)
Completion: 15% - 45%    (length dependent)
ROAS: 1.5 - 6.0          (varies by industry)
Engagement: 0.5% - 5%    (social platforms)
Conversion: 0.5% - 5%    (landing page dependent)
```

---

## Summary: Why This Schema Works

1. **Complete Picture** - Combines performance data, creative analysis, and user decisions
2. **Actionable** - Every metric informs a specific decision or action
3. **Learnable** - Time-series and decisions create training data for AI improvement
4. **Realistic** - Correlations match real-world advertising performance
5. **Scalable** - MongoDB document model handles variable data sizes
6. **Platform-Aware** - Acknowledges different platforms have different patterns
7. **User-Centric** - Tracks user decisions and confidence for personalization

This schema enables the AI agent described in `docs/core.md` to provide intelligent, personalized, data-backed recommendations for ad approval decisions.
