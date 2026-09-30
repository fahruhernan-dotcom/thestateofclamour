# Multi-Page Event Navigation Architecture Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a clean multi-page event navigation system where clicking any event navigates to a dedicated page living in its own separate file (`setiap halaman baru harus beda file`), with 100% natural Bahasa Indonesia copy and ritualized nocturnal aesthetics.

**Architecture:** A modular page architecture in `src/pages/` decoupled from `App.tsx`:
- `HomePage.tsx` (main living poster landing page)
- `NightOneEventPage.tsx` (dedicated event page for Night I: Basboi Live)
- `NightTwoEventPage.tsx` (dedicated event page for Night II: Elena Vex Techno)
- `EventDetailsPage.tsx` (master 2-night festival dossier with rundown, venue specs, protocols, and FAQ)
- `App.tsx` as the lightweight client router managing hash routes (`#/`, `#/event/night-1`, `#/event/night-2`, `#/event/full-dossier`).

**Tech Stack:** React 18, TypeScript (`.tsx`), Vite, Lucide React, Vanilla CSS design tokens.

---

### Task 1: Create Dedicated Page File for Night I (`NightOneEventPage.tsx`)

**Files:**
- Create: `src/pages/NightOneEventPage.tsx`

**Step 1: Write the component structure**
- Standalone page for **Night I: Basboi — Swear In Continental Live Concert** (30 Oktober 2026).
- Include:
  - Top navigation bar: "← KEMBALI KE BERANDA", document stamp "DOKUMEN RESMI // EVENT NIGHT I", and "BELI TIKET NIGHT I" quick action.
  - Monumental Event Header: Date `JUMAT, 30 OKTOBER 2026`, Stage `MAIN ASSEMBLY HALL`, Age restriction `18+ TERBATAS`.
  - Artist Spotlight card: Basboi profile, high-res portrait, genre details, live preview trigger, performance overview.
  - Complete Hour-by-Hour Rundown for Night 1:
    - 21:00 WIB: Gerbang Monumental & Penukaran Gelang RFID
    - 21:45 WIB: Warmup Atmosphere Set
    - 22:30 WIB: Basboi Live Headline Performance (Main Assembly Hall)
    - 00:30 WIB: Nocturnal Outro & Assembly Hall Wind-down
  - Venue Specifications & Denah Panggung: Main Assembly Hall acoustics, capacity, access paths.
  - Night 1 Specific Directives & Admission Protocol (KTP fisik, dress code gelap, no cash).
  - Ticket Pass Options for Night 1 (Blind Ticket, Early Bird, Presale 1, VIP Table) with direct checkout triggers.

**Step 2: Verify TypeScript types and export**
- Ensure props match: `artists: Artist[]`, `tickets: TicketTier[]`, `onBack: () => void`, `onCheckout: (ticket: TicketTier) => void`.

---

### Task 2: Create Dedicated Page File for Night II (`NightTwoEventPage.tsx`)

**Files:**
- Create: `src/pages/NightTwoEventPage.tsx`

**Step 1: Write the component structure**
- Standalone page for **Night II: Elena Vex — The Under-Vault Subterranean Odyssey** (31 Oktober 2026).
- Include:
  - Top navigation bar: "← KEMBALI KE BERANDA", document stamp "DOKUMEN RESMI // EVENT NIGHT II", and "BELI TIKET NIGHT II" quick action.
  - Monumental Event Header: Date `SABTU, 31 OKTOBER 2026`, Stage `THE UNDER-VAULT (SUBTERRANEAN)`, Age restriction `18+ TERBATAS`.
  - Artist Spotlight card: Elena Vex profile, modular synthesizer/dark techno overview, live preview trigger.
  - Complete Hour-by-Hour Rundown for Night 2:
    - 21:00 WIB: Gerbang Monumental & Penukaran Gelang RFID
    - 22:00 WIB: Sub-bass Ambient Calibration
    - 00:00 WIB: Elena Vex Modular Techno Headline Live Set (The Under-Vault)
    - 02:30 WIB: Final Sub-bass Resonance
    - 03:00 WIB: Pintu Gerbang Monumental Dikunci
  - Venue Specifications: The Under-Vault acoustic insulation, industrial resonance, low-ceiling intimate floor.
  - Night 2 Specific Directives: No flash photography policy, closed-toe footwear required, hydration stations.
  - Ticket Pass Options for Night 2 with direct checkout triggers.

