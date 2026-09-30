# Minimalist Gen-Z DJ Event Platform Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a minimalist, high-fashion Gen-Z DJ/nightlife event website (inspired by Carnaval of Screams and Apple Design) with a sticky header and an invite-only Supabase-backed Admin Console to dynamically manage tickets, lineups, and announcements.

**Architecture:** A React 18 + TypeScript (`.tsx`) frontend styled with minimalist dark-mode CSS tokens, featuring a sticky frosted glass navigation bar, atmospheric hero, clean 9:16 artist poster grid, and dynamic ticket pass panels. Backed by Supabase PostgreSQL for live event data and Row Level Security (RLS) whitelist access control.

**Tech Stack:** React 18, TypeScript (`.tsx`), Vite, Tailwind CSS / Vanilla CSS tokens, Lucide Icons, Supabase (PostgreSQL + Auth + Storage).

---

## Task 1: Sticky Frosted Header Refactor
**Files:**
- Modify: `src/components/FloatingNavbar.tsx`
- Modify: `src/index.css`

**Step 1: Write clean sticky header structure**
Implement a sticky header docked at `top: 0` with `backdrop-blur-xl bg-black/60 border-b border-white/10` or a centered floating pill that stays sticky while scrolling without obscuring content.

**Step 2: Add minimalist navigation links**
Links: `Home`, `Lineup`, `Tickets`, `Rundown`, `Rules`, and a quiet, minimalist `Admin` trigger.

**Step 3: Test and verify**
Run `npm run build` to verify TypeScript compilation. Check sticky behavior during scroll.

---

## Task 2: Minimalist Hero Section (Carnaval of Screams Style)
**Files:**
- Modify: `src/components/HeroSection.tsx`

**Step 1: Eliminate visual clutter**
Remove loud canvas laser animations and ecommerce countdown boxes. Replace with serene, atmospheric dark void visuals and high-fashion typography.

**Step 2: Structure monumental typography**
- Eyebrow: `THE GREATEST ELECTRONIC FESTIVAL` (`tracking-[0.4em] text-white/60 text-xs`)
- Title: `ECHO VOID` in bold, clean grotesque display typography
- Dates: `30TH – 31ST OCTOBER 2026` (`tracking-[0.25em] text-white text-xl`)
- Location: `YOGYAKARTA, INDONESIA` (`tracking-[0.3em] text-white/50 text-xs`)
- Single CTA: `GET YOUR TICKETS` (black rounded pill with thin white border and subtle ambient glow halo)

**Step 3: Test and verify**
Verify visually that the hero fits within the initial viewport (`min-h-[90vh]`) and has high contrast and breathing room.

---

## Task 3: Minimalist Guest Stars & Lineup Grid
**Files:**
- Modify: `src/components/LineupSection.tsx`

**Step 1: Implement Carnaval of Screams 2-column / 3-column layout**
- Header: `Guest Stars` (tiny tracked uppercase), `Arriving` (prominent display title), `Two nights full of surprises.`
- Remove garish multi-colored neon genre tags.

**Step 2: Refine 9:16 poster cards**
- Hairline borders (`border-white/10` with soft hover brightness).
- Minimalist typography: `Day 1 · 30th October 2026` followed by artist name `Basboi` and `Elena Vex`.
- Discreet, minimalist audio play button in the corner.

**Step 3: Test and verify**
Verify aspect ratio consistency and smooth hover transition.

---

## Task 4: Minimalist Pass Panels (Tickets Section)
**Files:**
- Modify: `src/components/TicketSection.tsx`

**Step 1: Implement refined pass cards**
- Structure:
  - Header: `1 Day Pass` / `2 Day Pass` with small status signal dot.
  - Title: `Blind Ticket`, `Early Bird`, `Presale 1`, `VIP Table`.
  - Hairline divider: `h-[1px] bg-white/10`.
  - Price: `Rp75.000`, `Rp99.000`, `Rp129.000`.
  - Single sentence description.
  - Clean button: Muted border for `Sold Out`, solid white or black with white border for `Get Tickets`.
- Footer note: `Official Ticketing Partner · ARTATIX`.

**Step 2: Test and verify**
Ensure sold-out cards have distinct but elegant dimming (opacity 40%, no loud clashing colors).

---

## Task 5: Supporting Minimalist Sections (Rundown, FAQ, Footer)
**Files:**
- Modify: `src/components/StageRundown.tsx`
- Modify: `src/components/RulesFAQ.tsx`
- Modify: `src/components/Footer.tsx`

**Step 1: Clean table styling for Rundown**
Monochrome timetable comparing Main Stage vs Bunker Stage with subtle row dividers.

**Step 2: Refine FAQ Accordion**
Clean borders, elegant chevron indicators, concise party rules (Age limit, dress code, prohibited items).

**Step 3: Minimalist Footer**
Clean copyright and social media text links.

---

## Task 6: Supabase Database Schema & Whitelist SQL
**Files:**
- Create: `supabase/schema.sql`
- Create: `src/lib/supabase.ts`

**Step 1: Create SQL schema migration**
Tables: `events`, `ticket_tiers`, `artists`, `announcements`, and `admin_whitelist`.
Include Row Level Security (RLS) policies:
- `anon`: Read-only access to active events.
- `authenticated` matching `admin_whitelist`: Full CRUD access.

**Step 2: Create Supabase Client**
TypeScript client using `@supabase/supabase-js` with graceful fallback to local storage / mock store if Supabase credentials are not yet configured.

---

## Task 7: Minimalist Apple-Grade Admin Console Drawer
**Files:**
- Modify: `src/components/AdminDrawer.tsx`

**Step 1: Clean, uncluttered UI**
Monochrome toggle switches, clean typography, compact layout that looks like native macOS / iOS Settings.

**Step 2: Real-time synchronization**
- Ticket status switcher: 1-click toggle between `active` and `sold_out`.
- Live announcement text & toggle.
- Whitelist tester to verify authorized vs unauthorized email access.

---

## Task 8: End-to-End Build & Visual Verification
**Files:**
- Run: `npm run build`
- Verify in browser: `http://localhost:5173/`

**Step 1: Verify TypeScript compilation**
Ensure 0 type errors.

**Step 2: Visual check on mobile and desktop**
Ensure sticky navbar stays anchored, hero has monumental impact, and live toggles instantly reflect on the landing page.
