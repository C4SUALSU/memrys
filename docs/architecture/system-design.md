# Architecture & System Design

This document describes the technical architecture of the Memrys application.

## 1. Technology Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL + RLS)
- **Auth**: Supabase SSR (Magic Links/OTP)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Integration**: [OpenRouter API](https://openrouter.ai/) (via Supabase Edge Functions)

## 2. Directory Structure

```text
/src
  /app          # Next.js App Router (Pages, Layouts, API Routes)
  /lib
    /actions    # Server Actions for data mutations (post, chat, calendar)
    /supabase   # Supabase client/server initializers
    /utils      # Helper functions (compression, cropping)
  /types        # Shared TypeScript interfaces
/supabase
  /migrations   # Database schema and RLS policies
  /functions    # Edge Functions (Daily Memory generator)
/public         # Static assets
/docs           # Technical knowledge base
```

## 3. Data Flow & Patterns

### Auth Protection
Authentication is handled via `src/middleware.ts`. Protected routes redirect unauthenticated users to `/login`.

### Server-Side Data Fetching
Pages in `/app` are Server Components by default. They fetch data using the Supabase server client from `@/lib/supabase/server`.

### Mutations (Server Actions)
Instead of dedicated API endpoints, the app uses **Server Actions** located in `@/lib/actions`. This provides type-safety from the UI to the database.

### Real-time Communication
Chat messages leverages Supabase **Realtime** subscriptions to provide an instant messaging experience without a custom WebSocket server.

## 4. Database & Scaling
- **RLS (Row Level Security)**: Every table has RLS policies enabled. Access is restricted based on the `partnership_id` and the user's active session.
- **Migrations**: All schema changes must be documented in `supabase/migrations` to ensure environment consistency.
