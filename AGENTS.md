# Adonomics: Creative Genome - Agent Guidelines

## Build & Test Commands
- **Install dependencies**: `npm install` (when package.json exists)
- **Development server**: `npm run dev` (when scripts are added)
- **Build**: `npm run build` (when build script exists)
- **Lint**: `npm run lint` (when linting is configured)
- **Type check**: `npm run typecheck` (when TypeScript is used)
- **Run single test**: `npm test -- --testNamePattern="test name"` (when testing framework is set up)

## Code Style Guidelines

### Imports & Structure
- Use absolute imports with path aliases (e.g., `@/components/Button`)
- Group imports: React, third-party libraries, internal modules
- Sort imports alphabetically within groups

### Naming Conventions
- **Components**: PascalCase (e.g., `VideoAnalysisCard`)
- **Functions**: camelCase (e.g., `analyzeVideoScenes`)
- **Variables**: camelCase (e.g., `videoData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Files**: kebab-case for components, camelCase for utilities

### TypeScript & Types
- Use strict TypeScript configuration
- Define interfaces for API responses and component props
- Prefer union types over enums for better tree-shaking
- Use `unknown` over `any` for untyped data

### Error Handling
- Use try/catch for async operations
- Implement proper error boundaries for React components
- Log errors with context, avoid exposing sensitive data
- Return meaningful error messages to users

### UI Development
- Follow `docs/dev_rules/ui_rules.md` for all UI components
- Use OKLCH color space with semantic color variables
- Implement mobile-first responsive design
- Ensure WCAG AA accessibility compliance
- Use Tailwind CSS utilities with component classes sparingly

### Performance
- Implement lazy loading for video components
- Use React.memo for expensive re-renders
- Optimize bundle size with tree shaking
- Add loading states and skeleton screens

### Git Workflow
- Use conventional commits (feat:, fix:, docs:, etc.)
- Write descriptive commit messages focusing on "why" not "what"
- Keep PRs focused on single features
- Run lint/typecheck before committing