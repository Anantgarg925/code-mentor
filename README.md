# CodeMentor - AI Coding Mentor Dashboard

A personal AI coding mentor and 3.5-month placement preparation system. Tracks DSA progress, weak points, and provides AI-powered mentoring.

## Features

- **Dashboard** - Overview with stats, pattern mastery, revision queue, today's tasks
- **DSA Tracker** - Problem management with filters, charts, and detailed notes
- **AI Mentor** - Chat with an AI that knows your exact DSA progress, weak points, AND full Rakshak project knowledge (architecture, tech stack, features, ML model, user flow)
- **Daily Planner** - Auto-generated daily tasks based on progress gaps
- **3.5 Month Roadmap** - Phased placement preparation timeline
- **Rakshak Board** - Kanban project management for the Rakshak app
- **Core Subjects** - Track OOP, OS, DB, Networks, System Design progress

## Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS + shadcn/ui + Framer Motion
- **Backend**: Hono + Bun + Prisma (SQLite)
- **AI**: OpenAI API (GPT-4o-mini) for the mentor chat
- **State**: TanStack Query (React Query)

## Pre-populated Data

The app comes seeded with the user's actual DSA progress:
- 12 solved problems across 6 patterns (HashMap, SlidingWindow, Stack, Heap, PrefixSum, Greedy)
- Specific weak points per problem
- 8-day streak, 14h weekly study time
- Rakshak project tasks
- Core CS subject topics

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/dashboard | Aggregate dashboard data |
| GET/POST | /api/problems | DSA problems CRUD |
| PUT/DELETE | /api/problems/:id | Update/delete problem |
| GET | /api/chat/history | Chat conversation history |
| POST | /api/chat | Send message to AI mentor |
| GET/POST | /api/tasks | Daily tasks CRUD |
| POST | /api/tasks/generate | Auto-generate daily plan |
| GET/POST | /api/rakshak | Rakshak board CRUD |
| PUT/DELETE | /api/rakshak/:id | Update/delete rakshak task |
| GET | /api/subjects | Core subjects (grouped) |
| PUT | /api/subjects/:id | Update subject topic |
| GET/PUT | /api/stats | User stats |

## Environment Variables

- `OPENAI_API_KEY` - Required for AI Mentor chat (set via ENV tab)
