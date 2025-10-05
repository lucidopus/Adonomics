# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Adonomics is an AI-powered Creative Genome Performance Insights Dashboard that analyzes video ad creatives to provide data-backed insights into their performance. The system dissects video ads to understand their "emotional DNA" by analyzing scenes for emotional arcs, objects, and pacing, then correlating these elements with performance metrics (persuasion, conversion rates, CTR).

**Target**: Generative AI in Advertising Hackathon - "The Creative Intelligence Lab" challenge

## System Architecture

### Core Technologies
- **Frontend**: Next.js (React)
- **Backend**: Next.js API Routes
- **Database**: MongoDB (data storage)
- **Storage**: Supabase Storage (video files only)
- **Video Analysis**: Twelve Labs API
- **AI/LLM**: Amazon Bedrock (qualitative analysis, synthesis)
- **Voice**: ElevenLabs API

### Processing Pipeline

The system processes video analysis directly within Next.js API routes:

1. **Video Upload & Analysis**
   - Videos uploaded to Supabase Storage
   - Twelve Labs API analyzes video content for scene detection, objects, emotional content
   - Analysis results stored in MongoDB

2. **AI-Powered Insights**
   - Extracted insights sent to Amazon Bedrock for qualitative analysis
   - Synthesizes creative recommendations based on video analysis
   - Generates audio narration via ElevenLabs
   - Complete report stored in MongoDB

### API Routes
- `POST /api/analyze` - Upload video, performs analysis
- `GET /api/reports` - List all reports
- `GET /api/reports/{id}` - Fetch specific report

### Database Schema (MongoDB)
`reports` collection with documents containing: _id, status, created_at, video_url, video_analysis (object), qualitative_summary (object), recommendations (string), report_audio_url (string)

## Critical Development Rules

### UI Development Rules

All UI code **MUST** follow the comprehensive design system in `docs/dev_rules/ui_rules.md`:

- **Color System**: OKLCH color space with semantic variables, full dark mode support
- **Typography**: Geist Sans/Inter font stack with defined type scale (text-xs to text-6xl)
- **Spacing**: Consistent spacing scale (0.5rem to 10rem)
- **Components**: Standardized button variants/sizes, card structure, input styling
- **Animations**: Defined timing functions (100ms-1200ms), fade/scale/slide variants, stagger patterns
- **Responsive**: Mobile-first approach with defined breakpoints (sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px)
- **Visual Effects**: Glass morphism, gradient overlays, shadow system
- **Accessibility**: WCAG AA compliance, focus management, semantic HTML, ARIA attributes

### Code Style

- **Naming**: PascalCase for components, camelCase for functions/variables, UPPER_SNAKE_CASE for constants
- **TypeScript**: Strict mode, interfaces for API responses/props, prefer union types over enums
- **Imports**: Absolute imports with path aliases (`@/components/...`), grouped by category
- **Error Handling**: Try/catch for async operations, error boundaries for React, meaningful error messages

### AI Interaction Protocol

To ensure clarity and minimize the gap between AI-generated code and developer understanding:

1. **Folder Exploration**: When exploring a new folder, always read the available `README.md` file first, if it exists, to understand the context of the folder.

2. **Code Comments**: Add relevant comments to any code generated. Comments should be short and precise, providing just enough information about the code's purpose, logic, and how it uses third-party tools or SDKs, without making the codebase messy.

3. **Pull Request-Style Reporting**: After every task completion, generate a short summary formatted like a pull request description:

   **Title**: A concise, one-line summary of the completed task

   **Description**:
   - **The Plan**: High-level steps intended to accomplish the requested task
   - **The Approach**: Reasoning and methodology behind the chosen solution, explaining why this specific implementation was chosen over alternatives
   - **The Action**: Clear log of concrete changes made, listing all created or modified files and summarizing key code changes for each

## Development Workflow

- Use conventional commits (feat:, fix:, docs:, etc.)
- Focus commit messages on "why" not "what"
- Keep PRs focused on single features
- Run lint/typecheck before committing

## Important Notes

- **MongoDB is used for data storage**, Supabase Storage is only for video files
- **No database operations** without explicit approval
- **Prefer editing existing files** over creating new ones
- **Never proactively create documentation files** unless explicitly requested
- When exploring new folders, read README.md first if it exists
