# Adonomics: Creative Genome Performance Insights Dashboard

## What We Want to Build

I want to build an AI-powered analytics platform that helps marketing teams understand *why* their video ad creatives work or don't work. Not just surface-level metrics like "this ad got 5% CTR," but deep insights like "the emotional shift from humor to aspiration at 0:12 drove a 23% increase in purchase intent among women 25-34."

This is a Creative Genome Performance Insights Dashboard that dissects video advertisements to understand their "emotional DNA" - analyzing scenes for emotional arcs, visual elements, pacing, and dialogue - then correlating these creative elements with actual performance metrics from pre-testing experiments.

Think of it as turning subjective creative decisions into science-backed recommendations.

## The Core Problem

**The Problem**: Marketing teams and creative agencies spend millions producing video ads, but they rely on gut feeling and expensive trial-and-error to understand what works. Current analytics tools tell you *what* happened (views, clicks, conversions), but not *why* it happened.

When a brand tests 5 different ad variations:
- They see one performed better, but don't know which specific creative elements drove that success
- They waste time running blind A/B tests instead of making informed creative decisions
- They can't translate insights from one campaign to the next because the learnings aren't structured
- Different audience segments respond differently, but they lack the granular analysis to understand these nuances

**What's Missing**: A system that combines deep video content analysis (what's actually in the ad) with qualitative feedback (what people said about it) and quantitative performance data (how it moved the metrics) to generate specific, actionable creative recommendations.

The advertising industry has the data - Swayable and similar platforms run randomized controlled trial experiments that measure persuasion. They collect open-ended responses where viewers explain what they liked or didn't. But this data sits in spreadsheets and PDFs, requiring manual analysis to extract insights.

## How It Will Work

### The User Journey

1. **Upload & Configure**
   - A creative director uploads their video ad (15-60 seconds)
   - They also provide the Swayable experiment results (CSV with quantitative metrics, qualitative open-ended responses)
   - They specify what they want to optimize for: brand favorability, purchase intent, brand associations, etc.

2. **Automated Analysis Pipeline**
   - The system automatically dissects the video into scenes
   - Each scene is analyzed for emotional content, visual elements, objects, people, pacing, dialogue
   - Simultaneously, the qualitative feedback is processed to understand viewer sentiment
   - The quantitative metrics are parsed to identify which audience segments responded positively or negatively

3. **Intelligent Synthesis**
   - An AI agent cross-references the video content analysis with the performance data
   - It identifies patterns: "Scenes featuring the product in use correlated with +15% brand favorability"
   - It segments insights by audience: "Men 18-24 responded negatively to the formal tone, while women 35-44 found it trustworthy"

4. **Actionable Dashboard**
   - Results are presented in an interactive dashboard showing:
     - **Emotional Arc Timeline**: Visual representation of the ad's emotional journey with performance overlays
     - **Creative Element Performance**: Which specific elements (colors, expressions, music cues, dialogue) drove results
     - **Audience Segment Insights**: How different demographics responded to different moments
     - **Recommendations**: Specific, actionable suggestions like "Increase the duration of scenes showing product benefits by 3-5 seconds" or "Consider testing a version with more diverse casting for better resonance with 18-34 demographic"

5. **Audio Summary**
   - The platform generates a voice narration summarizing the key findings, perfect for sharing with stakeholders in presentations

### The Technical Flow

The system uses an AI orchestration pattern powered by Trigger.dev v4:

**Phase 1: Parallel Analysis**
- **Video Understanding** (Twelve Labs API): Scene detection, object recognition, emotional content, visual aesthetics, pacing analysis
- **Qualitative Processing** (Amazon Bedrock): NLP analysis of open-ended survey responses to extract themes, sentiment, specific creative element mentions
- **Quantitative Parsing**: Structure the Swayable CSV data by metric type and audience segment

**Phase 2: Knowledge Synthesis**
- **Cross-Correlation** (Amazon Bedrock): AI agent compares video elements with performance data to identify causal relationships
- **Segment Analysis**: Break down insights by audience demographics to find differential responses

**Phase 3: Recommendation Generation**
- **Creative Insights** (Amazon Bedrock): Generate specific, actionable recommendations based on the correlated data
- **Report Compilation**: Structure findings into a coherent, presentable format

