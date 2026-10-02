# Mobile Logic, Audio Coordination & Performance Audit Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Resolve all identified logic bugs across mobile gesture handling, audio autoplay rejection recovery, section audio boundary collision, broken anchor navigation, offscreen resource waste, and breakpoint mismatch.

**Architecture:** 
1. Harden `audioCoordinator.ts` with autonomous playback rejection recovery (`muted = true` fallback).
2. Wire `canSec2PlayAudio()` into `LineupSectionMobile.tsx` to eliminate Section 1 & Section 2 audio overlap.
3. Align `#hero` anchor ID across mobile and desktop for navbar brand navigation.
4. Add offscreen viewport pause and rAF skipping to `HeroSectionMobile.tsx` for optimal mobile performance and battery efficiency.
5. Guard video blob prefetching in `mediaPreloader.ts` on mobile devices.
6. Synchronize `useIsMobile.ts` breakpoint with `@media (max-width: 768px)` CSS rules.

**Tech Stack:** React 18, TypeScript, Vite, Web Audio / HTML5 Video APIs, CSS Pointer & Touch Events.

---

### Task 1: Fix Autoplay Policy Rejection & Video Freeze in `audioCoordinator.ts`

**Files:**
- Modify: `src/utils/audioCoordinator.ts:110-128`

**Step 1: Inspect `crossfadeVideos` implementation**
Currently, when `incoming.muted` is set to `false` and `incoming.play()` is invoked without a direct touch gesture (such as during carousel scroll snap), mobile Safari and Chrome reject the promise with `NotAllowedError`. Since the `.catch()` block is empty, the video element remains unmuted and frozen in a paused state.

**Step 2: Add autonomous muted fallback recovery**
In `src/utils/audioCoordinator.ts`, update `crossfadeVideos`:
```ts
    if (incoming.paused) {
      incoming.play().catch(() => {
        // Mobile Safari & Chrome autoplay rejection safeguard:
        // If unmuted playback is rejected during scroll/snap, immediately restore muted = true
        // so the visual video keeps looping smoothly without freezing on screen.
        incoming.muted = true;
        incoming.play().catch(() => {});
      });
    }
```

**Step 3: Verify TypeScript compilation**
Run: `npm run build`
Expected: PASS

---

### Task 2: Coordinate Section 1 & Section 2 Audio Transition in `LineupSectionMobile.tsx`

**Files:**
- Modify: `src/components/mobile/LineupSectionMobile.tsx:4-13`
- Modify: `src/components/mobile/LineupSectionMobile.tsx:169-195`

**Step 1: Import `canSec2PlayAudio`**
In `src/components/mobile/LineupSectionMobile.tsx`, add `canSec2PlayAudio` to the import from `../../utils/audioCoordinator`.

**Step 2: Guard audio initiation with `canSec2PlayAudio()`**
In `checkLineupVisibility`:
```ts
    if (inView) {
      if (isSec1AudioActive()) {
        silenceSec1({ duration: 300 });
      }
      // Only start Section 2 audio if Section 1 has cleared sufficiently or audio is allowed
      if (!currentPlayingIdRef.current && canSec2PlayAudio()) {
        const targetArtist = artists[activeCardIndex] || artists[0];
        if (targetArtist) {
          playArtistAudio(targetArtist.id);
        }
      }
    } else {
      if (currentPlayingIdRef.current !== null) {
        stopArtistAudio();
      }
    }
```

**Step 3: Verify TypeScript compilation**
Run: `npm run build`
Expected: PASS

---

### Task 3: Unify Hero Section ID for Mobile Navigation in `HeroSectionMobile.tsx`

**Files:**
- Modify: `src/components/mobile/HeroSectionMobile.tsx:668-675`
- Modify: `src/utils/audioCoordinator.ts:140-145`
- Modify: `src/utils/audioCoordinator.ts:218-223`
- Modify: `src/utils/audioCoordinator.ts:239-245`

**Step 1: Set `id="hero"` on `HeroSectionMobile`**
In `src/components/mobile/HeroSectionMobile.tsx`:
```tsx
    <section
      ref={trackRef}
      id="hero"
      data-section="hero-mobile"
      className="hero-mobile-track"
      aria-label="The State of Clamour // Swear In Continental (Mobile)"
    >
```

