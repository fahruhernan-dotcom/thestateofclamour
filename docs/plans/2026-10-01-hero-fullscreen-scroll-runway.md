# Hero Section Fullscreen Scroll Runway & Responsive Card Timing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore the swift, responsive emergence of the Section 1 card while significantly extending the scroll runway specifically during the **100vw x 100vh FULLSCREEN** state, so users can comfortably scroll and enjoy the full-bleed video, music, and welcome atmosphere without prematurely jumping into the next section.

**Architecture:** 
1. Re-balance `HeroSection.tsx` stage animation choreography: small card appears at `0.34`, expands at `0.44 -> 0.54`, and locks in pure fullscreen from `0.54` to `1.00` (46% of total track).
2. Expand physical scroll track runway in `src/styles/hero.css` (`--hero-track-height: 660vh` desktop / `560vh` mobile).
3. Ensure continuous audio playback throughout `progress >= 0.34` to `1.00` with proper Lineup threshold separation.

**Tech Stack:** React 19, TypeScript, Vanilla CSS, HTML5 Canvas 2D / Hardware Compositing, HTML5 Video.

---

### Task 1: Extend Physical Scroll Track Height in CSS

**Files:**
- Modify: `src/styles/hero.css:5-18`

**Step 1: Update `--hero-track-height` in `src/styles/hero.css`**
- Set `--hero-track-height: 660vh;` for desktop.
- Set `--hero-track-height: 560vh;` for mobile (`max-width: 768px`).

```css
.hero-scroll-track {
  --hero-track-height: 660vh;
  position: relative;
  width: 100%;
  height: var(--hero-track-height);
  background-color: #000000;
  z-index: 10;
}

@media (max-width: 768px) {
  .hero-scroll-track {
    --hero-track-height: 560vh;
  }
}
```

**Step 2: Verify CSS syntax**
- Verify file formatting and valid CSS variables.

---

### Task 2: Re-balance Stage Elements & Fullscreen Duration in `HeroSection.tsx`

**Files:**
- Modify: `src/components/HeroSection.tsx:120-315` and `src/components/HeroSection.tsx:460-475`

**Step 1: Update `tick()` frame interpolation timeline**
- Glide to cathedral: `0.00 -> 0.22` (Frames 0 -> 100)
- Fly through open gate into red mist & dissolve: `0.22 -> 0.34` (Frames 100 -> 140)
- Darkness with embers: `0.34 -> 0.44` (Frames 140 -> 191)
- Locked dark frame: `progress >= 0.44` (Frame 191)

```typescript
// Pacing mapping with cinematic video (192 frames):
// 0.00 -> 0.22: Frames 0 -> 100 (Glide towards cathedral, doors open)
// 0.22 -> 0.34: Frames 100 -> 140 (Fly through red gate, dissolve to black)
// 0.34 -> 0.44: Frames 140 -> 191 (Pitch black background with subtle embers)
// >= 0.44: Frame 191 locked (Embers in darkness, Section 1 expands to fullscreen)
let targetFrame: number;
if (targetProgress <= 0.22) {
  targetFrame = (targetProgress / 0.22) * 100;
} else if (targetProgress <= 0.34) {
  targetFrame = 100 + ((targetProgress - 0.22) / 0.12) * (140 - 100);
} else if (targetProgress <= 0.44) {
  targetFrame = 140 + ((targetProgress - 0.34) / 0.10) * (TOTAL_FRAMES - 1 - 140);
} else {
  targetFrame = TOTAL_FRAMES - 1;
}
```

**Step 2: Update `renderStageElements` choreography**
- Card Hidden: `progress < 0.34`
- Centered Small Card (Swift emergence): `progress 0.34 -> 0.44`
  - Fade-in quickly: `fadeInP = (progress - 0.34) / 0.06`
  - Editorial texts visible: `sec1TextOpacity = Math.min(1, (progress - 0.34) / 0.06)`
- Rapid Expansion to Fullscreen: `progress 0.44 -> 0.54`
  - `expP = (progress - 0.44) / 0.10`
  - Editorial texts drift and fade out: `sec1TextOpacity = Math.max(0, 1 - expP * 1.5)`
- **Fullscreen Plateau (46% of entire scroll runway!)**: `progress 0.54 -> 1.00`
  - Locked `width: 100vw`, `height: 100vh`, `left: 0`, `top: 0`, `borderRadius: 0px`
  - Welcome Climax overlay: appears at `0.58 -> 0.68`, holds strong through `0.90`, gentle fade out at `0.94 -> 1.00`
- Continuous Audio:
  - `const isSec1Active = progress >= 0.34 && progress <= 1.00 && canSec1PlayAudio();`

---

### Task 3: Build Verification & Smoke Test

**Files:**
- Test via `npm run build`

**Step 1: Run TypeScript & Vite build**
- Execute `npm run build` to confirm zero type errors and clean production bundle.

**Step 2: Verify browser scroll interaction**
- Verify small card appears quickly upon gate entrance.
- Verify expansion to 100% fullscreen completes by scroll progress `0.54`.
- Verify user has a long, generous scroll runway in fullscreen mode before reaching `LineupSection`.