**Phase 4: Output Creation**
- **Dashboard Rendering**: Interactive Next.js frontend displays the complete analysis
- **Audio Narration** (ElevenLabs): Convert key findings into a professional voice summary

All processing status, results, and media are stored in Supabase for persistence and retrieval.

## The Experience I Want

### For the Creative Director
Sarah, a creative director at a mid-sized agency, just finished a pre-test for a new smartphone ad. She has the Swayable report sitting in her downloads folder. In the old workflow, she'd spend 2-3 hours manually reading through 200+ open-ended responses, trying to find patterns, then cross-referencing with the metric tables.

**With Adonomics:**
- She drags the video and CSV into the upload interface
- 5 minutes later, she has a complete analysis dashboard
- She sees immediately that the "unboxing moment" at 0:08 drove the strongest positive response, but only among tech enthusiasts
- The system flags that the "family dinner scene" performed poorly with 18-24 year olds who found it "cringy" (exact quote from qual data)
- She gets a specific recommendation: "Consider testing a version that replaces the family dinner scene with a social gathering context for younger audiences"
- She exports a PDF report and shares the audio summary in her team Slack

### For the Brand Manager
Mike manages creative strategy for a CPG brand. He needs to justify creative decisions to leadership with data, not just intuition.

**With Adonomics:**
- He runs multiple ad variants through the system
- The comparative dashboard shows him exactly which creative elements (humor vs. emotional, product-first vs. lifestyle-first) drove the metrics that matter to his business
- He walks into the executive meeting with a presentation that says: "Based on analysis of 4 creative variants tested with 2,000 consumers, the emotional storytelling approach drove 18% higher purchase intent, specifically because the 'moment of connection' scene at 0:15 resonated with our core 25-44 female demographic"
- Leadership approves the creative direction because it's backed by data, not opinion

### What Success Feels Like
- **Fast**: Analysis that used to take hours happens in minutes
- **Insightful**: Move beyond "what" to "why" with specific creative element attribution
- **Actionable**: Not just data, but clear recommendations creative teams can implement
- **Segment-Aware**: Understand how different audiences respond differently to the same creative
- **Shareable**: Professional reports and audio summaries ready for stakeholder presentations

## Essential Requirements

### Must-Have for Hackathon Demo

1. **Video Upload & Processing**
   - Support common video formats (MP4, MOV)
   - Store in Supabase Storage
   - Trigger analysis pipeline automatically

2. **Twelve Labs Integration**
   - Scene-by-scene analysis
   - Emotional content detection
   - Object and people recognition
   - Visual aesthetics and pacing analysis

3. **Swayable Data Processing**
   - Parse CSV files with quantitative metrics (persuasion scores, brand favorability, purchase intent)
   - Process open-ended qualitative responses
   - Segment data by demographics

4. **Amazon Bedrock AI Analysis**
   - Cross-correlate video elements with performance metrics
   - Extract patterns and causal relationships
   - Generate segment-specific insights
   - Produce actionable creative recommendations

5. **ElevenLabs Voice Generation**
   - Convert key findings into professional audio narration
   - Include in the final report deliverable

6. **Interactive Dashboard**
   - Visual timeline showing emotional arc overlayed with performance data
   - Breakdown of creative elements and their impact
   - Audience segment analysis
   - Clear, presentable recommendations section

7. **Reliable Orchestration**
   - Trigger.dev v4 pipeline for multi-step async processing
   - Status tracking (processing, completed, failed)
   - Error handling and retry logic

### Nice-to-Have (If Time Permits)

- Comparative analysis across multiple ad variants
- Export to PDF/PowerPoint
- Fine-grained emotional analysis using additional sentiment APIs
- Custom audience segment creation
- Historical campaign library with searchable insights

### Technical Constraints

- Must use Trigger.dev v4 self-hosted instance (already configured)
- All tasks must be properly exported and use the new SDK pattern
- UI must follow the design system in `docs/dev_rules/ui_rules.md`
- TypeScript strict mode throughout
- Mobile-responsive dashboard (judges may view on various devices)

## Technical Approach

### Architecture Pattern

