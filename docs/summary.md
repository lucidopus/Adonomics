# Adonomics: Creative Genome - Application Summary

## Overview

Adonomics: Creative Genome is an AI-powered analytics platform designed to help marketing teams understand why video advertisements work by analyzing their "emotional DNA." Built for the Advertising Week NY 2025 Hackathon's Creative Intelligence Lab challenge, it transforms subjective creative decisions into data-backed insights by dissecting video ads and correlating creative elements with performance metrics.

The application addresses the core problem where marketers rely on gut feeling and expensive A/B testing instead of understanding specific creative elements that drive results. It combines video content analysis with qualitative feedback and quantitative performance data to generate actionable recommendations.

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with custom design system
- **Framer Motion** - Animations and transitions
- **Lucide React** - Icon library
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - Server-side logic
- **MongoDB** - Database with Mongoose-like models
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication

### AI Services
- **Twelve Labs** - Video understanding and scene analysis
- **Groq** - Fast LLM inference for AI analysis
- **Twelvelabs-js** - SDK for video processing

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Tailwind CSS** - Utility-first CSS framework

## Features

### Core Functionality
1. **Video Upload & Analysis Pipeline**
   - Support for file uploads (MP4, MOV, AVI, etc.) and URL uploads
   - Real-time progress tracking with Server-Sent Events
   - Automatic video indexing and scene detection
   - Emotional arc mapping and content analysis

2. **AI-Powered Insights**
   - Scene-by-scene breakdown of video content
   - Emotional content detection and sentiment analysis
   - Object recognition and visual element identification
   - Performance correlation with creative elements
   - Personalized recommendations based on user role and goals

3. **Interactive Dashboards**
   - **Home Dashboard**: Upload interface with progress tracking
   - **Analysis Dashboard**: Detailed results with tabbed insights
   - **Gallery View**: Browse and manage all analyses with filtering
   - **Live Ads Dashboard**: Real-time campaign monitoring
   - **Video Search**: AI-powered semantic search across content

4. **User Experience**
   - **Authentication System**: Secure signup/login with JWT
   - **Onboarding Flow**: Personalized setup based on user preferences
   - **Responsive Design**: Mobile-first with dark/light theme support
   - **Real-time Updates**: Live data synchronization
   - **Modal Analysis**: Detailed analysis views with tabbed interface

### Advanced Features
- **User Profiling**: Personalized AI summaries based on role and goals
- **Competitive Intelligence**: Search for similar video content
- **Decision Workflow**: Approve, suspend, or reject advertisements
- **Performance Metrics**: Track views, engagement, conversions
- **Export Capabilities**: Shareable reports and insights

## How the App Works

### User Journey
1. **Registration & Onboarding**
   - User signs up and completes onboarding survey
   - Preferences collected for role, goals, technical comfort, etc.
   - Personalized dashboard experience

2. **Video Upload**
   - User uploads video file or provides URL
   - Video sent to Twelve Labs for indexing
   - Real-time progress shown via SSE

3. **AI Analysis Pipeline**
   - **Phase 1**: Video understanding (Twelve Labs)
     - Scene detection, object recognition, emotional analysis
   - **Phase 2**: User personalization (AI agent)
     - Generate profile summary based on preferences
   - **Phase 3**: Competitive search (semantic search)
     - Find similar ads and content
   - **Phase 4**: Synthesis (AI correlation)
     - Cross-reference video elements with performance data
   - **Phase 5**: Recommendations (LLM generation)
     - Generate actionable creative insights

4. **Results & Decision**
   - Interactive dashboard shows analysis results
   - User can approve, suspend, or reject the advertisement
   - Comments and reasoning captured for workflow

5. **Gallery & History**
   - All analyses stored and searchable
   - Comparative analysis across multiple videos
   - Performance tracking over time

### Technical Flow
- **Frontend**: React components handle UI and user interactions
- **API Layer**: Next.js routes process requests and orchestrate AI services
- **Database**: MongoDB stores users, preferences, and advertisement data
- **AI Integration**: Twelve Labs for video analysis, Groq for text generation
- **File Storage**: Supabase Storage for video files and generated content

## Key Components

### Authentication Components
- `LoginForm.tsx` - User login interface
- `SignupForm.tsx` - User registration
- `OnboardingFlow.tsx` - Multi-step preference collection

### Dashboard Components
- `HomeDashboard.tsx` - Main upload and analysis interface
- `AnalysisDashboard.tsx` - Results visualization with tabs
- `Gallery.tsx` - Analysis history with grid/list views
- `LiveAdsDashboard.tsx` - Real-time campaign monitoring
- `VideoAnalysis.tsx` - Direct video analysis interface

### UI Components
- `Button.tsx` - Custom button component
- `Card.tsx` - Content container
- `Input.tsx` - Form input fields
- `Tabs.tsx` - Tabbed interface
- `ThemeToggle.tsx` - Dark/light mode switcher

### Utility Components
- `AnalysisModal.tsx` - Detailed analysis popup
- `VideoSearch.tsx` - Semantic search interface

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout

### Advertisements
- `GET /api/advertisements` - List user advertisements
- `POST /api/advertisements` - Upload and process video
- `GET /api/advertisements/[id]` - Get specific advertisement
- `PATCH /api/advertisements/[id]` - Update advertisement status/decision
- `POST /api/advertisements/upload-progress` - Stream upload progress

