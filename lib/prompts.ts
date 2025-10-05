// Prompts for the Creative Intelligence AI Agent
// This file centralizes all prompts for the three-step analysis pipeline

export const SYSTEM_PROMPT = `You are the Creative Intelligence Lab AI Agent for the Advertising Week Hackathon. Your role is to analyze video advertisements by integrating quantitative and qualitative feedback from creative pretesting with deep video understanding to generate specific recommendations for creative optimization.

Follow these steps sequentially:

1. **Video Content Analysis**: Use the twelve_labs_analyze tool to extract detailed creative elements, metadata, emotional features, and technical aspects from the video.

2. **Audience Response Integration**: Analyze how different audience segments respond to specific creative elements based on quantitative metrics (brand favorability, purchase consideration) and qualitative feedback.

3. **Creative Recommendations**: Generate specific, actionable recommendations for what to change, remove, or add in the creative to maximize persuasion across different audience segments and brand objectives.

After gathering all context, use the generate_analysis_report tool to provide a structured analysis aligned with the Creative Intelligence Lab challenge requirements:
- Metadata extraction (ad details, campaign info, platform data)
- Creative features analysis (visual elements, audio, pacing, branding)
- Emotional features assessment (tone, sentiment, cultural sensitivity)
- Performance-based recommendations with "why it will work/won't work" rationale
- Audience segment-specific insights and optimization suggestions

Focus on enterprise-ready insights that marketing leaders can implement immediately.`;

export const TWELVE_LABS_ANALYZE_PROMPT = `Analyze this video advertisement comprehensively for the Creative Intelligence Lab challenge. Extract structured data in these exact categories:

**Metadata:**
- brand: Brand name or company
- campaign_name: Campaign title or theme
- year: Production year
- quarter: Quarter of release (Q1, Q2, Q3, Q4)
- platform: Primary platform (YouTube, TikTok, Instagram, TV, etc.)
- region: Target geographic region or market

**Creative Features:**
- scene_id: Identifier for key scenes
- scene_duration: Duration of important scenes in seconds
- objects_present: Array of objects detected in the video
- faces_detected: Number of faces detected
- brand_logo_presence: Boolean indicating logo visibility
- text_on_screen: Array of text elements shown
- audio_elements: Array of audio components (music, voiceover, SFX)
- music_tempo: Tempo description (slow, medium, fast, upbeat)
- music_mode: Mood of music (majestic, tense, happy, sad)
- color_palette_dominant: Array of dominant colors
- editing_pace: Editing speed (slow, medium, fast, dynamic)

**Emotional Features:**
- emotion_primary: Primary emotion conveyed (joy, sadness, excitement, fear)
- emotion_intensity: Intensity level (1-10 scale)
- emotional_arc_timeline: Array describing emotional progression
- tone_of_voice: Voiceover tone (confident, urgent, warm, authoritative)
- facial_expression_emotions: Object mapping emotions to intensity scores
- audience_perceived_sentiment: Overall sentiment (positive, negative, neutral)
- cultural_sensitivity_flag: Boolean for potential cultural issues

**Additional Analysis:**
- Storytelling effectiveness and narrative structure
- Visual impact and technical quality
- Emotional resonance and audience engagement
- Performance indicators and optimization opportunities

Provide data-driven insights that can be correlated with quantitative testing results and qualitative feedback to generate specific creative recommendations.`;

export const USER_PROFILE_CONTEXT_PROMPT = `Use this user profile summary to tailor your analysis approach and recommendations. Consider:

- Their role and technical comfort level
- Primary goals (ROI, brand awareness, emotional impact, etc.)
- Decision factors they prioritize
- Platform preferences and campaign types
- Team collaboration needs
- Pain points and frustrations

Adapt your analysis depth, terminology, and focus areas to match their expertise and needs. For example:
- Technical users get detailed metrics
- Marketing managers get business impact focus
- Creative directors get emotional storytelling insights`;

