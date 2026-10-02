# Mobile Audio Transition & Volume Control Refinement Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Resolve choppy audio stutter ("sound patah") on mobile view by introducing smooth S-curve volume crossfading between artist cards, adding scroll-snap settling debounce on horizontal swipe, smooth boundary fade-outs on vertical scroll, and integrating an interactive touch-friendly volume control toggle button on each mobile card.

**Architecture:**
- Leverage existing `fadeVideoVolume`, `cancelVideoFade`, `silenceSec1`, and `silenceSec2` from `src/utils/audioCoordinator.ts`.
- In `LineupSectionMobile.tsx`, replace instantaneous `vid.muted = true/false` hard-cuts with asynchronous smooth volume crossfading (`fadeVideoVolume` with 250ms fade-out and 300ms fade-in).
- Add scroll settling detection (debounce timer) in `handleScroll` of `LineupSectionMobile.tsx` so rapid finger swipes do not thrash audio states across cards.
- Add an interactive, tactile audio control button (`lineup-mobile-audio-toggle` with `Volume2` and `VolumeX` icons and 48px touch target) on each card in `LineupSectionMobile.tsx`.
- Enhance vertical section entry/exit transitions between `HeroSectionMobile` (Section 1) and `LineupSectionMobile` (Section 2) for zero acoustic clipping.

**Tech Stack:** React 19, TypeScript, Lucide React (`Volume2`, `VolumeX`), CSS3 transitions, HTML5 Video API, requestAnimationFrame, Vite.

---

### Task 1: Audit & Harden `audioCoordinator.ts` for Mobile Crossfading

**Files:**
- Modify: `src/utils/audioCoordinator.ts`

**Step 1: Inspect and enhance `fadeVideoVolume`**
Ensure `fadeVideoVolume` safely handles mobile WebKit quirks:
- If unmuting on mobile, ensure `video.play()` is invoked within the fade-in flow if paused.
- Support a smooth crossfade helper: `crossfadeVideos(outgoingVideo, incomingVideo, durationMs)` that ramps outgoing volume down to 0 while ramping incoming volume up to target (0.95), then mutes outgoing.

**Step 2: Add `crossfadeVideos` helper to `audioCoordinator.ts`**
```typescript
export const crossfadeVideos = (
  outgoing: HTMLVideoElement | null,
  incoming: HTMLVideoElement | null,
  targetVolume: number = 0.95,
  durationMs: number = 280,
  onComplete?: () => void
) => {
  if (outgoing && outgoing !== incoming && !outgoing.muted) {
    fadeVideoVolume(outgoing, 0, durationMs, () => {
      outgoing.muted = true;
    });
  }
  if (incoming) {
    cancelVideoFade(incoming);
    incoming.muted = false;
    fadeVideoVolume(incoming, targetVolume, durationMs, onComplete);
    if (incoming.paused) {
      incoming.play().catch(() => {});
    }
  }
};
```

**Step 3: Verification**
Run: `npm run build`
Expected: Build passes with 0 errors.

**Step 4: Commit**
```bash
git add src/utils/audioCoordinator.ts
git commit -m "feat(audio): add crossfadeVideos helper to audioCoordinator"
```

---

### Task 2: Implement Smooth Audio Crossfade & Scroll Settling in `LineupSectionMobile.tsx`

**Files:**
- Modify: `src/components/mobile/LineupSectionMobile.tsx`

**Step 1: Replace Instant Hard-Cuts with `crossfadeVideos` and `fadeVideoVolume`**
- In `playArtistAudio(artistId: string)`:
  - Find currently playing video (`videoRefs.current[activeAudioArtistId]`).
  - Find target video (`videoRefs.current[artistId]`).
  - Crossfade outgoing video to 0 and incoming video to 0.95.
  - Fade out any other running videos in `videoRefs.current` to 0 and mute them.
- In `stopArtistAudio()`:
  - For all active videos, smoothly ramp volume to 0 over 250ms with `fadeVideoVolume(v, 0, 250, () => { v.muted = true })` instead of slamming `vid.muted = true` instantaneously.

**Step 2: Add Settling Debounce in `handleScroll`**
- During horizontal swipe, user drags finger across multiple cards.
- Add `scrollSettlingTimerRef`:
  - When `handleScroll` calculates a new `closestIdx`, update `activeCardIndex` for visual UI immediately.
  - Delay audio transition by `75ms` (`setTimeout`). If user continues dragging to the next card before 75ms, cancel the previous timer (`clearTimeout`).
  - Only initiate audio crossfade once the carousel has settled on the card for 75ms.

