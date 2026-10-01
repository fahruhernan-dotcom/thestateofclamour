# Interactive Scroll Hero Cinematic & Seamless Section 1 Gateway Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Hero Section into an interactive scroll-driven cinematic camera push-in using pre-rendered video scrubbing (`Untitled_Scene_10-01_10_08_26_20261001171017.mp4` as the immutable final visual source) that approaches the Continental building, unlocks and swings open the cathedral doors with erupting red mist, plunges through the gate into darkness, and seamlessly unseals Section 1 (`GuestStorytellingTransition` with `how2026_recap.mp4`) without altering Section 1's existing editorial and storytelling flow.

**Architecture:** 
1. Convert `HeroSection` into a performance-oriented sticky scroll track (initial hypothesis: 260vh desktop / 220vh mobile for generous cinematic breathing room; tuned empirically in browser).
2. Video remains a single pre-rendered MP4 file (`/assets/hero_scroll_cinematic.mp4`). No image sequences.
3. Use a performance-oriented `requestAnimationFrame` LERP scroll-scrub controller to map scroll progress to `video.currentTime` (0.0s to 15.02s). Target-time interpolation dampens seek frequency to prevent seek thrashing. `fastSeek()` is treated strictly as an optional browser-supported fallback, with seek delta threshold tuned empirically (`0.035s`, roughly 1 frame at 24fps).
4. Fade out and drift the Hero film poster typography during the initial camera approach while preserving the establishing poster view at scroll = 0.
5. Exact Frame 0 extracted as `hero_scroll_poster.jpg` directly from the video with strict visual parity acceptance criteria (identical dimensions, color space, zero brightness jump, zero flash).
6. Generate a contact sheet grid in Task 1 for visual confirmation of keyframe beats.
7. Conclude the Hero video scrub on its natural total blackout frame (timestamps 12.5s - 15.02s -> progress 0.832 to 1.00), forming a perfect pitch-black match cut into Section 1 (`GuestStorytellingTransition`), where the inner sanctuary portal (`how2026_recap.mp4`) unmasks.
8. **Preservation of Section 1:** Modify only the minimum wrapper/style/positioning required for seamless Hero handoff. Do NOT alter existing storytelling logic, animation sequence, content, timing, or media behavior of `GuestStorytellingTransition.tsx`.

**Tech Stack:** React 18, TypeScript, Vite, CSS Sticky & GPU Compositing (`clip-path`, `translateZ`, `will-change`), HTML5 Video Scrubbing API (`currentTime` with LERP smoothing).

---

### Task 1: Asset Preparation, Contact Sheet Verification, & Empirical Timeline Definition

**Files:**
- Create/Copy: `public/assets/hero_scroll_cinematic.mp4` (from `Untitled_Scene_10-01_10_08_26_20261001171017.mp4`)
- Create: `public/assets/hero_scroll_poster.jpg` (extracted from exact frame 0 of video)
- Create: `src/config/heroTimeline.ts` (empirical timeline beats definition and non-linear scroll choreography)
- Modify: `src/utils/mediaPreloader.ts:1-50`

**Step 1: Copy existing MP4 and verify video integrity**
Copy `Untitled_Scene_10-01_10_08_26_20261001171017.mp4` to `public/assets/hero_scroll_cinematic.mp4`.
- Duration: `15.02s`
- Resolution: `1280x720`
- FPS: `24 fps` (360 frames total)
- Codec: `H.264 (avc1)`

**Step 2: Extract Frame 0 as High-Resolution Poster for Strict Visual Parity**
Run ffmpeg command to extract frame 0 directly from the MP4:
```bash
ffmpeg -y -ss 00:00:00.000 -i public/assets/hero_scroll_cinematic.mp4 -frames:v 1 -q:v 2 public/assets/hero_scroll_poster.jpg
```
*Acceptance Criteria:* At scroll = 0, poster and video frame 0 must visually match with zero layout shift, zero color discrepancy, and zero brightness flash.

**Step 3: Generate visual contact sheet grid to confirm beats**
Extract contact sheet of frames (e.g. 0s, 2s, 4.5s, 6.5s, 9.5s, 11.5s, 12.5s, 14s) to visually confirm the cinematic transitions.

