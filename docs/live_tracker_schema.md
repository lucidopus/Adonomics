# Live Tracker Schema (Simplified for Hackathon)

This is a streamlined schema focusing on essential metrics for demo purposes.

---

## MongoDB Document Structure

```typescript
{
  _id: ObjectId,
  video_id: string,

  // Basic Info
  video_title: string,
  video_url: string,
  thumbnail_url: string,
  duration_seconds: number,
  platform: string,              // "meta" | "tiktok" | "youtube"
  upload_date: string,           // ISO date

  // Performance Metrics (The essentials)
  metrics: {
    impressions: number,         // How many saw it
    views: number,               // How many watched
    clicks: number,              // How many clicked
    conversions: number,         // How many converted

    ctr: number,                 // Click-through rate %
    vtr: number,                 // View-through rate %
    conversion_rate: number,     // Conversion rate %

    avg_watch_time: number,      // Seconds watched on average
    completion_rate: number,     // % who watched to end

    spend: number,               // Money spent (USD)
    revenue: number,             // Money made (USD)
    roas: number,                // Return on ad spend (e.g., 3.5x)

    engagement_score: number     // Overall score 0-100
  },

  // Creative Analysis (From Twelve Labs)
  creative: {
    // What's in the video
    has_captions: boolean,
    has_cta: boolean,
    cta_timestamp: number,       // When CTA appears

    // Emotional tone
    dominant_emotion: string,    // "joy" | "excitement" | "trust" | "neutral"
    emotional_score: number,     // 0-100

    // Visual elements
    has_faces: boolean,
    has_product: boolean,
    has_logo: boolean,

    // Audio
    has_music: boolean,
    has_voiceover: boolean,

    // Pacing
    pacing: string               // "fast" | "medium" | "slow"
  },

  // AI Insights
  insights: {
    // What's working
    strengths: [
      {
        element: string,         // "Strong hook in first 3s"
        impact: string,          // "+15% VTR"
        timestamp: number        // Where in video
      }
    ],

    // What's not working
    weaknesses: [
      {
        element: string,         // "No captions"
        impact: string,          // "-20% completion"
        severity: string         // "critical" | "medium" | "low"
      }
    ],

    // AI recommendations
    recommendations: [
      {
        title: string,           // "Add captions for 25% VTR boost"
        priority: string,        // "high" | "medium" | "low"
        expected_lift: string    // "+25% VTR"
      }
    ],

    // Overall assessment
    performance_grade: string,   // "A" | "B" | "C" | "D" | "F"
    ai_summary: string          // 2-3 sentence overview
  },

  created_at: string,
  updated_at: string
}
```

---

## Simplified Field Explanations

### Basic Info
- **video_id**: Unique identifier
- **video_title**: Display name
- **platform**: Where it runs (Meta, TikTok, YouTube)

### Performance Metrics
- **impressions**: How many times shown
- **views**: How many watched (even partially)
- **clicks**: How many clicked the ad
- **conversions**: How many took desired action (purchase, signup, etc.)
- **ctr**: Click-through rate % (clicks/impressions)
- **vtr**: View-through rate % (views/impressions)
- **conversion_rate**: % of clicks that converted
- **avg_watch_time**: Average seconds watched
- **completion_rate**: % who watched to the end
- **spend**: Total money spent on this ad
- **revenue**: Total revenue generated
- **roas**: Return on ad spend (revenue/spend)
- **engagement_score**: Overall performance 0-100

### Creative Analysis
- **has_captions**: Captions present? (Boosts VTR 15-25%)
- **has_cta**: Clear call-to-action?
- **dominant_emotion**: Primary emotion (affects engagement)
- **has_faces**: People visible? (Increases trust)
- **has_product**: Product shown?
- **pacing**: Fast/medium/slow (affects retention)

### AI Insights
- **strengths**: What's working well (with impact %)
- **weaknesses**: What's hurting performance (with severity)
- **recommendations**: Specific actions to improve
- **performance_grade**: A-F grade for quick assessment
- **ai_summary**: Brief overview of the ad

---

