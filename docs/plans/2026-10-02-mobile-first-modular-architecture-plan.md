# Mobile-First Modular Architecture & Mobile View Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Establish an isolated, ultra-responsive mobile experience for The State of Clamour across all sections with dedicated mobile components/modules, ensuring zero regression to the existing desktop view.

**Architecture:** 
- Separate mobile-specific views and stylesheets under `src/components/mobile/` and `src/styles/mobile/`, keeping desktop code completely isolated and untouched.
- Implement an adaptive viewport detector `useIsMobile()` hook with zero layout thrashing and SSR/hydration resilience.
- Provide tailored mobile interactions: uncropped vertical poster establishing shot, smooth entrance transition, 2-column mobile lineup schedule dock, touch-drag carousel with native momentum, and full thumb-zone ergonomic adherence.

**Tech Stack:** React 19, TypeScript, Vanilla CSS3 (Custom Properties & Tokens), Lucide Icons, Vite.

---

### Task 1: Viewport Detection Hook & Architecture Foundation

**Files:**
- Create: `src/hooks/useIsMobile.ts`
- Create: `src/styles/mobile/mobileTokens.css`

**Step 1: Create `useIsMobile.ts` Hook**
Implement a resilient, passive `window.matchMedia` hook that triggers re-renders only on boundary crossing (`< 768px`):

```typescript
import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const updateMatch = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    updateMatch(mediaQuery);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMatch);
      return () => mediaQuery.removeEventListener('change', updateMatch);
    } else {
      mediaQuery.addListener(updateMatch);
      return () => mediaQuery.removeListener(updateMatch);
    }
  }, []);

  return isMobile;
};
```

**Step 2: Create Mobile Token Variables in `src/styles/mobile/mobileTokens.css`**
Define safe area insets and thumb-zone metrics:

```css
:root {
  --mobile-touch-target-min: 44px;
  --mobile-thumb-bottom-inset: max(1.25rem, env(safe-area-inset-bottom, 20px));
  --mobile-safe-top-inset: max(1rem, env(safe-area-inset-top, 16px));
  --mobile-gutter: 1.25rem;
}
```

**Step 3: Verification**
Run: `npm run build`
Expected: Build succeeds with 0 errors.

**Step 4: Commit**
```bash
git add src/hooks/useIsMobile.ts src/styles/mobile/mobileTokens.css
git commit -m "feat(mobile): add isolated useIsMobile hook and mobileTokens"
```

---

### Task 2: Dedicated Mobile Hero & Storytelling Component (`HeroSectionMobile.tsx`)

**Files:**
- Create: `src/components/mobile/HeroSectionMobile.tsx`
- Create: `src/styles/mobile/hero.mobile.css`
- Modify: `src/components/HeroSection.tsx` (Route to `HeroSectionMobile` when `isMobile === true`)

**Step 1: Write `src/styles/mobile/hero.mobile.css`**
- 100% full-bleed vertical portrait establishing poster (`hero_scroll_poster_mobile.jpg`).
- Perfectly framed typography: `THE STATE OF CLAMOUR` and `SWEAR IN CONTINENTAL` with zero horizontal cut-off.
- Smooth scroll unmasking into the central portal video.
- 2-Column schedule dock at the bottom with high-contrast dates (`30 OCT MALVIN`, `31 OCT FAR`).
- Zero dependencies on desktop canvas sequence or desktop multi-cluster layout.

**Step 2: Implement `HeroSectionMobile.tsx`**
- Lightweight, battery-conscious scroll listener using passive events.
- Smooth CSS transform transitions (`translateY`, `scale`, `opacity`) using GPU hardware acceleration.
- Mutual exclusion audio coordinator integration (`silenceSec1`, `setAudioOwner`).

**Step 3: Connect Adaptive Wrapper in `HeroSection.tsx`**
- When `useIsMobile()` returns true, render `<HeroSectionMobile {...props} />`.
- When false, render existing desktop code unchanged.

**Step 4: Verification**
Run: `npm run build`
Expected: Build passes with 0 errors. Test mobile viewport in browser (393px width).

**Step 5: Commit**
```bash
git add src/components/mobile/HeroSectionMobile.tsx src/styles/mobile/hero.mobile.css src/components/HeroSection.tsx
git commit -m "feat(hero): extract dedicated HeroSectionMobile with isolated portrait framing"
```

---

### Task 3: Dedicated Mobile Lineup & Guest Carousel (`LineupSectionMobile.tsx`)

**Files:**
- Create: `src/components/mobile/LineupSectionMobile.tsx`
- Create: `src/styles/mobile/lineup.mobile.css`
- Modify: `src/components/LineupSection.tsx` (Delegate mobile view cleanly)

