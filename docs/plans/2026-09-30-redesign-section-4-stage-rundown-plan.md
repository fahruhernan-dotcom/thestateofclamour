# Redesign Section 4 (Detail & Rundown Acara) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform Section 4 (`StageRundown.tsx` & `dossier.css`) from a templated, pill-cluttered "AI slop" card grid into an Apple-inspired editorial showcase for Night I, Night II, and the Master Dossier with monumental visual presence, fluid spring micro-interactions, and zero robotic clutter.

**Architecture:** Replace the cookie-cutter card layout (tiny 58px avatars, 4 boxed pill badges per card, double-slash syntax `//`) with two cinematic, large-format interactive Night Panels. Each panel incorporates an atmospheric visual crop, clear typographic hierarchy (Cinzel + Cormorant Garamond / Inter), unified tactile card touch targets, clean typographic metadata dots (no pills), and Apple-grade translucent glassmorphism with specular edge lighting.

**Tech Stack:** React, TypeScript, CSS (Vanilla Design System in `src/styles/dossier.css` & `src/styles/responsive.css`), Lucide icons (restrained to 1-2 subtle glyphs maximum, e.g. clean arrows).

---

## 🔍 Audit & UX Law Evaluation (AI Slop Deconstruction)

### 1. Violations of `design-taste-frontend`
- **Card-Grid AI Cliche:** Two identical cards with top header bar, tiny 58px avatar square, paragraph, and 4 boxed pill tags. Violates Section 4.4 and Section 4.9 (anti-card clutter, anti-data-dump).
- **Icon-in-Pill Overload:** `[Calendar 30 OKT]`, `[Clock 21:00 // SHOW 22:30]`, `[MapPin MAIN STAGE]`, `[ShieldCheck 18+ TERBATAS]`. Boxes inside boxes, icons used as bullet decor.
- **Robotic Syntax:** Excessive `//` slashes (`EVENT 01 // JUMAT...`, `21:00 // SHOW...`, `PANDUAN LENGKAP // DOSIR MASTER`).
- **Diminished Scale:** The 58x58px thumbnail looks like an avatar in an admin user list rather than a headliner of a festival.

### 2. Violations of `apple-design`
- **Simplicity vs. Minimalism (WWDC Principle 6):** Unnecessary nesting and decorative badges overwhelm the core task: allowing visitors to preview and select Night I vs. Night II.
- **Materials & Depth (WWDC Principle 12):** Flat gray boxes lack specular highlights, frosted blur grading, and physical depth.
- **Direct Manipulation & Fitts's Law:** Only the small bottom button is clickable instead of the entire card surface.

### 3. Laws of UX
- **Hick's Law & Miller's Law:** 22+ competing visual units in one section causes cognitive fatigue.
- **Law of Common Region & Proximity:** Over-segmentation with 8 individual pill containers creates visual noise.
- **Von Restorff Effect:** Key information (Date, Headliner, Venue) is lost in a uniform sea of gold borders.

---

## 📋 Implementation Plan

### Task 1: Redesign Section 4 Component Structure (`StageRundown.tsx`)

**Files:**
- Modify: `src/components/StageRundown.tsx`

**Details:**
1. Make each Night card (`event-roster-card`) a full interactive button/container with `onClick`, keyboard accessibility (`tabIndex={0}`, `onKeyDown`), and `role="button"`.
2. Replace tiny 58px thumbnails with a **cinematic visual banner header** or full atmospheric poster header (16:9 crop with dark gradient overlay, displaying the artist and stage ambiance).
3. Eliminate all robotic `//` strings.
4. Replace the 4 boxed pill tags with a refined, single-line typographic meta strip:
   `30 OKT 2026 · 21:00 WIB · MAIN ASSEMBLY · 18+`
5. Replace full-width oxblood buttons with an elegant editorial link affordance:
   `JELAJAHI MALAM I →` with smooth hover translation.
6. Refine the bottom Master Dossier banner to feel like a sleek editorial dispatch rather than an advertisement banner.

---

### Task 2: Implement Apple-Grade Editorial CSS Styling (`src/styles/dossier.css`)

**Files:**
- Modify: `src/styles/dossier.css`

**Details:**
1. **Translucent Glass Surface:**
   - `background: rgba(13, 17, 23, 0.75)`
   - `backdrop-filter: blur(24px) saturate(160%)`
   - `border: 1px solid rgba(255, 255, 255, 0.08)`
   - `border-top: 1px solid rgba(255, 255, 255, 0.2)` (Apple specular light catch on top edge).
2. **Spring Physics & Hover Dynamics:**
   - Active press state: `transform: scale(0.985)` with instantaneous feedback (`transition: transform 100ms ease-out`).
   - Hover state: `transform: translateY(-4px)` with depth shadow `0 20px 48px -12px rgba(0, 0, 0, 0.9)`.
3. **Hero Image Integration:**
   - Aspect ratio `16:9` with smooth zoom on card hover (`transform: scale(1.04)` over 600ms cubic-bezier).
   - Bottom gradient scrim (`linear-gradient(to top, rgba(13,17,23,0.95), transparent)`) blending image seamlessly into text.
4. **Typographic Meta Strip:**
   - Clean inline typography using `font-family: var(--font-body)` with subtle opacity dots `·`.
5. **Refined Master Dossier Strip:**
   - Minimalist obsidian pill design with subtle antique gold accent.

---

### Task 3: Mobile View Ergonomics & Responsive Polish (`src/styles/responsive.css`)

**Files:**
- Modify: `src/styles/responsive.css`

**Details:**
1. Single-column card stack on `< 768px` with `gap: 1.5rem`.
2. Touch-friendly hit target (minimum 48px heights, padded touch areas).
3. Image aspect ratio preserved without clipping text or causing horizontal overflow.
4. Master Dossier banner adapts to clean vertical stack on small screens.

---

### Task 4: Build Verification, Quality Audit & Git Commit

**Files:**
- All touched files

**Details:**
1. Run `npm run build` (`tsc -b && vite build`) to verify 0 TypeScript/CSS build errors.
2. Commit changes to Git with descriptive commit message:
   `refactor(section4): elevate stage rundown to apple-grade editorial design`
3. Document work in Obsidian Vault note and update `ActiveContext.md`.