**Orchestrated AI Pipeline** (Not a single autonomous agent, but AI-enhanced tasks)

We're using Trigger.dev to orchestrate a multi-step pipeline where each task leverages AI for intelligent processing, but the overall flow is predictable and debuggable - critical for a 48-hour hackathon timeline.

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Task Orchestration**: Trigger.dev v4 (self-hosted)
- **Database**: Supabase (Postgres)
- **Storage**: Supabase Storage (video files, generated audio)
- **Video Analysis**: Twelve Labs API
- **AI/LLM**: Amazon Bedrock (Claude for qualitative analysis, synthesis, recommendations)
- **Voice**: ElevenLabs API
- **Deployment**: Vercel (frontend), Railway/Render (Trigger.dev workers)

### Task Pipeline Design

```
POST /api/analyze
  ↓
[Task 1: video-analysis]
  - Upload video to Twelve Labs
  - Extract: scenes, emotions, objects, people, pacing
  - Store results in Supabase
  ↓
[Task 2: qualitative-analysis] (runs in parallel with Task 3)
  - Read open-ended responses from CSV
  - Use Bedrock to extract themes, sentiment, creative element mentions
  - Store structured qualitative insights
  ↓
[Task 3: quantitative-analysis] (runs in parallel with Task 2)
  - Parse Swayable CSV for metric scores
  - Organize by audience segment
  - Store structured quantitative data
  ↓
[Task 4: knowledge-synthesis]
  - Cross-reference video analysis with qual + quant data
  - Use Bedrock to identify correlations
  - Generate segment-specific insights
  - Store synthesis results
  ↓
[Task 5: recommendations-generation]
  - Use Bedrock to create actionable creative recommendations
  - Format for presentation
  - Store recommendations
  ↓
[Task 6: audio-narration]
  - Convert key findings to script
  - Generate voice narration via ElevenLabs
  - Store audio file in Supabase Storage
  ↓
[Task 7: finalize-report]
  - Aggregate all outputs
  - Mark report as complete
  - Trigger any notifications
```

### Database Schema

Single `reports` table (simple for hackathon):

```typescript
{
  id: UUID (primary key)
  status: ENUM ('pending', 'processing', 'completed', 'failed')
  created_at: TIMESTAMP
  video_url: TEXT (Supabase Storage URL)
  csv_url: TEXT (Swayable data file URL)

  // Analysis results (JSONB for flexible structure)
  video_analysis: JSONB (Twelve Labs output)
  qualitative_insights: JSONB (Bedrock-processed qual data)
  quantitative_metrics: JSONB (Structured Swayable metrics)
  synthesis: JSONB (Cross-correlation insights)
  recommendations: TEXT (Final creative recommendations)

  // Output artifacts
  report_audio_url: TEXT (ElevenLabs narration)

  // Metadata
  error_message: TEXT (if failed)
  processing_time_ms: INTEGER
}
```

### API Routes

- `POST /api/analyze` - Upload video + CSV, trigger pipeline
- `GET /api/reports` - List all reports (with status)
- `GET /api/reports/[id]` - Fetch specific report with all analysis data
- `GET /api/reports/[id]/status` - Lightweight status check for polling

### UI Components

Following the design system in `docs/dev_rules/ui_rules.md`:

1. **Upload Page**
   - Drag-and-drop video upload with progress
   - CSV file upload with validation
   - Configuration options (target metric, audience segments of interest)

2. **Processing Status Page**
   - Real-time pipeline status with animated progress
   - Task-by-task completion indicators
   - Estimated time remaining

3. **Dashboard/Report Page**
   - **Hero Section**: Video player with timeline scrubber
   - **Emotional Arc Visualization**: Line chart showing emotional journey overlayed with metric performance
   - **Creative Element Breakdown**: Cards showing specific elements (scenes, objects, dialogue) with impact scores
   - **Audience Segment Analysis**: Tabs or dropdown to view insights by demographic
   - **Recommendations Panel**: Clear, numbered action items with supporting data
   - **Audio Summary**: Embedded audio player with download option
   - **Export Options**: PDF, share link

### Key Development Patterns

**Trigger.dev v4 Task Pattern** (Critical - from `docs/dev_rules/trigger_rules.md`):