**Step 1: Write `src/styles/mobile/lineup.mobile.css`**
- Touch-first snap carousel optimized for one-hand swipe.
- Peek affordance (`84vw` card width, leaving `16vw` visible peek for the next artist).
- Live concert strobe flash on touch tap (`filter: brightness(1.3) contrast(1.15)`).
- Tap-to-play audio preview with animated 3-bar soundwave equalizer badge.
- Sticky active day indicator (`DAY 1 // 30 OCT` vs `DAY 2 // 31 OCT`).

**Step 2: Implement `LineupSectionMobile.tsx`**
- Direct touch event handling (`onTouchStart`, `onTouchMove`, `onTouchEnd`) with inertia and bounds snapping.
- Clean memoized artist card rendering without desktop 3D perspective mouse tilt overhead.
- Direct modal / night event routing (`LIHAT DETAIL EVENT →`).

**Step 3: Connect in `LineupSection.tsx`**
- Delegate when `isMobile` is active, keeping desktop 2-column grid intact.

**Step 4: Verification**
Run: `npm run build`
Expected: Build passes with 0 errors.

**Step 5: Commit**
```bash
git add src/components/mobile/LineupSectionMobile.tsx src/styles/mobile/lineup.mobile.css src/components/LineupSection.tsx
git commit -m "feat(lineup): isolate mobile carousel into dedicated LineupSectionMobile"
```

---

### Task 4: Mobile Ticket & Passage Section Ergonomics (`TicketSectionMobile.tsx`)

**Files:**
- Create: `src/components/mobile/TicketSectionMobile.tsx`
- Create: `src/styles/mobile/tickets.mobile.css`
- Modify: `src/components/TicketSection.tsx`

**Step 1: Write `src/styles/mobile/tickets.mobile.css`**
- Vertical stacked pass cards (thumb-friendly cards with high visual clarity).
- Large 48px touch CTA: `BELI TIKET // Rp129.000 →`.
- Embossed official admission seal positioned cleanly without overflowing screen edges.
- Active tier pulsating amber status indicator: `"TIER AKTIF · KUOTA CEPAT MENIPIS"`.

**Step 2: Implement `TicketSectionMobile.tsx`**
- Optimized for quick scrolling and immediate purchase action without complex desktop cursor foil sheen overhead.

**Step 3: Connect in `TicketSection.tsx`**

**Step 4: Verification**
Run: `npm run build`
Expected: Build passes with 0 errors.

**Step 5: Commit**
```bash
git add src/components/mobile/TicketSectionMobile.tsx src/styles/mobile/tickets.mobile.css src/components/TicketSection.tsx
git commit -m "feat(tickets): implement dedicated TicketSectionMobile with thumb-first CTA"
```

---

### Task 5: Mobile Detail Acara & Protocols Accordion (`StageRundownMobile.tsx` & `RulesFAQMobile.tsx`)

**Files:**
- Create: `src/components/mobile/StageRundownMobile.tsx`
- Create: `src/components/mobile/RulesFAQMobile.tsx`
- Create: `src/styles/mobile/dossier.mobile.css`
- Modify: `src/components/StageRundown.tsx`
- Modify: `src/components/RulesFAQ.tsx`

**Step 1: Write `src/styles/mobile/dossier.mobile.css`**
- Editorial timetable list with clean day toggles (`30 OKT` / `31 OKT`).
- High-contrast venue badges (`MIZU COMMONROOM`) and artist set times.
- Accordion for protocols with smooth CSS grid expansion (`grid-template-rows: 0fr -> 1fr`) and rotating brass icons.
- Mobile protocol acknowledgment button with animated gold checkmark.

**Step 2: Implement components and connect in parent files**

**Step 3: Verification**
Run: `npm run build`
Expected: Build passes with 0 errors.

**Step 4: Commit**
```bash
git add src/components/mobile/StageRundownMobile.tsx src/components/mobile/RulesFAQMobile.tsx src/styles/mobile/dossier.mobile.css src/components/StageRundown.tsx src/components/RulesFAQ.tsx
git commit -m "feat(mobile): add dedicated mobile views for StageRundown and RulesFAQ"
```

---

### Task 6: End-to-End Mobile Audit & Verification

**Files:**
- Test across mobile viewport matrices:
  - Small Mobile: 360 × 640 (Android Entry)
  - Standard Mobile: 393 × 852 (iPhone 15/16 Pro)
  - Large Mobile: 428 × 926 (iPhone Plus / Max)
- Inspect:
  - Zero horizontal overflow (`window.innerWidth === document.documentElement.scrollWidth`).
  - All text headlines cleanly contained with zero clipping.
  - Smooth 60fps touch gestures and audio coordinator mutual exclusion.
  - Desktop view remains 100% identical and undisturbed.

**Step 1: Verification Commands**
- Run: `npm run build`
- Run local dev server and conduct responsive device emulation tests.

**Step 2: Final Commit & Vault Context Update**
- Commit all finalized changes.
- Update `D:\Dokumen\02_Kerja_Profesional\Myself\Vault\Lemonaru\00_Meta\Antigravity Logs\HOW Parkun\ActiveContext.md` with session milestone details.
