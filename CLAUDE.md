# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Adonomics is an AI-powered Creative Genome Performance Insights Dashboard that analyzes video ad creatives to provide data-backed insights into their performance. The system dissects video ads to understand their "emotional DNA" by analyzing scenes for emotional arcs, objects, and pacing, then correlating these elements with performance metrics (persuasion, conversion rates, CTR).

**Target**: Generative AI in Advertising Hackathon - "The Creative Intelligence Lab" challenge

## System Architecture

### Core Technologies
- **Frontend**: Next.js (React)
- **Backend**: Next.js API Routes
- **Task Orchestration**: Trigger.dev v4 (self-hosted)
- **Database**: Supabase (Postgres)
- **Storage**: Supabase Storage
- **Video Analysis**: Twelve Labs API
- **AI/LLM**: Amazon Bedrock (qualitative analysis, synthesis)
- **Voice**: ElevenLabs API
### Processing Pipeline

The system uses trigger.dev to orchestrate a multi-step analysis pipeline:

1. **analysis-pipeline** (main task) - triggered from Next.js API
   - Runs `video-analysis` task
   - Analyzes video content using Twelve Labs API for scene detection, objects, emotional content
   - Upon completion, triggers `qualitative-analysis` (sends extracted insights to Bedrock)

2. **aggregate-and-report** (final task)
   - Gathers all outputs (Twelve Labs video analysis, AI-generated insights)
   - Synthesizes final creative recommendations via Bedrock
   - Generates audio narration via ElevenLabs
   - Stores complete report in Supabase

### API Routes
- `POST /api/analyze` - Upload video, triggers pipeline
- `GET /api/reports` - List all reports
- `GET /api/reports/{id}` - Fetch specific report

### Database Schema
Single `reports` table with columns: id, status, created_at, video_url, video_analysis (JSONB), qualitative_summary (JSONB), recommendations (TEXT), report_audio_url (TEXT)

## Critical Development Rules

### Trigger.dev v4 Requirements

**ALWAYS** follow these patterns when writing trigger.dev tasks:

```typescript
// ✅ CORRECT - v4 pattern
import { task } from "@trigger.dev/sdk";

export const myTask = task({
  id: "unique-task-id",
  run: async (payload: { data: string }) => {
    // All task logic goes here
  },
});
```

**NEVER** use these deprecated patterns:
```typescript
// ❌ WRONG - v3 or deprecated
import { task } from "@trigger.dev/sdk/v3";
client.defineJob({ ... });
```

**Key Requirements**:
- Import from `@trigger.dev/sdk` only (NOT `/v3`)
- Export every task (no unexported tasks)
- Use unique `id` for each task
- Use `logger` from SDK for logging
- All executable code must be inside `task({ run: ... })`
- Use self-hosted instance - set `TRIGGER_API_URL` environment variable
- Follow docs/dev_rules/trigger_rules.md for complete guidelines

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

- **No Supabase DB reset** without explicit approval
- **Prefer editing existing files** over creating new ones
- **Never proactively create documentation files** unless explicitly requested
- When exploring new folders, read README.md first if it exists
