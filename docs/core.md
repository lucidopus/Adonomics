# Core AI Agent: Creative Intelligence System

## What We're Building

An AI-powered agent that serves as the brain of our advertising analysis platform. This intelligent system analyzes video ads, understands their creative DNA, and provides personalized insights that help marketing teams make data-driven decisions about which ads to approve, suspend, or reject.

## The Two Core User Experiences

### 1. Live Ads Dashboard
**What the user sees:** An interactive, data-rich dashboard showing real-time performance of all currently running ads.

**The experience I want:**
- Users open the dashboard and immediately understand how their live campaigns are performing
- Visual indicators (charts, graphs, heatmaps) show key performance metrics at a glance
- Users can drill down into specific ads to see detailed creative analysis
- The dashboard is responsive and updates with real performance data

**Key requirement:** This is a monitoring tool - users need to quickly assess the health of their live campaigns without doing analysis.

### 2. New Ad Analysis & Decision Flow
**What the user sees:** An upload interface where they can submit a new ad for AI-powered analysis, then make an informed decision.

**The experience I want:**
1. User uploads a new video ad
2. System performs deep, multi-layered analysis (explained below)
3. User receives a comprehensive, personalized report
4. User makes one of three decisions:
   - **Approve**: Ad looks great, add it to live tracker
   - **Suspend**: Ad has potential but needs work, save with comments for revision
   - **Reject**: Ad doesn't meet standards, archive with explanation

## The Three-Step Analysis Pipeline

When a user uploads a new ad, the system needs to build comprehensive context before generating insights. Think of it like a detective gathering evidence before solving a case.

### Step 1: Deep Video Understanding (Twelve Labs)
**Purpose:** Understand every aspect of the video creative

The system uses Twelve Labs API to:
- Break down the video scene-by-scene
- Identify objects, people, settings, and visual elements
- Detect emotional cues and storytelling patterns
- Analyze pacing, timing, and transitions
- Extract text, logos, and brand elements
- Understand the narrative arc and message flow

**Important:** We use the Twelve Labs analysis endpoint with LLM-powered queries to get specific, targeted insights - not just generic video analysis. The LLM can ask precise questions to extract exactly what matters for advertising effectiveness.

### Step 2: User Personalization (Profile Context)
**Purpose:** Tailor the analysis to the user's expertise and needs

We already have `lib/user-profile-summary.ts` that generates a natural language summary of the user's:
- Role (Marketing Manager, Creative Director, etc.)
- Technical comfort level (high-level summaries vs. detailed data)
- Primary goals (ROI, brand awareness, emotional impact, etc.)
- Platform preferences (Meta, TikTok, YouTube, etc.)
- Decision factors (what they prioritize when evaluating ads)

**The problem we're solving:** A Marketing Manager shouldn't see highly technical video production metrics they won't understand. A Creative Director needs emotional storytelling insights, not just CTR predictions. The analysis must speak the user's language and focus on what they care about.

**Example:** If the ad contains technical smartphone specifications and the user is a Marketing Manager (not technical), the system should:
- Simplify or skip overly technical details
- Focus on how the features are presented emotionally
- Highlight messaging clarity and audience appeal
- Explain concepts in business terms, not technical jargon

### Step 3: Competitive Intelligence (Similar Ads Search)
**Purpose:** Learn from what's already working (and what's not)

Using our existing video search capability:
- Find similar ads in the live tracker database
- Identify ads with similar creative patterns, themes, or approaches
- Analyze WHY the successful ones are performing well
- Understand WHY similar ads have failed

**Critical insight:** We don't just show similar ads - we explain the success/failure factors. This gives users comparative intelligence to make better decisions.

## The AI Agent's Job: Synthesis & Recommendations

After gathering all three pieces of context:
1. Deep video analysis (what's IN the ad)
2. User profile (who's VIEWING the analysis)
3. Competitive intelligence (what's WORKING in the market)

**The AI agent synthesizes everything into a structured output that answers:**

### For Success Prediction:
- What creative elements suggest this ad will perform well?
- Which audience segments will likely respond best?
- What emotional triggers are present and effective?
- How does it compare to successful similar ads?
- What are the strongest selling points and value propositions?

### For Risk Assessment:
- What creative elements might underperform?
- Are there brand safety or compliance concerns?
- Where might viewers drop off or lose interest?
- What has caused similar ads to fail?
- Are there messaging clarity or pacing issues?

### Personalized Recommendations:
Based on the user's profile:
- If they prioritize ROI → Focus on conversion-driving elements
- If they prioritize brand awareness → Focus on memorability and emotional resonance
- If they need quick decisions → Provide executive summary format
- If they're technical → Include detailed scene-by-scene breakdown

## The Decision Flow

After reviewing the AI analysis, the user makes a decision:

### 1. Approve the Ad
**What happens:**
- Ad is added to the live ads tracker
- Status: "Active"
- Begin tracking real performance metrics
- Available for future competitive analysis

**User feeling:** "The AI confirmed this ad has strong potential, I'm confident launching it."

### 2. Suspend the Ad
**What happens:**
- Ad is saved in a "pending" state
- User adds comments explaining what needs improvement
- Ad can be revised and resubmitted
- Status: "Suspended - Needs Revision"

**User feeling:** "The ad has potential but needs work. My team knows exactly what to fix."

### 3. Reject the Ad
**What happens:**
- Ad is archived with rejection reason
- User adds comments explaining why it doesn't meet standards
- Status: "Rejected"
- Serves as a learning example for future creative

**User feeling:** "The AI identified critical issues. Better to know now than waste budget on a failing ad."

## Database Integration

All decisions and analysis need to be tracked:

**Required data storage:**
- Video upload metadata (URL, upload time, user)
- Complete AI analysis results (all three steps)
- User decision (approve/suspend/reject)
- User comments and reasoning
- Status transitions and timestamps
- Performance metrics (for approved ads in live tracker)

**Key insight:** This creates a learning database - over time, we can correlate AI predictions with actual performance to improve our recommendations.

## The Bigger Picture: Why This Matters

This system solves a real problem in advertising: **too many decisions, not enough confidence.**

Marketing teams often:
- Spend thousands testing ads that were doomed to fail
- Miss opportunities by being too conservative
- Waste time in approval cycles arguing about subjective opinions
- Can't explain WHY an ad worked or failed

Our AI agent gives them:
- **Confidence:** Data-backed predictions before spending budget
- **Speed:** Fast analysis instead of weeks of testing
- **Learning:** Understanding patterns across their entire creative library
- **Alignment:** Objective insights that get teams on the same page

## Success Criteria

We'll know this is working when:
1. Users can upload an ad and get actionable insights within minutes
2. The analysis feels personalized to their role and needs
3. Predictions correlate with actual performance (approved ads do well, rejected ones would have failed)
4. Teams spend less time debating and more time creating better ads
5. The live tracker shows improving performance as the AI learns from data

## Technical Considerations (Not prescriptive, just context)

The system needs to:
- Handle video uploads efficiently
- Process analysis in reasonable time (ideally < 5 minutes)
- Store structured analysis data for rendering dashboards
- Support real-time updates to live tracker
- Scale as more ads and users are added

The technology choices should prioritize:
- Fast video analysis (Twelve Labs integration)
- Reliable AI reasoning (LLM for synthesis)
- Responsive user experience (no long waits)
- Data persistence (track decisions and outcomes)