**Step 2: Verify TypeScript types and export**
- Ensure props match: `artists: Artist[]`, `tickets: TicketTier[]`, `onBack: () => void`, `onCheckout: (ticket: TicketTier) => void`.

---

### Task 3: Extract Main Landing Page to Dedicated Page File (`HomePage.tsx`)

**Files:**
- Create: `src/pages/HomePage.tsx`

**Step 1: Encapsulate landing page sections**
- Move the living poster landing composition from `App.tsx` into `src/pages/HomePage.tsx`:
  - `FloatingNavbar`
  - `HeroSection`
  - `LineupSection`
  - `TicketSection`
  - `StageRundown` (Section 04)
  - `RulesFAQ` (Section 05)
  - `FinalCTA`
- Accept clean routing callbacks:
  - `onOpenEventNight1: () => void`
  - `onOpenEventNight2: () => void`
  - `onOpenFullDossier: (tab?: string) => void`
  - `onCheckout: (ticket: TicketTier) => void`
  - `onToast: (msg: string) => void`

---

### Task 4: Upgrade Section 04 (`StageRundown.tsx`) with Multi-Event Navigation

**Files:**
- Modify: `src/components/StageRundown.tsx`
- Modify: `src/index.css` (add event grid styles if needed)

**Step 1: Reconstruct Section 04 into Distinct Event Cards**
- Replace single card with a multi-event showcase presenting each event clearly:
  - **KARTU EVENT 01: NIGHT I // 30 OKT 2026**
    - Headline: `NIGHT I — BASBOI: THE MAIN ASSEMBLY`
    - Panggung: `Main Assembly Hall` · Jam: `21:00 – Selesai (Show 22:30 WIB)`
    - Button: `BUKA DETAIL EVENT NIGHT I →` (navigates to `#/event/night-1`)
  - **KARTU EVENT 02: NIGHT II // 31 OKT 2026**
    - Headline: `NIGHT II — ELENA VEX: THE UNDER-VAULT`
    - Panggung: `The Under-Vault` · Jam: `21:00 – Selesai (Show 00:00 WIB)`
    - Button: `BUKA DETAIL EVENT NIGHT II →` (navigates to `#/event/night-2`)
  - **DOSIR LENGKAP 2 MALAM // MASTER SPECIFICATION**
    - Banner: `PANDUAN & PROTOKOL LENGKAP SELURUH VENUE`
    - Button: `BUKA DOSIR MASTER (2 HARI) →` (navigates to `#/event/full-dossier`)

**Step 2: Connect Lineup Cards (`LineupSection.tsx`) to Event Pages**
- In `LineupSection.tsx`, add direct action buttons or card click handler:
  - Basboi card -> `onOpenEventNight1()`
  - Elena Vex card -> `onOpenEventNight2()`

---

### Task 5: Upgrade `App.tsx` as Multi-Page Router

**Files:**
- Modify: `src/App.tsx`

**Step 1: Implement Hash Router for Separate Page Files**
- State `page`: `'home' | 'event-night-1' | 'event-night-2' | 'full-dossier'`
- Hash listeners:
  - `#/` or empty -> `<HomePage />`
  - `#/event/night-1` -> `<NightOneEventPage />`
  - `#/event/night-2` -> `<NightTwoEventPage />`
  - `#/event/full-dossier` or `#/dossier` -> `<EventDetailsPage />`
- Smooth scroll to top on page navigation.
- Maintain global toast and ambient torchlight across all pages.

---

### Task 6: Build Verification & End-to-End Validation

**Files:**
- Run: `npm run build`
- Browser test navigation:
  1. Click Event 01 (Night I) from Section 04 -> Verifies `NightOneEventPage.tsx` loads.
  2. Click "KEMBALI KE BERANDA" -> Verifies return to `HomePage.tsx`.
  3. Click Event 02 (Night II) from Section 04 -> Verifies `NightTwoEventPage.tsx` loads.
  4. Click "KEMBALI KE BERANDA" -> Verifies return to `HomePage.tsx`.
  5. Click "BUKA DOSIR MASTER" -> Verifies `EventDetailsPage.tsx` loads.
  6. Test on mobile view to confirm zero overflow and optimal touch targets.