**Step 2: Update `audioCoordinator.ts` selector helpers**
In `src/utils/audioCoordinator.ts`, ensure selectors search for `#hero` (which now matches both desktop and mobile), while keeping `#hero-mobile` as a backwards-compatible alias:
```ts
const sec1 = document.getElementById('hero') || document.getElementById('hero-mobile');
```

**Step 3: Verify `#hero` navigation**
Ensure clicking `<a href="#hero" className="nav-brand-title">` smoothly scrolls to the top on mobile.

---

### Task 4: Throttle Offscreen Background Processing & Pause Hidden Video in `HeroSectionMobile.tsx`

**Files:**
- Modify: `src/components/mobile/HeroSectionMobile.tsx:569-625`

**Step 1: Add offscreen viewport pause and rAF throttling**
In `onScroll` inside `HeroSectionMobile.tsx`:
```ts
    const onScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();

      // If the hero track is completely offscreen (scrolled past), pause recap video to save GPU/battery
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) {
        if (recapVideo && !recapVideo.paused) {
          recapVideo.pause();
        }
        return;
      }

      // Resume recap video playback when scrolling back into view
      if (recapVideo && recapVideo.paused && targetProgress >= 0.26) {
        recapVideo.play().catch(() => {});
      }

      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = currentScroll / scrollableDistance;
      targetProgress = Math.max(0, Math.min(1, rawProgress));

      updateAudioVolume(targetProgress, rect);
      requestTick();
    };
```

**Step 2: Restrict `unlockOnGesture` to visible Hero range**
In `unlockOnGesture`, only attempt to play or unmute `recapVideo` if `targetProgress >= 0.20 && targetProgress <= 0.98` and the section is in view (`rect.bottom >= 0 && rect.top <= window.innerHeight`).

---

### Task 5: Guard Heavy Background Video Blob Prefetching on Mobile in `mediaPreloader.ts`

**Files:**
- Modify: `src/utils/mediaPreloader.ts:175-189`

**Step 1: Check mobile status before background fetching MP4 blobs**
In `startBackgroundPreloadRemaining()`:
```ts
export const startBackgroundPreloadRemaining = () => {
  // Mobile devices stream video progressively via native HTML5 Range requests.
  // Avoid buffering 17.5MB of background video blobs into mobile RAM/cellular data.
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
  if (isMobile) return;

  const remaining = ['/assets/guest_malvin.mp4', '/assets/guest_far.mp4'];
  remaining.forEach(async (url) => {
    try {
      const resp = await fetch(url);
      if (resp.ok) {
        const blob = await resp.blob();
        cachedBlobUrls.set(url, URL.createObjectURL(blob));
      }
    } catch {
      // Non-critical fallback
    }
  });
};
```

---

### Task 6: Standardize 768px Breakpoint Consistency in `useIsMobile.ts`

**Files:**
- Modify: `src/hooks/useIsMobile.ts:13-33`

**Step 1: Align matchMedia query with `@media (max-width: 768px)`**
In `src/hooks/useIsMobile.ts`:
Change:
```ts
window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
```
To:
```ts
window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
```
And fallback:
```ts
return window.innerWidth <= MOBILE_BREAKPOINT;
```
This ensures screen widths of exactly 768px (e.g. tablet portrait) match both React's `isMobile` logic and CSS `@media (max-width: 768px)` rules without layout dissonance.

---

### Task 7: Add Keyboard Accessibility Handler in `LineupSectionMobile.tsx`

**Files:**
- Modify: `src/components/mobile/LineupSectionMobile.tsx:254-268`

**Step 1: Add `onKeyDown` to `.lineup-mobile-card`**
```tsx
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerFlash(artist.id);
      handleOpenArtistDetail(artist);
    }
  }}
```

---

### Task 8: End-to-End Build and Verification

**Step 1: Production bundle build**
Run: `npm run build`
Expected: 0 TypeScript errors, successful Vite bundling.

**Step 2: Commit all fixes**
Commit: `fix(mobile): resolve audio autoplay rejection, section overlap, and offscreen performance leaks`