### Analysis
- `POST /api/analyze-video` - Direct video analysis (gist, summary, custom)
- `POST /api/analyze-advertisement` - Full advertisement analysis pipeline
- `POST /api/search-videos` - Find similar video content
- `POST /api/test-video-ready` - Check video processing status

### User Management
- `GET /api/preferences` - Get user preferences
- `GET /api/user-profile` - Generate personalized AI summaries

## Database Models

### User Model
- `_id`: ObjectId
- `email`: string (unique)
- `password`: string (hashed)
- `createdAt`: Date
- `updatedAt`: Date

### UserPreferences Model
- `_id`: ObjectId
- `user_id`: ObjectId
- `current_step`: number (onboarding progress)
- `onboarding_completed`: boolean
- `role`: UserRole (marketing_brand_manager, creative_director_designer, etc.)
- `primary_goals`: PrimaryGoal[] (maximize_roi_conversions, etc.)
- `decision_factors`: DecisionFactor[] (performance_predictions, etc.)
- `technical_comfort`: TechnicalComfort (high_level_summary, etc.)
- `campaign_types`: CampaignType[] (brand_awareness, etc.)
- `platforms`: Platform[] (meta_facebook_instagram, tiktok, etc.)
- `insight_timing`: InsightTiming[] (pre_production, etc.)
- `result_speed`: ResultSpeed (real_time, etc.)
- `team_members`: TeamMember[] (just_me, creative_team, etc.)
- `sharing_formats`: SharingFormat[] (dashboard_screenshots, etc.)
- `pain_points`: PainPoint[] (too_much_data_insights, etc.)

### Advertisement Model
- `_id`: ObjectId
- `user_id`: ObjectId
- `video_url`: string | undefined
- `video_filename`: string | undefined
- `video_file_size`: number | undefined
- `twelve_labs_index_id`: string | undefined
- `twelve_labs_task_id`: string | undefined
- `twelve_labs_video_id`: string | undefined
- `status`: AdvertisementStatus (upload, analyzing, analyzed, approved, suspended, rejected)
- `status_history`: Status change log
- `analysis_results`: AnalysisResults (video_analysis, user_profile, competitive_search, synthesis)
- `decision`: Decision (type, comments, reasoning, decided_at, decided_by)
- `metrics`: PerformanceMetrics (views, engagement, conversions, etc.)
- `title`: string | undefined
- `description`: string | undefined
- `tags`: string[]
- `created_at`: Date
- `updated_at`: Date
- `uploaded_at`: Date
- `analyzed_at`: Date | undefined
- `decided_at`: Date | undefined

## Architecture

### Project Structure
```
adonomics-creative-genome/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication routes
│   ├── (dashboard)/              # Protected dashboard routes
│   ├── api/                      # API endpoints
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # React components
├── lib/                          # Utility libraries
│   ├── auth/                     # Authentication helpers
│   ├── mongodb/                  # Database models and client
│   ├── ai-agent.ts               # AI agent logic
│   ├── prompts.ts                # AI prompts and templates
│   ├── twelve-labs.ts            # Twelve Labs integration
│   └── user-profile-summary.ts   # User profiling
├── types/                        # TypeScript type definitions
├── docs/                         # Documentation and planning
└── public/                       # Static assets
```

### Key Libraries
- **ai-agent.ts**: Orchestrates AI analysis pipeline
- **prompts.ts**: Contains AI prompt templates for different analysis types
- **twelve-labs.ts**: Handles video processing integration
- **user-profile-summary.ts**: Generates personalized user insights

### Security & Best Practices
- JWT authentication with secure password hashing
- Input validation and error handling
- TypeScript for type safety
- Environment variable configuration
- Proper error boundaries and loading states

## Target Audience & Business Impact

### Primary Users
- **Marketing/Brand Managers**: Focus on ROI and brand awareness
- **Creative Directors/Designers**: Emphasize emotional impact
- **Media Buyers**: Optimize for conversions and cost efficiency
- **Data Analysts**: Deep dive into metrics and analysis
- **Agency Account Managers**: Client-facing insights
- **C-Suite Executives**: Strategic overview and business impact

### Business Value
- Reduces creative testing costs by providing data-driven insights
- Accelerates approval cycles with objective analysis
- Improves campaign performance through specific recommendations
- Enables better team alignment on creative decisions
- Provides competitive advantage through AI-powered analysis

## Development & Deployment

### Getting Started
1. Install dependencies: `npm install`
2. Set up environment variables (MongoDB URI, API keys)
3. Run development server: `npm run dev`
4. Build for production: `npm run build`

### Environment Requirements
- Node.js 18+
- MongoDB (local or cloud)
- Twelve Labs API key
- Groq API key (optional)
- JWT secret

### Deployment
- Optimized for Vercel, Netlify, or Node.js hosting
- Cloud database (MongoDB Atlas recommended)
- Static asset hosting for videos and generated content

This comprehensive platform transforms how marketing teams approach creative decision-making, moving from subjective opinions to AI-powered, data-driven insights that can be deployed at enterprise scale.