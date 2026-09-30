# Supabase Data Contracts & Admin Routing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Establish clean separation between the Neon Nocturne visual system and content data by integrating Supabase data contracts, removing all invented content/fake oscillators/admin triggers from the public page, and routing `/admin/*` to a dedicated whitelist-authenticated console.

**Architecture:** 
1. Install `@supabase/supabase-js` and create `src/lib/supabase.ts` with a resilient fallback mechanism that serves seed data strictly matching the PRD schema when Supabase environment variables are not yet configured by the user.
2. Create `supabase/schema.sql` containing the exact PostgreSQL schema, RLS policies, and seed rows for `events`, `ticket_tiers`, `artists`, `announcements`, and `admin_whitelist`.
3. Align `src/types/index.ts` with the exact PRD database schema (removing all invented fields like `soundType`, `bpm`, alcohol perks).
4. Refactor the public landing page (`/`) to be 100% attendee-focused (zero admin triggers, zero keyboard shortcuts, real audio playback for `audio_preview_url`).
5. Route `/admin/*` to a separate, dedicated back-office view (`/admin/login` and `/admin/dashboard`) backed by the `admin_whitelist` security gate.

**Tech Stack:** React 18, TypeScript (`.tsx`), Vite, `@supabase/supabase-js`, Lucide Icons, Pure CSS (Neon Nocturne Design System).

---

### Task 1: Install `@supabase/supabase-js` & Define PRD Schema File

**Files:**
- Create: `supabase/schema.sql`
- Create: `src/lib/supabase.ts`
- Modify: `package.json`

**Step 1: Install `@supabase/supabase-js` dependency**
Run: `npm install @supabase/supabase-js`

**Step 2: Create `supabase/schema.sql` matching PRD Section 6**
Includes tables:
- `admin_whitelist` (`id`, `email`, `full_name`, `role`, `is_active`, `created_at`)
- `events` (`id`, `slug`, `title`, `tagline`, `description`, `start_date`, `end_date`, `venue_name`, `venue_city`, `hero_video_url`, `hero_poster_url`, `is_active`, `created_at`)
- `ticket_tiers` (`id`, `event_id`, `name`, `price`, `perks`, `status`, `ticket_url`, `badge_label`, `sort_order`)
- `artists` (`id`, `event_id`, `name`, `day_label`, `stage_name`, `performance_time`, `image_url`, `audio_preview_url`, `sort_order`)
- `announcements` (`id`, `event_id`, `message`, `is_enabled`, `badge_text`)
- RLS Policies and `is_admin()` security definer function.
- Official seed data based on the PRD specification.

**Step 3: Create `src/lib/supabase.ts`**
- Initialize `createClient(supabaseUrl, supabaseAnonKey)`.
- If env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are missing, gracefully fall back to in-memory PRD seed repository without breaking or crashing the app.

---

### Task 2: Align Data Types Strictly to PRD Contract

**Files:**
- Modify: `src/types/index.ts`

**Step 1: Replace all invented attributes with PRD schema types**
- `Event`:
  - `id`: string
  - `slug`: string
  - `title`: string
  - `tagline`: string
  - `description`: string
  - `start_date`: string
  - `end_date`: string
  - `venue_name`: string
  - `venue_city`: string
  - `hero_video_url`: string | null
  - `hero_poster_url`: string
  - `is_active`: boolean
- `TicketTier`:
  - `id`: string
  - `event_id`: string
  - `name`: string
  - `price`: number
  - `perks`: string[]
  - `status`: 'active' | 'sold_out' | 'hidden'
  - `ticket_url`: string
  - `badge_label`: string | null
  - `sort_order`: number
- `Artist`:
  - `id`: string
  - `event_id`: string
  - `name`: string
  - `day_label`: string
  - `stage_name`: string
  - `performance_time`: string
  - `image_url`: string
  - `audio_preview_url`: string | null
  - `sort_order`: number
- `Announcement`:
  - `id`: string
  - `event_id`: string
  - `message`: string
  - `is_enabled`: boolean
  - `badge_text`: string
- `AdminWhitelistUser`:
  - `id`: string
  - `email`: string
  - `role`: 'super_admin' | 'event_manager' | 'staff'
  - `is_active`: boolean

