# Business Rules

This document outlines the core logic and constraints that govern the Memrys application.

## 1. Partnership Handshake
Memrys is built on the concept of private, dual-partner spaces.
- **Invitation**: User A invites User B via Email or User ID.
- **State**: The partnership is `pending` until User B accepts.
- **Isolation**: Each partnership is a separate "bucket" of data. User A cannot see Partner B’s feed with Partner C.

## 2. Shared Feed & Content
- **Dual-Feed**: Displays content (photos/videos) shared within a specific partnership.
- **Media Constraints**:
  - **Photos**: Must be compressed client-side via the Canvas API before upload.
  - **Videos**: Limited to **30 seconds**. A mandatory front-end trimming step is required before upload.

## 3. Mutual-Consent Deletion Protocol
Data deletion requires agreement from both partners to prevent unilateral data loss.
- **Request**: If a user requests deletion of a post, it enters a **24-hour "Read-Only" window**.
- **Mutual Consent**: The other partner must confirm the deletion during this window.
- **Cool Down**: If the request is rejected, the post enters a **12-hour "Cool Down" period** before another request can be made.

## 4. Daily Memories (AI)
- **Generation**: A Supabase Edge Function runs every 24 hours.
- **Logic**: It selects a random post from the partnership and uses the **OpenRouter API** to generate a "quirky message" or memory caption.
- **Personality**: The AI merges a "Master Tone" (default) with a "User-Defined Raw Text Personality."

## 5. Security & Isolation
- **RLS**: PostgreSQL Row Level Security is the primary enforcement mechanism for data isolation.
- **Encryption**: All media is stored in Supabase Storage with partnership-level access controls.
