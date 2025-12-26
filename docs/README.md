# Memrys Documentation

Welcome to the Memrys technical knowledge base. This documentation is designed for developers to understand the core logic and architecture of the application.

## Structure

- [**Business Rules**](./business-rules/overview.md): The "source of truth" for how the app behaves (handshakes, deletion protocols, media limits).
- [**Architecture**](./architecture/system-design.md): How the codebase is organized, technology choices, and data flow.
- [**Deployment**](../README.md#deploy-on-vercel): Technical setup for Vercel and Render.

## Quick Start for New Devs

1.  **Clone & Install**: `npm install`
2.  **Environment**: Copy `.env.example` to `.env.local` and add Supabase keys.
3.  **Local Dev**: `npm run dev`
4.  **Database**: Apply latest migrations from `supabase/migrations` via the Supabase SQL Editor.
