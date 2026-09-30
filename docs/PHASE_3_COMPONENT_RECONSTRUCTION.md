# PHASE 3: COMPONENT RECONSTRUCTION (THE 6 SCENES)

> **Status:** PENDING (Prerequisite: Phase 2 Design Tokens)  
> **Target Files:** [`src/App.tsx`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/App.tsx), [`src/components/`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/components), [`src/data/`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/data), [`src/types/`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/types)

---

## 1. Objective
Systematically reconstruct every user-facing component into the 6-Scene Narrative of **The State of Clamour**, ensuring zero cosmetic fluff and frictionless functional clarity.

---

## 2. Component Specifications

### 2.1 Navigation: `FloatingNavbar.tsx`
* **Visibility Rule:**
  * Viewport top (`scrollY < 80px`): **Hidden completely** (Hero remains a pure poster).
  * On scroll (`scrollY >= 80px`): Fades in smoothly with `backdrop-filter: blur(12px)`.
* **Desktop Layout:**
  * Left: `THE STATE OF CLAMOUR` (in subtle Cinzel uppercase).
  * Right: `THE GUESTS` · `THE PASSAGE` · `THE NIGHT` · `[ ENTER THE STATE → ]`.
* **Mobile Layout:**
  * Left: `S · C` monogram.
  * Right: Minimalist drawer trigger (`MENU`).

---

### 2.2 Scene 01: `HeroSection.tsx` (The Arrival)
* **Visual Background:** Symmetrical `hero_monument.jpg` with slow ambient illumination.
* **Layout:** Centered monumental vertical hierarchy:
  ```text
               THE STATE OF CLAMOUR
                        ·
              SWEAR IN CONTINENTAL

             [ MONUMENTAL PORTAL ]

              30 — 31 OCTOBER 2026
             [ACTUAL CITY / VENUE]

                    ENTER ↓
  ```
* **Strict Exclusions:**
  * ❌ No giant digital countdown boxes.
  * ❌ No floating glass pills.
  * ❌ No neon buttons.

---

### 2.3 Scene 02: `LineupSection.tsx` (The Guests / The Release)
* **Role:** Delivers the "BOOM — This place is alive" contrast.
* **Layout:** High-contrast 9:16 asymmetric editorial spread for **Basboi** & **Elena Vex**.
* **Visuals:** Concert photography (`guest_basboi.jpg` & `guest_elena.jpg`), live stage flash, crowd silhouettes, visible movement.
* **Audio Preview Interaction:**
  * Small brass play button (`▶`) at the lower corner of each portrait.
  * *Strictly user-initiated.* No autoplay.
  * Subtle track title indicator appears on play; no giant neon audio visualizers.

---

### 2.4 Scene 03: `TicketSection.tsx` (The Passage)
* **Design Philosophy:** **Zero-Cosplay Admission Document.**
* **Rule:** Must be comprehensible within 1 second.
* **Card Anatomy:**
  * Subtle hairline gold border, deep charcoal surface.
  * Tier Title: `PRESALE 01` (Large, clean).
  * Date/Access: `30 — 31 OCTOBER · GENERAL ACCESS`.
  * Price: `Rp129.000` (High contrast Ivory text).
  * Action: `[ GET TICKETS → ]` (Direct link to official ticketing partner).
  * Sold-Out State: `CLOSED / CAPACITY REACHED` (Subdued gray, no flashing red badges).

---

### 2.5 Scene 04: `StageRundown.tsx` (The Night)
* **Design Philosophy:** Elegant institutional ledger.
* **Layout:** Clean linear list grouped by day:
  * `22:00 — DOORS UNSEALED`
  * `22:30 — BASBOI`
  * `00:00 — ELENA VEX`
  * `03:00 — EVENT CLOSE`
* **Strict Exclusions:**
  * ❌ No multi-colored rainbow clashfinder grids.

---

### 2.6 Scene 05: `RulesFAQ.tsx` (Before You Enter)
* **Design Philosophy:** Verified real-world policies only.
* **Content Topics:**
  1. Age Verification (Government ID required).
  2. Door Schedules (Last entry policy).
  3. Dress Code & Prohibited Items.
  4. Safe Space & Community Conduct.
  5. Ticketing & Refund Policy.
* **Strict Exclusions:**
  * ❌ No fabricated fantasy lore or roleplay rules.

---

### 2.7 Scene 06: `FinalCTA.tsx` (Enter the State)
* **Layout:** Vast dark canvas with a single warm red light source.
* **Copy:** `THE GATES OPEN 30 OCTOBER.`
* **Primary Action:** `[ ENTER THE STATE → ]` (Smooth scrolls to ticket section or opens checkout).

---

## 3. Data & Types Contracts (`src/data/eventData.ts`)
* Align all event metadata, ticket tiers, and artists to reflect **The State of Clamour**.
* Ensure clean fallback strings when external APIs are disconnected.
