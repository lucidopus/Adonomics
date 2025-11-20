# Adonomics: Creative Genome

An AI-powered dashboard that analyzes video ads to explain *why* they work, not just *what* happened. Built for the Advertising Week NY 2025 Hackathon - Creative Intelligence Lab challenge.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.20.0-green)](https://www.mongodb.com/)
[![Twelve Labs](https://img.shields.io/badge/Twelve%20Labs-AI-orange)](https://twelvelabs.io/)

## 🎯 The Problem

Marketers and creative teams often make subjective decisions about ad creative, leading to inefficient A/B testing and wasted ad spend. It's difficult to pinpoint the exact creative elements—a specific scene, an emotional tone, a piece of music—that drive campaign performance and brand lift.

## 🚀 Our Solution

The Creative Genome project is an AI-powered dashboard that turns subjective creative decisions into data-backed guidance. It dissects video ads to map their "emotional DNA," providing actionable insights to optimize creative strategy.

The tool works by:
1. Breaking down each video ad into its constituent scenes
2. Analyzing each scene for emotional arcs, objects, and pacing using advanced Video AI
3. Cross-referencing this analysis with performance data and user feedback
4. Surfacing insights that show which creative elements are driving results

This allows marketers to move beyond blind A/B tests and understand the "so what" behind their ad performance.

## ✨ Key Features

### 🎬 Video Analysis Pipeline
- **Scene-by-Scene Analysis:** Deconstructs video ads to understand their structure and content
- **Emotional Arc Mapping:** Labels the tone and sentiment of each scene to build an emotional journey
- **Object & Context Detection:** Identifies visual elements, branding, and storytelling components
- **Performance Correlation:** Links creative elements to business outcomes and KPIs

### 📊 Interactive Dashboards
- **Home Dashboard:** Personalized insights based on user preferences and role
- **Live Ads Tracker:** Real-time monitoring of active campaigns with performance metrics
- **Gallery View:** Browse and manage all analysis reports with filtering and search
- **Video Search:** Find similar videos and content using AI-powered semantic search
- **Creative Insights:** AI-powered analysis of video content with actionable recommendations
- **Profile Management:** User preference settings and personalized AI summaries

### 🔐 User Experience
- **Authentication System:** Secure signup/login with JWT tokens
- **Onboarding Flow:** Personalized setup based on user role and goals
- **Responsive Design:** Mobile-first UI with dark/light theme support
- **Real-time Updates:** Live data synchronization and status tracking
- **Analysis Gallery:** Visual gallery of all analysis reports with status indicators
- **Video Search:** Semantic search across video content and analysis results
- **Modal Analysis:** Detailed analysis views with tabbed interface for different insights

## 🏗️ Architecture

### Tech Stack
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, MongoDB
- **AI Services:** Twelve Labs (Video Analysis), Groq (LLM)
- **Authentication:** JWT with bcrypt hashing
- **Styling:** Tailwind CSS with custom design system
- **Animations:** Framer Motion for smooth transitions
- **Icons:** Lucide React for consistent iconography
- **Charts:** Recharts for data visualization

### Database Models
- **User:** Authentication and profile data
- **UserPreferences:** Onboarding and personalization settings
- **Advertisement:** Video ad metadata and analysis results

### API Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/analyze-video` - Video content analysis
- `POST /api/analyze-advertisement` - Advertisement analysis with AI insights
- `POST /api/search-videos` - Find similar video content
- `POST /api/test-video-ready` - Check if video is ready for analysis
- `GET /api/advertisements` - List user advertisements
- `GET /api/advertisements/[id]` - Get specific advertisement details
- `PATCH /api/advertisements/[id]` - Update advertisement status/decision
- `POST /api/advertisements/upload-progress` - Stream upload progress for videos
- `GET /api/preferences` - User preference management
- `GET /api/user-profile` - Generate personalized summaries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud instance)
- Twelve Labs API key
- Groq API key (optional, for enhanced AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd adonomics-creative-genome
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/adonomics
   TWELVE_LABS_API_KEY=your_twelve_labs_api_key
   GROQ_API_KEY=your_groq_api_key
   JWT_SECRET=your_jwt_secret_key
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. **Database Setup**
   The application will automatically create collections when first run.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
adonomics-creative-genome/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── onboarding/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   └── dashboard/
│   ├── api/                      # API endpoints
│   │   ├── advertisements/
│   │   │   ├── [id]/
│   │   │   └── upload-progress/
│   │   ├── analyze-advertisement/
│   │   ├── analyze-video/
│   │   ├── auth/
│   │   ├── preferences/
│   │   ├── search-videos/
│   │   ├── test-video-ready/
│   │   └── user-profile/
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   ├── onboarding/               # Onboarding flow components
│   ├── ui/                       # Reusable UI components
│   ├── AnalysisDashboard.tsx     # Analysis visualization
│   ├── AnalysisModal.tsx         # Analysis results modal
│   ├── Gallery.tsx               # Analysis reports gallery
│   ├── HomeDashboard.tsx         # Main dashboard
│   ├── LiveAdsDashboard.tsx      # Live ads tracking
│   ├── VideoAnalysis.tsx         # Video analysis interface
│   └── VideoSearch.tsx           # Video search functionality
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

## 🎯 Target Audience

This tool is designed for the B2B marketing analytics space, including:
- **Advertisers & Agencies:** Mid-to-large brands and their creative partners
- **Marketing Leaders:** CMOs and Creative Directors needing ROI justification
- **Media Strategists:** Teams refining creative strategy with data
- **Brand Managers:** Professionals optimizing campaign performance

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Code Style Guidelines
- **Imports:** Absolute imports with `@/` alias
- **Components:** PascalCase naming, functional components with hooks
- **Styling:** Tailwind CSS utilities with semantic color variables
- **Types:** Strict TypeScript with interface definitions
- **Error Handling:** Try/catch blocks with meaningful error messages

### Testing
Run the test suite:
```bash
npm test
```

### Deployment
The application is optimized for deployment on Vercel, Netlify, or any Node.js hosting platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Twelve Labs** for video AI capabilities
- **Groq** for fast LLM inference
- **Advertising Week NY** for the hackathon opportunity
- **Swayable** for creative testing insights
- **Betaworks** for hosting and support

---

Built with ❤️ for Advertising Week NY 2025 Hackathon
