# Mobile View Framing & Hero Section Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Resolve the horizontal text cut-off ("SWEAR IN CONTINENT") on mobile view (393x852) and establish an impeccable mobile-first experience for the Hero Section and Section 1.

**Architecture:** 
- **Root Cause:** Current video sequence is 16:9 Landscape (1280x720) with text baked into the wide frame. On a portrait screen (9:19.5), ~70% of the horizontal width is cropped, cutting off "CONTINENTAL".
- **Two Strategic Approaches:**
  1. **Option A (AI Generation - High Fidelity):** Generate a native 9:16 vertical video using `1st-Post.jpg` as the starting keyframe, where typography is natively framed for mobile screens.
  2. **Option B (Code & Canvas Adaptation - Immediate, Zero Re-generation):** Serve an optimized vertical keyframe (`1st-Post.webp`) at `scroll = 0` on mobile, adapt canvas vertical framing to focus on the gate entrance during scroll, and ensure all mobile typography fits neatly without clipping.

**Tech Stack:** React 19, TypeScript, HTML5 Canvas 2D, CSS Media Queries, WebP.

---

### Task 1: Problem Diagnosis & Asset Comparison

**Files:**
- Reference: `public/assets/hero_scroll_poster.jpg` (1280x720, 16:9 Landscape - text is wide)
- Reference: `Source/.../1st-Post.jpg` (3072x4096, 3:4 Portrait - text is natively formatted for portrait)

**Analysis:**
- On desktop (16:9), the aspect ratio is `1.778`.
- On mobile (e.g. iPhone 15 Pro, 393x852), the aspect ratio is `0.461`.
- When rendering 16:9 landscape on a 0.461 screen using `cover`:
  - `rendered_width = 852 * (16/9) = 1514px`
  - Horizontal crop per side = `(1514 - 393) / 2 = 560.5px`
  - Because "SWEAR IN CONTINENTAL" spans ~520px in the center 1280px frame, scaling it to height 852px makes the text 615px wide, which exceeds the 393px screen by 222px, cutting off "CO" and "TAL".

---

### Task 2: Option A Implementation Flow (If Generating 9:16 Video)

**Step 1: Prepare Source Image for AI Video Generation**
- Use `Source/drive-download-20261001T094129Z-1-001/1st-Post.jpg`.
- Aspect ratio is vertical 3:4 / 9:16.
- Typography "THE STATE OF CLAMOR" and "SWEAR IN CONTINENTAL" is natively aligned.

**Step 2: Generate Video via AI Video Tool**
- Input: `1st-Post.jpg`
- Prompt: `Camera transitions smoothly forward down the dark nocturnal neo-gothic street towards the central glowing red double doors of the Flatiron cathedral, doors open, camera glides inside through the red light into pure black darkness with floating subtle embers`.
- Aspect Ratio: `9:16` vertical.

**Step 3: Extract & Integrate Mobile Frame Sequence**
- Extract 192 frames to `public/assets/hero_frames_mob/f_001.webp` ... `f_192.webp`.
- In `HeroSection.tsx`, detect `window.innerWidth < 768` and load mobile frame path:
  ```typescript
  const getFramePath = (index: number, isMobile: boolean): string => {
    const frameNum = Math.max(1, Math.min(TOTAL_FRAMES, index + 1));
    const padded = String(frameNum).padStart(3, '0');
    return isMobile 
      ? `/assets/hero_frames_mob/f_${padded}.webp` 
      : `/assets/hero_frames/f_${padded}.webp`;
  };
  ```

---

### Task 3: Option B Implementation Flow (Immediate Fix Without Video Re-generation)

**Step 1: Create Web-Optimized Portrait Poster for Mobile**
- Generate an optimized portrait poster from `1st-Post.jpg` to `public/assets/hero_scroll_poster_mobile.webp` (e.g. 786x1048 or 1080x1440, ~150KB).
- Display this portrait poster on mobile at `progress = 0` so the static first impression has zero text cut-off.

**Step 2: Adaptive Canvas Framing in `renderImageToCanvas` for Mobile**
- On mobile (`canvasRatio < 0.6`), adjust vertical bias and frame zoom so that when the user scrolls, the camera zooms into the lower central doorway and pushes the wide text upward out of frame quickly:
  ```typescript
  if (canvasRatio < imgRatio) {
    dh = ch;
    dw = ch * imgRatio;
    const overflowX = dw - cw;
    dx = -overflowX * 0.5;
    // Shift vertical focus dynamically towards doorway as scroll starts
    const mobileShiftY = isMobile ? -ch * 0.08 * Math.min(1, progress * 4) : 0;
    dy = mobileShiftY;
  }
  ```

**Step 3: Refine Section 1 Mobile Layout & Spacing**
- Adjust `story-mobile-top-editorial` and `story-mobile-bottom-editorial` margins to ensure no collision on screens shorter than 750px:
  - Constrain `baseCardH` to `Math.min(baseCardW * 1.33, vh * 0.46)` on mobile.
  - Ensure touch targets for "ENTER THE GUESTS" and schedule columns meet accessibility guidelines (>= 48px).

---

### Task 4: Evaluation & Choice Matrix

| Criteria | Option A (Generate 9:16 Video) | Option B (Code/Canvas Adaptation) |
| :--- | :--- | :--- |
| **Visual Quality** | 100% Perfect 9:16 framing during entire scroll | Perfect at `scroll=0`, slight 16:9 letterbox during zoom |
| **Time to Ship** | Requires AI video generation run (5-15 min) | Instant (Can be completed in code right now) |
| **Asset Size** | Adds ~5-6 MB mobile sequence | Zero extra sequence, only 1 portrait poster (~120KB) |
| **Text Cut-off** | Completely eliminated | Completely eliminated at rest and during entrance |