**Step 4: Define Empirical Cinematic Timeline Map & Non-Linear Choreography**
```typescript
// src/config/heroTimeline.ts
export const HERO_VIDEO_CONFIG = {
  duration: 15.02,
  fps: 24,
  src: '/assets/hero_scroll_cinematic.mp4',
  poster: '/assets/hero_scroll_poster.jpg',
  initialTrackHeightVhDesktop: 260,
  initialTrackHeightVhMobile: 220,
};

export const HERO_CINEMATIC_BEATS = {
  // Video timestamps (seconds) — immutable source of truth
  timestamps: {
    establishingStart: 0.0,
    approachStart: 2.0,
    doorOpenStart: 4.5,
    thresholdCross: 6.5,
    interiorVortex: 9.5,
    fadeToDark: 11.5,
    blackoutStart: 12.5,
    videoEnd: 15.02,
  },
  // Non-linear scroll choreography [startProgress, endProgress] (0.0 to 1.0)
  scrollMap: {
    establishing: [0.00, 0.18],     // Far view of Continental, headline fully legible
    typographyFade: [0.04, 0.25],   // Headline scales slightly and fades out
    approachDoor: [0.18, 0.38],     // Camera advances down street toward entrance
    doorBurst: [0.38, 0.55],        // Doors swing open with red smoke & light
    crossThreshold: [0.55, 0.72],   // Camera plunges through gates into interior
    vortexFade: [0.72, 0.832],      // Red swirling energy dissipates into darkness
    blackoutVoid: [0.832, 1.00],    // 100% black void, seamless gateway to Section 1
  },
};

/**
 * Maps normalized scroll progress (0.0 to 1.0) to non-linear target video time (seconds).
 */
export function mapScrollProgressToVideoTime(progress: number): number {
  const p = Math.max(0, Math.min(1, progress));
  const { timestamps, scrollMap } = HERO_CINEMATIC_BEATS;

  if (p <= scrollMap.establishing[1]) {
    // 0.00 -> 0.18 maps to 0.0s -> 2.0s
    const ratio = p / scrollMap.establishing[1];
    return timestamps.establishingStart + ratio * (timestamps.approachStart - timestamps.establishingStart);
  }
  if (p <= scrollMap.approachDoor[1]) {
    // 0.18 -> 0.38 maps to 2.0s -> 4.5s
    const ratio = (p - scrollMap.approachDoor[0]) / (scrollMap.approachDoor[1] - scrollMap.approachDoor[0]);
    return timestamps.approachStart + ratio * (timestamps.doorOpenStart - timestamps.approachStart);
  }
  if (p <= scrollMap.doorBurst[1]) {
    // 0.38 -> 0.55 maps to 4.5s -> 6.5s
    const ratio = (p - scrollMap.doorBurst[0]) / (scrollMap.doorBurst[1] - scrollMap.doorBurst[0]);
    return timestamps.doorOpenStart + ratio * (timestamps.thresholdCross - timestamps.doorOpenStart);
  }
  if (p <= scrollMap.crossThreshold[1]) {
    // 0.55 -> 0.72 maps to 6.5s -> 9.5s
    const ratio = (p - scrollMap.crossThreshold[0]) / (scrollMap.crossThreshold[1] - scrollMap.crossThreshold[0]);
    return timestamps.thresholdCross + ratio * (timestamps.interiorVortex - timestamps.thresholdCross);
  }
  if (p <= scrollMap.vortexFade[1]) {
    // 0.72 -> 0.832 maps to 9.5s -> 12.5s
    const ratio = (p - scrollMap.vortexFade[0]) / (scrollMap.vortexFade[1] - scrollMap.vortexFade[0]);
    return timestamps.interiorVortex + ratio * (timestamps.blackoutStart - timestamps.interiorVortex);
  }
  // 0.832 -> 1.00 maps to 12.5s -> 15.02s (blackout void)
  const ratio = (p - scrollMap.blackoutVoid[0]) / (scrollMap.blackoutVoid[1] - scrollMap.blackoutVoid[0]);
  return timestamps.blackoutStart + ratio * (timestamps.videoEnd - timestamps.blackoutStart);
}
```

**Step 5: Update `mediaPreloader.ts` to cache the new assets**
Add `/assets/hero_scroll_poster.jpg` and `/assets/hero_scroll_cinematic.mp4` to the preload manifest.

**Step 6: Commit**
```bash
git add public/assets/hero_scroll_cinematic.mp4 public/assets/hero_scroll_poster.jpg src/config/heroTimeline.ts src/utils/mediaPreloader.ts
git commit -m "feat(assets): integrate hero cinematic, extract frame 0 poster, and configure timeline"
```

---

### Task 2: Performance-Oriented Scroll-to-Video Scrubbing Utility (LERP + Throttled Seeks)

**Files:**
- Create: `src/utils/videoScrollScrubber.ts`

**Step 1: Implement LERP-based Video Scrubber**
Core mechanic:
`scroll -> target progress -> mapScrollProgressToVideoTime -> targetTime -> LERP -> video.currentTime` inside `requestAnimationFrame`.
Avoid seek thrashing by checking if the time difference exceeds an empirically tuned threshold (`0.035s`, approx 1 frame at 24fps) before touching `video.currentTime`. Use `fastSeek()` only where supported and beneficial.