```typescript
// ✅ CORRECT
import { task, logger } from "@trigger.dev/sdk";

export const videoAnalysisTask = task({
  id: "video-analysis",
  run: async (payload: { reportId: string, videoUrl: string }) => {
    logger.info("Starting video analysis", { reportId: payload.reportId });

    // All processing logic here
    const result = await analyzeFith TwelveLabs(payload.videoUrl);

    // Store in Supabase
    await supabase
      .from('reports')
      .update({ video_analysis: result })
      .eq('id', payload.reportId);

    return result;
  },
});
```

**UI Development** (from `docs/dev_rules/ui_rules.md`):
- OKLCH color space with semantic variables
- Dark mode support throughout
- Geist Sans/Inter typography
- Mobile-first responsive design
- Accessibility (WCAG AA compliance)

## Success Metrics

### Hackathon Judging Criteria Alignment

**Intelligence Depth (50% of score)**
- ✅ Sophisticated content analysis beyond basic object detection (Twelve Labs multi-modal)
- ✅ Integration of quantitative + qualitative + video content analysis (three data sources)
- ✅ Segment-specific insights and recommendations (demographic breakdowns)
- ✅ Causal correlation between creative elements and performance (AI synthesis)

**Insights & Recommendations Reporting (35% of score)**
- ✅ Creative marketers can easily read and share insights (dashboard design)
- ✅ Presentable format with visual timeline, charts, and clear recommendations
- ✅ Audio narration for stakeholder sharing (ElevenLabs)
- ✅ Export capabilities (PDF/share link)

**Speed & Scalability (15% of score)**
- ✅ Automated pipeline (minimal manual intervention)
- ✅ Async processing allows concurrent analysis of multiple experiments
- ✅ Cloud-based architecture supports scaling to hundreds of experiments
- ✅ Parallel task execution where possible (qual + quant analysis)

### Demo Success Criteria

For the hackathon presentation to be successful:

1. **Working End-to-End Demo**
   - Upload a sample video + Swayable CSV
   - Show real-time processing status
   - Display completed analysis dashboard within 3-5 minutes
   - Play the audio summary

2. **Compelling Sample Analysis**
   - Use one of the Swayable demo experiments (iPhone, Patagonia, Samsung, AB InBev)
   - Show clear, specific insights (not generic)
   - Demonstrate segment-specific recommendations
   - Highlight correlation between video elements and performance

3. **Polished Presentation**
   - 2-minute business impact explanation (why this matters to brands)
   - 3-minute live demo (upload → dashboard → insights)
   - 2-minute technical deep-dive (AI integration, scalability)
   - 2-minute Q&A with judges

4. **Technical Documentation**
   - GitHub repository with clear README
   - API integration docs showing how this fits into existing marketing tech stacks
   - Sample output/report for judges to review

### What "Good" Looks Like

**Minimum Viable Demo:**
- Successfully process 1 video + CSV
- Display emotional arc timeline with performance data
- Show 3-5 specific creative recommendations
- Generate audio summary

**Strong Demo:**
- Process 2-3 different ad variants
- Comparative analysis showing which creative approach performed better and why
- Segment breakdown for at least 2 demographic groups
- Professional UI that looks production-ready

**Winning Demo:**
- Comparative analysis across multiple experiments
- Insights that judges find genuinely surprising or valuable
- Seamless UX that feels like a real product
- Technical sophistication that showcases all sponsor APIs effectively

## Hackathon Deliverables

### Sunday 1:00 PM Submission

1. **Code Repository**
   - GitHub repo with complete source code
   - README with setup instructions
   - Environment variable documentation
   - Sample data/CSV files for testing

2. **Live Demo Application**
   - Deployed Next.js frontend (Vercel)
   - Running Trigger.dev workers (Railway/Render)
   - Supabase database configured
   - All API integrations working

3. **Technical Documentation**
   - API integration guide
   - Architecture diagram
   - Scalability considerations
   - Future roadmap

4. **Sample Report/Output**
   - Pre-generated analysis for judges to review
   - PDF export of dashboard
   - Audio narration file

### Presentation Materials (Sunday 1:30-4:00 PM)

