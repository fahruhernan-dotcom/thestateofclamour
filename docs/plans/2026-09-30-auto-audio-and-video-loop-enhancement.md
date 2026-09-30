# Auto-On Audio & Infinite Video Loop Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove all visual sound/volume toggle icon buttons across Section 1 and Section 2 for an uncluttered aesthetic, ensure Section 1's recap video continuously loops indefinitely without freezing, enable Section 1 audio auto-on/always-on, and configure Section 2 card audio to play exclusively when hovered by the cursor.

**Architecture:** 
1. **Purge Visual Sound Icons:** Remove `<Volume2>` and `<VolumeX>` toggle button elements, tooltips, and associated button CSS from Section 1 ([`GuestStorytellingTransition.tsx`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/components/GuestStorytellingTransition.tsx)) and Section 2 ([`LineupSection.tsx`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/components/LineupSection.tsx)).
2. **Infinite Video Looping for Section 1:** Remove restrictive pause logic (such as pausing when scroll progress >= 0.88), retain native `loop`, and bind an explicit `onEnded` recovery handler so that Section 1's `how2026_recap.mp4` continuously plays in a seamless loop.
3. **Always-On Audio for Section 1:** Auto-unmute Section 1's audio upon standard user interaction (scroll, touch, wheel, click) so that audio is always on when viewing Section 1, without requiring any icon clicks.
4. **Hover-Activated Audio for Section 2:** In Section 2, audio is muted by default. When the user hovers their cursor over an artist card (`onMouseEnter` on desktop / tap on mobile), that card's audio unmutes and plays at `volume = 0.95`, immediately silencing Section 1. When the cursor leaves the card (`onMouseLeave`), the card's audio mutes back to silent.

**Tech Stack:** React 18, TypeScript, HTML5 Media Elements (`<video>`), Custom Event Audio Coordinator (`audioCoordinator.ts`), Pure CSS.

---

### Task 1: Remove Sound Icons & Tooltips from Section 1 (Storytelling)

**Files:**
- Modify: [`src/components/GuestStorytellingTransition.tsx`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/components/GuestStorytellingTransition.tsx)
- Modify: [`src/styles/storytelling.css`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/styles/storytelling.css)

**Step 1: Remove Volume icons import and toggle button JSX**
- In `GuestStorytellingTransition.tsx`:
  - Remove `Volume2, VolumeX` from `'lucide-react'` import.
  - Remove `story-sound-toggle-btn` button element at the bottom of the JSX.
  - Remove `onClick={handleToggleSound}` and cursor/title attributes from `.storytelling-photo-frame`.
  - Remove manual state variables that were only used for the button UI (`isAudioMuted`, `isAudioMutedRef`).

**Step 2: Clean up obsolete CSS in `storytelling.css`**
- Delete or clean rules for `.story-sound-toggle-btn`, `.story-sound-toggle-btn:hover`, `.story-sound-toggle-btn.is-active`, `.story-sound-toggle-btn.is-muted-hint`.

**Step 3: Verification**
- Verify TypeScript builds cleanly: `npm run build`.
- Inspect Section 1 in browser: no floating speaker/volume button is rendered anywhere in Section 1.

---

### Task 2: Guarantee Infinite Looping & Always-On Audio for Section 1 Video

**Files:**
- Modify: [`src/components/GuestStorytellingTransition.tsx`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/components/GuestStorytellingTransition.tsx)

**Step 1: Remove premature video pause restrictions**
- In `checkAudioPlayback`:
  - Remove the check `targetProgressRef.current < 0.88` which previously paused playback during the climax hold.
  - Ensure the video element continues running: `if (video.paused) video.play().catch(() => {});`.
- Add an explicit `onEnded` handler on `<video ref={photoImgRef}>`:
  ```tsx
  onEnded={() => {
    if (photoImgRef.current) {
      photoImgRef.current.currentTime = 0;
      photoImgRef.current.play().catch(() => {});
    }
  }}
  ```
- Ensure attributes: `autoPlay`, `loop`, `muted={false}` (unmuted once auto-on triggers), `playsInline`, `preload="auto"`.

**Step 2: Always-on audio unlock**
- On user interactions (`scroll`, `wheel`, `pointerdown`, `touchstart`, `keydown`), automatically attempt `video.muted = false` and `video.volume = 0.95` when in Section 1, without requiring any button interaction.

**Step 3: Verification**
- Observe the video at progress 0.0 through 1.0; verify the video never stops or freezes at the end and repeats smoothly forever. Audio plays automatically as soon as user touches or scrolls the page.

---

### Task 3: Remove Sound Icons & Tooltips from Section 2 (Lineup)

**Files:**
- Modify: [`src/components/LineupSection.tsx`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/components/LineupSection.tsx)
- Modify: [`src/styles/lineup.css`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/styles/lineup.css)

**Step 1: Remove Volume icons import and toggle button JSX**
- In `LineupSection.tsx`:
  - Remove `Volume2, VolumeX` from `'lucide-react'` import.
  - Remove the `<button className="guest-flyer-sound-btn">` element inside `LineupCardItem`.
  - Remove sound toggle click delegation from `.guest-portrait-frame`.
- In `lineup.css`:
  - Clean up `.guest-flyer-sound-btn`, `:hover`, `.is-active`, `.is-muted-hint`, and related animation keyframes.

**Step 2: Verification**
- Run `npm run build`.
- Check artist cards in browser: flyer covers are clean without floating circular audio buttons.

---

### Task 4: Configure Cursor Hover-Activated Audio in Section 2

**Files:**
- Modify: [`src/components/LineupSection.tsx`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/components/LineupSection.tsx)
- Modify: [`src/utils/audioCoordinator.ts`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/utils/audioCoordinator.ts)

**Step 1: Hover-in triggers unmuted card audio**
- In `LineupCardItem`:
  - Track `isHovered` state on the card (via `handleCardMouseEnter` and `handleCardMouseLeave`).
  - When `isHovered` is true (cursor enters the card):
    - Call `silenceSec1()` and `setAudioOwner('sec2-lineup')`.
    - Set `video.volume = 0.95`, `video.muted = false`, and call `video.play()`.
    - Set `isPlayingAudio(true)`.
  - When `isHovered` is false (cursor leaves the card):
    - Set `video.muted = true` and `isPlayingAudio(false)`.
    - If no other card is hovered, set audio owner back to `'none'`.
  - On mobile/touch:
    - `onTouchStart` sets the card as hovered/active so mobile users get sound when tapping a card.

**Step 2: Verification**
- Move cursor over Far or Malvin card: audio immediately starts and plays cleanly.
- Move cursor away from the card: audio immediately mutes to silent.
- Move cursor to another card: audio switches immediately to the new card.

---

### Task 5: Final Production Verification & Quality Check

**Files:**
- Verify: Full project build (`tsc -b && vite build`)
- Test: Local browser verification on `http://localhost:5173/`

**Step 1: Compile bundle**
Run: `npm run build`
Expected: 0 errors, successful production build.

**Step 2: Browser verification**
- Visually verify: Zero volume icon buttons on Section 1 or Section 2.
- Looping verify: Section 1 recap video loops continuously without interruption.
- Audio verify:
  - Section 1 audio is auto-on / always on when in Section 1.
  - Section 2 audio activates only when hovering over an artist card, and mutes when the cursor leaves.