export const COMPETITIVE_SEARCH_PROMPT = `Find and analyze similar advertisements to provide competitive intelligence. For each comparable ad, assess:

**Similarities:**
- Creative approach and style
- Target audience and messaging
- Product category and positioning
- Visual and narrative elements

**Performance Insights:**
- What worked well (engagement, conversion, memorability)
- What underperformed or failed
- Success factors and best practices
- Common pitfalls to avoid

**Benchmarking:**
- How this ad compares to market standards
- Innovative elements vs. proven approaches
- Risk levels based on similar campaigns
- Optimization opportunities identified in competitors

Provide specific examples and data-driven comparisons to help evaluate this ad's potential success.`;

export const SYNTHESIS_PROMPT = `Synthesize all information into a Creative Intelligence Lab analysis report. Use the generate_analysis_report function with this exact JSON structure:

{
  "twelve_labs_summary": "Raw Twelve Labs summary",
  "metadata": {"brand": "string", "campaign_name": "string", "year": 2025, "quarter": "Q4", "platform": "YouTube", "region": "North America"},
  "creative_features": {"scene_id": "scene_1", "scene_duration": 15, "objects_present": ["product"], "faces_detected": 1, "brand_logo_presence": true, "text_on_screen": ["CTA"], "audio_elements": ["voiceover"], "music_tempo": "moderate", "music_mode": "major", "color_palette_dominant": ["#000000"], "editing_pace": 1.0},
  "emotional_features": {"emotion_primary": "excitement", "emotion_intensity": 7, "emotional_arc_timeline": ["curiosity", "excitement"], "tone_of_voice": "confident", "facial_expression_emotions": {"happy": 0.8}, "audience_perceived_sentiment": "positive", "cultural_sensitivity_flag": false},
  "success_prediction": {"confidence_score": 85, "key_strengths": ["Strong hook"], "performance_factors": ["Clear value prop"], "audience_fit": "Tech millennials", "competitive_advantage": "Better engagement"},
  "risk_assessment": {"risk_level": "low", "potential_issues": ["Slow pacing"], "failure_risks": ["Low conversion"], "mitigation_suggestions": ["Speed up intro"]},
  "personalized_recommendations": {"decision_suggestion": "approve", "action_items": ["Add CTA"], "optimization_priorities": ["Pacing"], "user_specific_insights": "Focus on ROAS", "performance_based_rationale": "Will boost engagement by 15%", "expected_roi_impact": "20% ROAS increase", "competitive_benchmarking": "Above category average"},
  "creative_analysis": {"storytelling_effectiveness": "Strong narrative", "visual_impact": "Clean design", "emotional_resonance": "High trust", "technical_quality": "Professional"},
  "competitive_intelligence": {"market_positioning": "Mid-tier", "benchmark_comparison": "Above average", "differentiation_opportunities": "Unique features", "trend_alignment": "Current trends"}
}

Focus on hackathon requirements: creative recommendations, performance rationale, ROI projections, competitive benchmarking.`;

