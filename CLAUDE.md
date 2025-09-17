# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Key Commands

### Development
```bash
pnpm dev               # Start Next.js dev server with Turbo
pnpm dev --turbo       # Explicitly use Turbo mode
```

### Build & Production
```bash
pnpm build             # Run database migrations and build Next.js app
pnpm start             # Start production server
```

### Code Quality
```bash
pnpm lint              # Run Biome linter with auto-fix (unsafe)
pnpm lint:fix          # Run linter and formatter with auto-fix
pnpm format            # Format code with Biome
```

### Database Management
```bash
pnpm db:generate       # Generate Drizzle migrations
pnpm db:migrate        # Run database migrations
pnpm db:studio         # Open Drizzle Studio GUI
pnpm db:push           # Push schema changes directly to database
pnpm db:pull           # Pull schema from database
```

### Testing
```bash
pnpm test              # Run Playwright tests
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router and React Server Components
- **AI**: Vercel AI SDK with xAI models (grok-2-vision-1212, grok-3-mini) via Vercel AI Gateway
- **Database**: Neon Serverless Postgres with Drizzle ORM
- **Authentication**: Auth.js (NextAuth v5 beta)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Code Quality**: Biome for linting/formatting

### Project Structure

#### Core Directories
- `/app` - Next.js App Router pages and API routes
  - `/(auth)` - Authentication flows, onboarding, user profile
  - `/(chat)` - Main chat interface and chat-related APIs
  - `/api` - API endpoints for chat, documents, files, etc.

- `/components` - React components
  - `/ui` - shadcn/ui base components
  - `/onboarding` - Multi-step onboarding screens
  - `/profile` - User profile components
  - `/citations` - Citation and source handling
  - `/jobs` - Job search and display components
  - `/elements` - Chat message elements (code blocks, tools, etc.)

- `/lib` - Core business logic
  - `/ai` - AI models, tools, prompts, and entitlements
  - `/db` - Database schema, migrations, queries
  - `/editor` - ProseMirror editor configuration
  - `/resume` - Resume parsing and processing

### Key Patterns

#### AI Tools System
Tools are defined in `/lib/ai/tools/` and include:
- `web-search.ts` - Web search integration
- `create-document.ts` - Document creation
- `update-document.ts` - Document updates
- `get-weather.ts` - Weather data fetching
- `request-suggestions.ts` - Suggestion generation

#### Database Schema
Primary tables (defined in `/lib/db/schema.ts`):
- `User` - User accounts with onboarding data and resume
- `Chat` - Chat conversations
- `Message` - Chat messages with tool invocations
- `Document` - Created documents/artifacts
- `Suggestion` - Chat suggestions
- `Vote` - Message voting

#### Authentication Flow
- Guest access supported via `/api/auth/guest`
- Full authentication with email/password
- Onboarding flow captures user profile, values, goals, and resume

#### State Management
- Uses React Server Components for server-side data fetching
- Client components use AI SDK hooks (`useChat`, `useActions`)
- Data streaming via Server-Sent Events for real-time updates

### Development Notes

#### Environment Variables
Required variables are defined in `.env.local`:
- `POSTGRES_URL` - Neon database connection
- `AI_GATEWAY_API_KEY` - For non-Vercel deployments
- `AUTH_SECRET` - Auth.js secret
- Various API keys for AI providers

#### Code Style
- Biome configuration in `biome.jsonc`
- 2-space indentation
- Single quotes for JS/TS
- Double quotes for JSX attributes
- Trailing commas enforced
- Tailwind class sorting enabled

#### Testing Strategy
- Playwright for E2E testing
- Test files in `/tests` directory
- Run with `pnpm test`