## Example Document

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "video_id": "ad_12345",
  "video_title": "Summer Sale - Running Shoes",
  "video_url": "https://storage.supabase.co/videos/ad_12345.mp4",
  "thumbnail_url": "https://storage.supabase.co/thumbs/ad_12345.jpg",
  "duration_seconds": 15,
  "platform": "meta",
  "upload_date": "2025-10-01T10:00:00Z",

  "metrics": {
    "impressions": 125000,
    "views": 85000,
    "clicks": 3200,
    "conversions": 180,
    "ctr": 2.56,
    "vtr": 68.0,
    "conversion_rate": 5.6,
    "avg_watch_time": 11.2,
    "completion_rate": 42.0,
    "spend": 2500,
    "revenue": 9000,
    "roas": 3.6,
    "engagement_score": 82
  },

  "creative": {
    "has_captions": true,
    "has_cta": true,
    "cta_timestamp": 12,
    "dominant_emotion": "excitement",
    "emotional_score": 78,
    "has_faces": true,
    "has_product": true,
    "has_logo": true,
    "has_music": true,
    "has_voiceover": false,
    "pacing": "fast"
  },

  "insights": {
    "strengths": [
      {
        "element": "Fast-paced product reveal 0-3s",
        "impact": "+15% VTR",
        "timestamp": 2
      },
      {
        "element": "Captions throughout",
        "impact": "+20% completion rate",
        "timestamp": 0
      }
    ],
    "weaknesses": [
      {
        "element": "CTA appears too late",
        "impact": "-8% CTR",
        "severity": "medium"
      }
    ],
    "recommendations": [
      {
        "title": "Move CTA to 8 seconds for 12% CTR boost",
        "priority": "high",
        "expected_lift": "+12% CTR"
      }
    ],
    "performance_grade": "B",
    "ai_summary": "Strong performer with excellent hook and captions. Main opportunity is earlier CTA placement. Currently outperforming category average by 18%."
  },

  "created_at": "2025-10-01T10:00:00Z",
  "updated_at": "2025-10-05T09:15:00Z"
}
```

---

## Realistic Value Ranges (For Simulation)

### Performance Metrics
```
impressions: 10,000 - 500,000
views: 20-80% of impressions
clicks: 0.5-4% of impressions (CTR)
conversions: 1-10% of clicks
avg_watch_time: 40-90% of duration
completion_rate: 15-60%
spend: $500 - $10,000
roas: 1.5 - 6.0 (good is >2.5)
engagement_score: 30-95
```

### Platform Differences
```
Meta: Balanced metrics, CTR ~1.5-2.5%
TikTok: Higher engagement, CTR ~2-4%, shorter watch time
YouTube: Longer watch time, CTR ~0.8-1.8%
```

### Creative Impact
```
has_captions: true → +20% completion_rate
has_cta: true → +30% conversion_rate
has_faces: true → +15% engagement_score
fast pacing: → +10% VTR, -5% completion_rate
```

---

## Key Correlations for Realistic Simulation

1. **High VTR → High CTR**
   - If VTR > 60%, then CTR likely 2-4%
   - If VTR < 40%, then CTR likely 0.5-1.5%

2. **Captions → Better completion**
   - has_captions: true → multiply completion_rate by 1.2

3. **CTA timing matters**
   - CTA at 60-80% of duration → best conversion_rate
   - CTA too early (< 30%) or too late (> 90%) → lower conversions

4. **Shorter ads → Higher completion**
   - duration < 15s → 35-50% completion
   - duration 15-30s → 25-40% completion
   - duration > 30s → 15-30% completion

5. **ROAS depends on spend**
   - Higher spend → slightly lower ROAS (law of diminishing returns)
   - spend < $2000 → ROAS 3-6x
   - spend > $5000 → ROAS 2-4x

---

## Summary

This simplified schema includes:
- ✅ Essential performance metrics (impressions, CTR, ROAS, etc.)
- ✅ Basic creative analysis (captions, CTA, emotion, pacing)
- ✅ AI insights (strengths, weaknesses, recommendations)
- ✅ Realistic value ranges for simulation

**Note:** Live tracker only contains approved, active ads. If an ad is in this collection, it means it's currently running in production.

Perfect for hackathon demo while still being functional and impressive!