**Step 2: Commit**
```bash
git add src/utils/videoScrollScrubber.ts
git commit -m "feat(perf): create lerp-smoothed video scroll scrubber utility"
```

---

### Task 3: Transform `HeroSection.tsx` into Interactive Scroll Stage

**Files:**
- Modify: `src/components/HeroSection.tsx:1-336`
- Modify: `src/styles/hero.css:1-368`

**Step 1: Re-architect HeroSection container structure**
Transform `HeroSection` into a sticky scroll track:
- Outer wrapper: `<section ref={heroTrackRef} className="hero-scroll-track">` with height configured from `HERO_VIDEO_CONFIG.initialTrackHeightVhDesktop` (260vh) and mobile (220vh).
- Sticky viewport: `<div className="hero-sticky-stage">` with `position: sticky; top: 0; height: 100dvh; width: 100%; overflow: hidden;`.
- Background Video:
  ```tsx
  <video
    ref={videoRef}
    src={HERO_VIDEO_CONFIG.src}
    poster={HERO_VIDEO_CONFIG.poster}
    className="hero-cinematic-video"
    muted
    playsInline
    preload="auto"
  />
  ```
- Poster Typography & Metadata fade:
  - At scroll = 0.00: 100% visible, crisp film poster style.
  - Between `scrollMap.typographyFade[0]` (0.04) and `scrollMap.typographyFade[1]` (0.25):
    - Opacity decreases smoothly from 1.0 to 0.0.
    - Transform translates upward slightly (`translate3d(0, -28px, 0) scale(1.03)`) to reinforce the camera's forward push.
- At `scrollMap.blackoutVoid[0]` (0.832) to 1.00:
  - Video enters deep interior blackout.
  - Screen is pure `#000000`.

**Step 2: Update `src/styles/hero.css`**
Add styles for `.hero-scroll-track`, `.hero-sticky-stage`, `.hero-cinematic-video`, and GPU-composited overlay layers.

**Step 3: Test build & verify types**
Run `npm run build` or `npx tsc -b`.

**Step 4: Commit**
```bash
git add src/components/HeroSection.tsx src/styles/hero.css
git commit -m "feat(hero): transform hero into interactive scroll-driven cinematic stage"
```

---

### Task 4: Seamless Gateway Connection into Section 1 (`GuestStorytellingTransition.tsx`)

**Files:**
- Modify: `src/components/GuestStorytellingTransition.tsx` (seam/gateway positioning only)
- Modify: `src/styles/storytelling.css:1-120`
- Modify: `src/pages/HomePage.tsx:40-55`

**Step 1: Seamless Blackout Handoff (STRICT PRESERVATION RULE)**
- Modify ONLY the minimum wrapper/style/positioning required for seamless Hero handoff.
- Do NOT alter existing storytelling logic, animation sequence, content, timing, or media behavior of `GuestStorytellingTransition.tsx`.
- Eliminate any visual seams, borders, or margins between the Hero track and Section 1 container.
- Both containers share `background-color: #000000`.

**Step 2: Run TypeScript and build verification**
Run: `npm run build`
Expected: 0 errors.

**Step 3: Commit**
```bash
git add src/components/GuestStorytellingTransition.tsx src/styles/storytelling.css src/pages/HomePage.tsx
git commit -m "feat(transition): establish seamless pitch-black gateway from hero door into section 1"
```

---

### Task 5: End-to-End Browser Audit & Tuning (LERP / Threshold / Track Height)

**Files:**
- Test in browser: `http://localhost:5173/`

**Step 1: Check poster-to-video visual parity at scroll = 0**
- Verify zero flicker, zero color shift, zero layout jump when video metadata loads.

**Step 2: Profile scroll dynamics across patterns**
- Slow scroll: Smooth gradual camera motion, typography dissolves gracefully.
- Rapid flick scroll: No decode freeze, LERP settles smoothly.
- Reverse scroll: Camera flies smoothly backward out of the building.
- Tune `lerpFactor` (0.15 - 0.22), `seekThreshold` (0.025s - 0.045s), and track height (260vh - 280vh) based on tactile feel.

**Step 3: Check mobile responsiveness & touch feel**
- Verify touch drag scrolling on mobile viewports (<768px).
- Verify 2-column schedule dock in Section 1 and headline readability in Hero.
- Confirm 0 audio clipping or unhandled autoplay rejections.

**Step 4: Run full production build**
Run: `npm run build`
Verify output bundle sizes and clean compilation.

**Step 5: Commit**
```bash
git add -A
git commit -m "chore(release): verify interactive scroll hero and section 1 gateway flow"
```