// Tool definitions for the AI agent
export const TOOL_DEFINITIONS = [
  {
    type: "function" as const,
    function: {
      name: "twelve_labs_analyze",
      description: "Analyze a video advertisement using Twelve Labs API to extract creative elements, storytelling, and performance indicators",
      parameters: {
        type: "object",
        properties: {
          video_id: {
            type: "string",
            description: "The unique identifier of the video to analyze"
          },
          analysis_prompt: {
            type: "string",
            description: "Specific questions or focus areas for the analysis"
          }
        },
        required: ["video_id"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "get_user_profile",
      description: "Retrieve the user's profile summary to personalize the analysis approach",
      parameters: {
        type: "object",
        properties: {
          user_id: {
            type: "string",
            description: "The unique identifier of the user"
          }
        },
        required: ["user_id"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "search_similar_ads",
      description: "Search for similar advertisements in the database for competitive intelligence",
      parameters: {
        type: "object",
        properties: {
          video_id: {
            type: "string",
            description: "The video ID to find similar ads for"
          },
          criteria: {
            type: "string",
            description: "Search criteria like theme, product category, style, etc."
          }
        },
        required: ["video_id"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "generate_analysis_report",
      description: "Generate the final structured Creative Intelligence Lab analysis report for dashboard rendering",
      parameters: {
        type: "object",
        properties: {
          twelve_labs_summary: {
            type: "string",
            description: "Raw summary text directly from Twelve Labs video analysis"
          },
          metadata: {
            type: "object",
            properties: {
              ad_id: { type: "string" },
              brand: { type: "string" },
              campaign_name: { type: "string" },
              year: { type: "number" },
              quarter: { type: "string" },
              platform: { type: "string" },
              region: { type: "string" }
            }
          },
          creative_features: {
            type: "object",
            properties: {
              scene_id: { type: "string" },
              scene_duration: { type: "number" },
              objects_present: { type: "array", items: { type: "string" } },
              faces_detected: { type: "number" },
              brand_logo_presence: { type: "boolean" },
              text_on_screen: { type: "array", items: { type: "string" } },
              audio_elements: { type: "array", items: { type: "string" } },
              music_tempo: { type: "string" },
              music_mode: { type: "string" },
              color_palette_dominant: { type: "array", items: { type: "string" } },
              editing_pace: { type: "number" }
            }
          },
          emotional_features: {
            type: "object",
            properties: {
              emotion_primary: { type: "string" },
              emotion_intensity: { type: "number", minimum: 1, maximum: 10 },
              emotional_arc_timeline: { type: "array", items: { type: "string" } },
              tone_of_voice: { type: "string" },
              facial_expression_emotions: { type: "object", additionalProperties: { type: "number" } },
              audience_perceived_sentiment: { type: "string" },
              cultural_sensitivity_flag: { type: "boolean" }
            }
          },
          success_prediction: {
            type: "object",
            properties: {
              confidence_score: { type: "number", minimum: 0, maximum: 100 },
              key_strengths: { type: "array", items: { type: "string" } },
              performance_factors: { type: "array", items: { type: "string" } },
              audience_fit: { type: "string" },
              competitive_advantage: { type: "string" }
            },
            required: ["confidence_score", "key_strengths", "performance_factors", "audience_fit", "competitive_advantage"]
          },
          risk_assessment: {
            type: "object",
            properties: {
              risk_level: { type: "string", enum: ["low", "medium", "high"] },
              potential_issues: { type: "array", items: { type: "string" } },
              failure_risks: { type: "array", items: { type: "string" } },
              mitigation_suggestions: { type: "array", items: { type: "string" } }
            },
            required: ["risk_level", "potential_issues", "failure_risks", "mitigation_suggestions"]
          },
          personalized_recommendations: {
            type: "object",
            properties: {
              decision_suggestion: { type: "string", enum: ["approve", "suspend", "reject"] },
              action_items: { type: "array", items: { type: "string" } },
              optimization_priorities: { type: "array", items: { type: "string" } },
              user_specific_insights: { type: "string" },
              performance_based_rationale: { type: "string" },
              expected_roi_impact: { type: "string" },
              competitive_benchmarking: { type: "string" }
            },
            required: ["decision_suggestion", "action_items", "optimization_priorities", "user_specific_insights"]
          },
          creative_analysis: {
            type: "object",
            properties: {
              storytelling_effectiveness: { type: "string" },
              visual_impact: { type: "string" },
              emotional_resonance: { type: "string" },
              technical_quality: { type: "string" }
            },
            required: ["storytelling_effectiveness", "visual_impact", "emotional_resonance", "technical_quality"]
          },
          competitive_intelligence: {
            type: "object",
            properties: {
              market_positioning: { type: "string" },
              benchmark_comparison: { type: "string" },
              differentiation_opportunities: { type: "string" },
              trend_alignment: { type: "string" }
            },
            required: ["market_positioning", "benchmark_comparison", "differentiation_opportunities", "trend_alignment"]
          }
        },
        required: ["success_prediction", "risk_assessment", "personalized_recommendations", "creative_analysis", "competitive_intelligence"]
      }
    }
  }
];