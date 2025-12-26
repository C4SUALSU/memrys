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

## 4. Hosting: Web Service vs. Static Site

Memrys is currently designed as a **Dynamic Application**, which is why a **Web Service** (with a Node.js server) is recommended.

### Comparison Table

| Feature | Static Site (`output: export`) | Web Service (`next start`) |
| :--- | :--- | :--- |
| **Auth Type** | Client-side only | Server-side (SSR) & Client-side |
| **Middleware** | ❌ Not supported | ✅ Required for Memrys (Route protection) |
| **Server Actions** | ❌ Not supported | ✅ Recommended for Memrys (Mutations) |
| **SSR / ISR** | ❌ No server-side logic | ✅ Full support for faster initial loads |
| **Image Opt** | ❌ Needs `unoptimized` | ✅ Automatic optimization |
| **Cost** | 🆓 Usually Free (Render Static) | 💰 Paid (Render Web Service) |

### Why Memrys uses a Web Service:
1.  **Middleware Security**: We use `src/middleware.ts` to check if you are logged in *before* the page even loads. In a static site, the page loads first, and then Javascript checks if you are logged in (causing a visible "flicker").
2.  **Server Actions**: Your logic for handling Handshakes and Deletion Protocols is buried in Server Actions. These require a Node.js server to run.
3.  **Supabase Auth (SSR)**: The `@supabase/ssr` package is designed to exchange session cookies securely. This is significantly more secure and robust than the client-only `supabase-js` approach.

### If you want to use a Static Site anyway:
1.  **Re-write Logic**: You must move all logic from `src/lib/actions` into client-side `useEffect` hooks and use the browser-only Supabase client.
2.  **Remove Middleware**: Delete `src/middleware.ts` and manually add auth-check components to every single page.
3.  **Config**: Restore the `output: 'export'` and `unoptimized: true` settings in `next.config.ts`.

## 5. Database & Scaling
- **RLS (Row Level Security)**: Every table has RLS policies enabled. Access is restricted based on the `partnership_id` and the user's active session.
- **Migrations**: All schema changes must be documented in `supabase/migrations` to ensure environment consistency.
