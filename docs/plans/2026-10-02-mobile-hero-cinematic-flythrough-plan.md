# Mobile Hero Cinematic Fly-Through & Gate Sequence Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Mobile Hero Section (`HeroSectionMobile.tsx`) to match the desktop cinematic scroll logic 100%, integrating the 2K portrait poster (`1st-Post.jpg_2K_20261002033657.jpg`) as the establishing shot and the 8s camera fly-through (`Camera_enters_gothic_tower_doors_20261001233728.mp4` -> `public/assets/hero_camera_doors.mp4`) as the interactive scroll-driven entrance into the cathedral darkness before Section 1 unmasks.

**Architecture:** 
- Keep desktop completely untouched and isolated in `HeroSection.tsx`.
- Migrate and optimize asset copies to `public/assets/hero_scroll_poster_mobile_2k.jpg` and `public/assets/hero_camera_doors.mp4`.
- Build an adaptive hardware-accelerated scroll engine in `HeroSectionMobile.tsx` that coordinates the 5-stage transition: 2K portrait poster -> fly-through camera push-in towards the red door -> plunge into darkness -> Section 1 concert recap emergence & expansion -> "WELCOME TO THE ASSEMBLY" climax runway.

**Tech Stack:** React 19, TypeScript, HTML5 Canvas 2D / Video Scrubbing, CSS3 GPU Transforms (`translate3d`, `scale`, `will-change`), Vite.

---

### Task 1: Asset Preparation & Migration to Public Directory

**Files:**
- Create/Copy: `public/assets/hero_scroll_poster_mobile_2k.jpg` (from `1st-Post.jpg_2K_20261002033657.jpg`)
- Create/Copy: `public/assets/hero_camera_doors.mp4` (from `Camera_enters_gothic_tower_doors_20261001233728.mp4`)

**Step 1: Copy 2K Portrait Poster Asset**
Copy `1st-Post.jpg_2K_20261002033657.jpg` to `public/assets/hero_scroll_poster_mobile_2k.jpg`.
Verify: file size ~2.9 MB, dimensions 1536x2752 px.

**Step 2: Copy Camera Fly-Through Gothic Doors Video Asset**
Copy `Camera_enters_gothic_tower_doors_20261001233728.mp4` to `public/assets/hero_camera_doors.mp4`.
Verify: file size ~8.0 MB, vertical 1080x1920 px, duration 8.0s.

**Step 3: Verification**
Run: `npm run build`
Expected: Build passes with 0 errors.

**Step 4: Commit**
```bash
git add public/assets/hero_scroll_poster_mobile_2k.jpg public/assets/hero_scroll_cinematic.webm
git commit -m "feat(assets): add 2K portrait poster and cinematic fly-through webm"
```

---

### Task 2: Mobile Scroll Choreography & Multi-Layer Engine (`HeroSectionMobile.tsx`)

**Files:**
- Modify: `src/components/mobile/HeroSectionMobile.tsx`
- Modify: `src/styles/mobile/hero.mobile.css`

**Step 1: Define Stage Timings in `HeroSectionMobile.tsx`**
- Set scroll runway height to `340vh` (matching desktop's spacious cinematic feel).
- **Stage 1 (`progress 0.00 -> 0.12`):**
  - Display pristine 2K portrait poster `hero_scroll_poster_mobile_2k.jpg`.
  - Date, venue, and "GULIR KE GERBANG ↓" button visible; dissolves upward as scroll begins.
- **Stage 2 (`progress 0.10 -> 0.36`):**
  - Fly-through video/frame layer fades in smoothly.
  - Video scrubbed from 0s to 12.5s (camera moves down gothic street, red doors unlock and swing open, red fog billows, camera plunges through red light into pitch black void).
  - Center of video anchored dynamically on the red doorway (`object-position: center 50%`).
- **Stage 3 (`progress 0.36 -> 0.46`):**
  - Video reaches total black void.
  - Section 1 concert card (`how2026_recap.mp4`) emerges at screen center (`width: min(84vw, 360px)`) with gold hairline border and red volumetric backlight.
  - Mobile editorial typography (`THE GUESTS`, `MALVIN`, `FAR`) fades in.
  - Audio unseals via `audioCoordinator.ts`.
- **Stage 4 (`progress 0.46 -> 0.56`):**
  - Concert card smoothly expands to 100vw × 100vh full-bleed.
  - Editorial texts drift outward into the edges.
- **Stage 5 (`progress 0.56 -> 1.00`):**
  - Fullscreen concert experience with audio playing.
  - "WELCOME TO THE ASSEMBLY" climax title reveals and holds steady between `0.60 -> 0.92`.
  - Soft exit into Section 2 (`#lineup`).

**Step 2: Update `src/styles/mobile/hero.mobile.css`**
- Style the layers for hardware-composited GPU rendering:
  - `.hero-mobile-2k-poster`: Full-bleed cover portrait.
  - `.hero-mobile-flythrough-stage`: Video/canvas container centered on the doorway.
  - `.hero-mobile-portal-frame`: Section 1 card with expansion morphing.
  - `.hero-mobile-climax-overlay`: "WELCOME TO THE ASSEMBLY" title.

**Step 3: Verification**
Run: `npm run build`
Expected: Build passes with 0 errors.

**Step 4: Commit**
```bash
git add src/components/mobile/HeroSectionMobile.tsx src/styles/mobile/hero.mobile.css
git commit -m "feat(hero-mobile): implement 5-stage cinematic fly-through and gate sequence matching desktop logic"
```

---

### Task 3: Performance, Scrubbing Smoothing & Cross-Browser Tuning

**Files:**
- Modify: `src/components/mobile/HeroSectionMobile.tsx`

**Step 1: LERP / RAF Smoothing on Mobile**
- Implement `requestAnimationFrame` with threshold gating to prevent video seek contention during rapid thumb flicking.
- Add fallback poster rendering for offline/slow network conditions.
- Verify mutual exclusion with Section 2 lineup audio.

**Step 2: Verification**
Run: `npm run build`
Expected: Build passes with 0 errors.

**Step 3: Commit**
```bash
git add src/components/mobile/HeroSectionMobile.tsx
git commit -m "perf(hero-mobile): optimize mobile video scrubbing and gesture response"
```

---

### Task 4: End-to-End Verification & Vault Update

**Files:**
- Verify on Dev Server `http://localhost:5173/` at mobile viewports (393x852, 360x640, 428x926):
  1. Initial rest: Crisp 2K poster with no text clipping.
  2. Scrolling forward: Camera glides smoothly to the cathedral, red doors open, enters darkness.
  3. Emergence: Section 1 concert card emerges with audio and expands to fullscreen.
  4. Climax: "WELCOME TO THE ASSEMBLY" appears.
  5. Hand-off: Smooth transition to Lineup.
- Update `ActiveContext.md` and Index in Vault.