**Step 2: Remove all invented fields:**
- Remove `soundType`, `bpm`, custom beverage descriptions, and hardcoded local types.

---

### Task 3: Strip All Admin UI & Shortcuts from Public Landing Page

**Files:**
- Modify: `src/components/FloatingNavbar.tsx`
- Modify: `src/components/Footer.tsx`

**Step 1: Clean `FloatingNavbar.tsx`**
- Remove any `onOpenAdmin` props or callbacks.
- Remove `keydown` listener for `Ctrl+Shift+A` and `Alt+A`.
- Ensure navigation only renders public festival tabs: `[ Home ] [ Lineup ] [ Tickets ] [ Rundown ] [ Rules ]`.

**Step 2: Clean `Footer.tsx`**
- Remove the `[ Staff Portal ]` button and lock icon.
- Keep clean social links, copyright, and official ticketing partner acknowledgment.

---

### Task 4: Fix Audio Preview in Lineup Section (Replace Oscillator Synthesis with Audio URL)

**Files:**
- Modify: `src/components/LineupSection.tsx`

**Step 1: Remove Web Audio API Oscillators**
- Delete `new AudioContext()`, `createOscillator()`, `createGain()`, frequency ramps, and synthesizers.

**Step 2: Implement Real Audio Preview Playback**
- Use standard `HTMLAudioElement` (`new Audio(artist.audio_preview_url)`).
- When clicked, if `artist.audio_preview_url` exists, play it; if playing, pause it.
- Ensure one-at-a-time playback (PRD Section 6 NFR 3: if playing DJ B, DJ A automatically pauses).
- Display the Acid Volt equalizer only when actual audio is playing.

---

### Task 5: Clean Content in TicketSection & StageRundown

**Files:**
- Modify: `src/components/TicketSection.tsx`
- Modify: `src/components/StageRundown.tsx`

**Step 1: TicketSection data compliance**
- Render `ticket.name`, `ticket.price`, `ticket.perks` dynamically from the PRD contract.
- Do not hardcode alcohol, drink perks, or VIP cocktail inclusions unless provided in `ticket.perks`.
- Map `ticket.ticket_url` to external checkout redirects (e.g. Artatix).

**Step 2: StageRundown data compliance**
- Derive the schedule dynamically from the `artists` dataset (`performance_time`, `stage_name`, `day_label`) instead of hardcoding invented artist names.

---

### Task 6: Implement Dedicated `/admin/*` Route & Whitelist Authentication

**Files:**
- Create: `src/admin/AdminLogin.tsx`
- Create: `src/admin/AdminDashboard.tsx`
- Modify: `src/App.tsx`

**Step 1: Path Routing in `App.tsx`**
- Detect `window.location.pathname`:
  - `/` or any attendee anchor: Renders purely public Landing Page (Hero, Lineup, Tickets, Rundown, Rules, Footer). No admin drawer mounted!
  - `/admin` or `/admin/login`: Renders `AdminLogin` view.
  - `/admin/dashboard`: Renders `AdminDashboard` (protected by Supabase session / whitelist check).

**Step 2: Whitelist Authentication in `/admin/login`**
- Email-based authentication against `admin_whitelist` table.
- If email is not in whitelist or `is_active = false`, display strict error: `"403 Access Denied: Your account is not authorized to access this console."`
- No public signup button.

**Step 3: Real-Time CMS Controls in `/admin/dashboard`**
- Live toggle for ticket statuses (`active` ↔ `sold_out`).
- Live editor for announcement message and `is_enabled` toggle.
- Synchronized back to Supabase database (or state provider).

---

### Task 7: Build Verification & End-to-End Audit

**Files:**
- All touched files

**Step 1: Run TypeScript compiler and production build**
- Execute `npm run build` to confirm 0 compilation errors and clean bundle output.

**Step 2: Verify Public vs Admin Isolation**
- Visit `/`: Confirm 0 admin buttons, 0 debug UI, clean rave aesthetics, working real-time ticket states.
- Visit `/admin`: Confirm dedicated back-office console with whitelist protection.