1. **Slide Deck** (Optional but helpful for context)
   - Problem statement (30 seconds)
   - Solution overview (30 seconds)
   - Business impact (1 minute)
   - Live demo (3 minutes)
   - Technical architecture (2 minutes)
   - Q&A (2 minutes)

2. **Live Demo Script**
   - Pre-uploaded video + CSV ready to process
   - Backup pre-processed report in case of live demo issues
   - Key talking points for each dashboard section

3. **Judge Q&A Preparation**
   - Anticipated questions about scalability, competition, business model
   - Technical deep-dive answers ready
   - Clear articulation of AI integration strategy

## The Bigger Picture

### Why This Matters

The advertising industry is in the middle of a massive transformation. AI is making creative production faster and cheaper, but the fundamental question remains: **What makes an ad effective?**

Brands are drowning in data but starving for insights. They have dashboards showing impressions, clicks, and conversions, but these metrics are lagging indicators. By the time you know an ad performed poorly, you've already spent the media budget.

**Pre-testing is the solution** - platforms like Swayable let brands measure persuasion before launch. But pre-testing generates massive amounts of data (video content, qual responses, quant scores) that currently requires manual analysis.

Adonomics automates this analysis, turning a 10-hour manual process into a 5-minute automated one. More importantly, it surfaces insights that human analysts might miss - subtle correlations between visual elements and audience responses, patterns across creative variants, segment-specific reactions.

### The Business Opportunity

**Immediate Market:**
- Mid-to-large brands with significant ad budgets ($1M+ annually)
- Creative agencies producing video ads for multiple clients
- Marketing technology companies building creative optimization tools

**Revenue Model:**
- Per-analysis pricing (e.g., $99-299 per video + experiment analysis)
- Subscription for agencies analyzing multiple campaigns monthly
- Enterprise licensing for large brands with in-house teams

**Competitive Differentiation:**
- Motion focuses on ad performance in-market; we focus on pre-testing optimization
- Swayable provides raw data; we provide synthesized, actionable insights
- Other tools analyze video OR qual OR quant; we integrate all three

### Post-Hackathon Vision

If this wins (or even if it doesn't), the roadmap is clear:

**Phase 1 (Months 1-3): Polish & Validate**
- Refine the analysis algorithms based on user feedback
- Partner with 5-10 brands for beta testing
- Build out comparative analysis across ad variants
- Add more video understanding capabilities (music analysis, color psychology)

**Phase 2 (Months 4-6): Platform Features**
- Historical campaign library with searchable insights
- Cross-campaign pattern recognition ("Your successful ads always feature X")
- Creative brief generator based on past learnings
- Integration with creative asset management tools

**Phase 3 (Months 7-12): Enterprise Scale**
- Multi-user collaboration features
- Advanced segmentation and custom audience creation
- API for integration with existing marketing tech stacks
- White-label offering for agencies

The hackathon is just the beginning - this is a real business opportunity at the intersection of AI, advertising, and analytics.

---

## Hackathon Context

**Event**: Generative AI in Advertising Hackathon
**Date**: October 4-5, 2025
**Location**: Betaworks, New York
**Host**: TwelveLabs in partnership with NEA
**Sponsors**: ElevenLabs, AWS, Swayable

**Challenge**: The Creative Intelligence Lab
**Goal**: Build a system that analyzes quant and qual feedback from creative pretesting along with video creative details to identify creative elements that resonate with various audiences and generate specific recommendations for what to change/remove/add in the creative.

**Judges**:
- Alex Sherman (CEO @ Bluefish AI)
- Michael Santana (Lead Solutions Architect, Advertising & Marketing Technology @ AWS)
- Anshuk Gandhi (VP of Product @ Swayable)
- Ari Paparo (Founder @ Marketecture Media)
- Jonathan Meyers (CTO & Co-Founder @ Agentio)
- Michael Bishop (CTO & Co-Founder @ OpenAds)

**Prize**: Up to $2,500 for top 3 winning teams

**Submission Deadline**: Sunday, October 5 at 1:00 PM
**Presentations**: Sunday, October 5, 1:00-4:00 PM

---

*This plan transforms subjective creative decisions into science-backed strategy, one video at a time.*
