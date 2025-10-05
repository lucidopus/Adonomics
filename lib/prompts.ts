// Prompts for the Creative Intelligence AI Agent
// This file centralizes all prompts for the three-step analysis pipeline

export const SYSTEM_PROMPT = `You are the Creative Intelligence AI Agent for Adonomics. Your role is to analyze video advertisements through a comprehensive three-step process and provide actionable insights for marketing teams.

Follow these steps sequentially:

1. **Deep Video Understanding**: Use the twelve_labs_analyze tool to get detailed analysis of the video's creative elements, storytelling, emotional cues, and technical aspects.

2. **User Personalization**: Use the get_user_profile tool to understand the reviewer's role, preferences, and what they prioritize in ad evaluation.

3. **Competitive Intelligence**: Use the search_similar_ads tool to find comparable ads and analyze what works and what doesn't in similar creative approaches.

After gathering all context, use the generate_analysis_report tool to provide a structured analysis with:
- Success prediction factors
- Risk assessment concerns
- Personalized recommendations tailored to the user's profile
- Competitive insights and benchmarks

Be thorough, data-driven, and focus on actionable insights that help make approve/suspend/reject decisions.`;

export const TWELVE_LABS_ANALYZE_PROMPT = `Analyze this video advertisement comprehensively. Extract and provide detailed insights about:

**Creative Elements:**
- Visual composition, color schemes, and branding
- Characters, settings, and props
- Text overlays, logos, and messaging
- Pacing, transitions, and editing style

**Storytelling & Narrative:**
- Overall story arc and message flow
- Emotional triggers and audience engagement
- Call-to-action effectiveness
- Brand positioning and value propositions

**Technical Analysis:**
- Audio elements (music, voiceover, sound effects)
- Production quality and cinematography
- Target audience demographics suggested by creative
- Platform optimization indicators

**Performance Indicators:**
- Memorability factors
- Shareability potential
- Conversion likelihood signals
- Potential fatigue or saturation risks

Provide specific, actionable observations that marketing teams can use to evaluate ad effectiveness.`;

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

export const SYNTHESIS_PROMPT = `Now synthesize all gathered information into a comprehensive analysis report. Structure your output as a function call to generate_analysis_report with these parameters:

{
  "twelve_labs_summary": "Include the raw summary from Twelve Labs video analysis exactly as provided",
  "success_prediction": {
    "confidence_score": number (0-100),
    "key_strengths": string[],
    "performance_factors": string[],
    "audience_fit": string,
    "competitive_advantage": string
  },
  "risk_assessment": {
    "risk_level": "low" | "medium" | "high",
    "potential_issues": string[],
    "failure_risks": string[],
    "mitigation_suggestions": string[]
  },
  "personalized_recommendations": {
    "decision_suggestion": "approve" | "suspend" | "reject",
    "action_items": string[],
    "optimization_priorities": string[],
    "user_specific_insights": string
  },
  "creative_analysis": {
    "storytelling_effectiveness": string,
    "visual_impact": string,
    "emotional_resonance": string,
    "technical_quality": string
  },
  "competitive_intelligence": {
    "market_positioning": string,
    "benchmark_comparison": string,
    "differentiation_opportunities": string,
    "trend_alignment": string
  }
}

Ensure recommendations are tailored to the user's profile and provide clear rationale for the suggested decision.`;

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
      description: "Generate the final structured analysis report for dashboard rendering",
      parameters: {
        type: "object",
        properties: {
          twelve_labs_summary: {
            type: "string",
            description: "Raw summary text directly from Twelve Labs video analysis"
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
              user_specific_insights: { type: "string" }
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