**Step 3: Add Smooth Section Exit on Vertical Scroll**
- In `checkLineupVisibility`:
  - When Lineup goes out of view (`!inView`), call `stopArtistAudio()` which now smoothly fades out over 250ms.
  - When Lineup comes into view (`inView`), if Section 1 is active, smoothly silence Section 1, and if no artist is playing, gently fade in the centered card (`artists[activeCardIndex]`).

**Step 4: Verification**
Run: `npm run build`
Expected: PASS with 0 errors.

**Step 5: Commit**
```bash
git add src/components/mobile/LineupSectionMobile.tsx
git commit -m "fix(mobile): smooth audio crossfade and scroll-settling debounce in LineupSectionMobile"
```

---

### Task 3: Add Interactive Volume/Sound Toggle Button on Mobile Cards

**Files:**
- Modify: `src/components/mobile/LineupSectionMobile.tsx`
- Modify: `src/styles/mobile/lineup.mobile.css`

**Step 1: Add Lucide `Volume2` and `VolumeX` to `LineupSectionMobile.tsx`**
Import `Volume2` and `VolumeX` from `lucide-react`.

**Step 2: Add Audio Toggle Button JSX on each Card**
Place an interactive, prominent volume toggle button on the card (top-right of portrait frame or right side of kicker row):
```tsx
<button
  type="button"
  className={`lineup-mobile-audio-toggle ${isAudioPlaying ? 'is-active' : ''}`}
  onClick={(e) => {
    e.stopPropagation();
    handleToggleAudio(artist.id);
  }}
  aria-label={isAudioPlaying ? `Matikan audio preview ${artist.name}` : `Putar audio preview ${artist.name}`}
>
  {isAudioPlaying ? (
    <>
      <Volume2 size={16} className="audio-toggle-icon" />
      <span className="lineup-mobile-eq-bars">
        <span className="lineup-mobile-eq-bar b-1" />
        <span className="lineup-mobile-eq-bar b-2" />
        <span className="lineup-mobile-eq-bar b-3" />
      </span>
    </>
  ) : (
    <>
      <VolumeX size={16} className="audio-toggle-icon" />
      <span className="audio-toggle-label">AUDIO</span>
    </>
  )}
</button>
```

**Step 3: Define `handleToggleAudio`**
- If `activeAudioArtistId === artistId`:
  - Call `stopArtistAudio()`.
- Else:
  - Call `playArtistAudio(artistId)`.
  - Trigger light strobe flash `triggerFlash(artistId)`.

**Step 4: Style the Audio Toggle Button in `lineup.mobile.css`**
- Ensure 48px minimum touch surface for easy thumb tapping.
- Backdrop filter blur, antique gold hairline border, dark void background.
- Active state: Antique gold glow (`box-shadow: 0 0 15px rgba(197, 168, 105, 0.45)`).
- Tap feedback (`transform: scale(0.92)`).

**Step 5: Verification**
Run: `npm run build`
Expected: PASS with 0 errors.

**Step 6: Commit**
```bash
git add src/components/mobile/LineupSectionMobile.tsx src/styles/mobile/lineup.mobile.css
git commit -m "feat(mobile): add interactive audio toggle control on lineup cards"
```

---

### Task 4: Harmonize Boundary Transitions with `HeroSectionMobile.tsx`

**Files:**
- Modify: `src/components/mobile/HeroSectionMobile.tsx`

**Step 1: Check boundary fade alignment**
Ensure that when `silenceSec1` or `how:audio-sec1-silenced` is received:
- `HeroSectionMobile` cancels any video fade and applies `fadeVideoVolume(recapVideo, 0, 300, () => { recapVideo.muted = true })`.
- Ensure `HeroSectionMobile` does not abruptly snap `recapVideo.muted = true` when scrolling past the boundary into Lineup.

**Step 2: Verification & Test Build**
Run: `npm run build`
Expected: 0 errors, successful production bundle.

**Step 3: Commit**
```bash
git add src/components/mobile/HeroSectionMobile.tsx
git commit -m "fix(mobile): harmonize boundary audio fade between Hero and Lineup"
```

---

### Task 5: End-to-End Verification & Audio Experience Review

**Step 1: Run production build check**
Run `npm run build`.

**Step 2: Start local dev server and test simulated mobile viewport**
Run `npm run dev` and verify:
- Horizontal carousel swiping between cards plays smooth audio crossfades without pops or clicks.
- Dragging quickly past cards does not create stuttering audio.
- Tapping the audio toggle button cleanly toggles audio with smooth fade-in/fade-out.
- Vertical scroll between Hero recap video and Lineup cards transitions volume smoothly without hard cuts.
