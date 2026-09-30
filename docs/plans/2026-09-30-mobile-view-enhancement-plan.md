# Mobile View Comprehensive Enhancement Plan

> **Goal:** Transform the mobile experience (<= 768px and <= 480px) into an ultra-responsive, touch-native, cinematic editorial showcase with interactive touch spotlight horror reveals, dynamic viewport height stabilization, sleek mobile navigation drawer, and thumb-friendly ergonomics.

**Architecture:**
- **Touch-Native Event System:** Extend `HeroSection.tsx` direct-DOM spotlight with `onTouchStart`, `onTouchMove`, and `onTouchEnd`, scaling down the spotlight mask radius for mobile screens (~140px radius) and adding a subtle initial breathing reveal so mobile users immediately discover the hidden horror layer.
- **Dynamic Viewport Height & Typographic Hierarchy:** Replace static `100vh` in hero and transitions with `100svh` / `100dvh` and safe area insets (`env(safe-area-inset-*)`). Tune typographic clamps in `responsive.css` and `hero.css` so dominant headlines and metadata fit balanced on narrow devices (320px–430px) without overflowing.
- **Editorial Mobile Navigation Drawer:** Add a minimalist hairline menu toggle and frosted glass drawer (`rgba(6, 7, 9, 0.96)` with `backdrop-filter: blur(24px)`) in `FloatingNavbar.tsx`, allowing mobile users to access Bintang Tamu, Tiket Acara, Jadwal Acara, and the Official Dossier.
- **Touch Ergonomics & Micro-Interactions:** Apply minimum 48px touch targets, `:active` tactile presses, and `-webkit-tap-highlight-color: transparent` across all artist cards, audio preview triggers, ticket tier passes, and CTA buttons.

**Tech Stack:** React, TypeScript, CSS Custom Properties, Direct DOM Mutation (rAF), Hardware-composited `clip-path` & CSS Masking.

---

### Task 1: Hero Section Touch Spotlight Horror Reveal & Mobile Viewport Tuning

**Files:**
- Modify: `src/components/HeroSection.tsx`
- Modify: `src/styles/hero.css`
- Modify: `src/styles/responsive.css`

**Step 1: Add Touch Support & Adaptive Spotlight Radius in `HeroSection.tsx`**
- Bind `onTouchStart`, `onTouchMove`, and `onTouchEnd` on `heroRef`.
- Detect viewport width: on mobile screens (`< 768px`), reduce spotlight mask radius from `260px` to `140px` (or `130px` on `< 480px`) so the flashlight effect is tightly focused under the user's thumb instead of washing out the entire phone screen.
- On initial mobile page load, if no touch has occurred, gently pulse an ambient reveal spot near the central entrance for 2.5 seconds to tease the horror character, then fade out until user interacts.
- Prevent scroll stuttering during horizontal touch drag (`touch-action: pan-y`).

**Step 2: Update Hero CSS for Mobile Poster Typography & `100svh`**
- In `hero.css` and `responsive.css`, add media queries for `<= 768px` and `<= 480px`:
  ```css
  @media (max-width: 768px) {
    .hero-editorial-section {
      min-height: 100svh;
      padding: 1.5rem 1.15rem env(safe-area-inset-bottom);
    }
    .hero-editorial-headline {
      font-size: clamp(2.2rem, 9.4vw, 3.6rem);
      line-height: 1.02;
      letter-spacing: 0.04em;
    }
    .hero-identity-label {
      font-size: 0.6875rem;
      letter-spacing: 0.28em;
      margin-bottom: 0.85rem;
    }
    .hero-poster-spacer {
      min-height: clamp(60px, 14vh, 140px);
    }
    .hero-poster-meta {
      font-size: 0.6875rem;
      letter-spacing: 0.22em;
      margin-bottom: 1.5rem;
    }
    .hero-minimal-cta {
      padding: 0.65rem 1.25rem;
      font-size: 0.78rem;
      letter-spacing: 0.28em;
      min-height: 48px;
    }
  }
  ```

**Step 3: Verification**
- In Chrome DevTools (Device Mode: iPhone 14 Pro 393x852 & iPhone SE 375x667):
  - Drag finger across hero $\rightarrow$ spotlight follows thumb smoothly at 140px radius.
  - Release finger $\rightarrow$ spotlight fades cleanly.
  - Content fits within 100svh without being pushed below the fold.

---

### Task 2: Section 2 Storytelling Mobile Refinements (Safe Insets & Small Screen Fit)

**Files:**
- Modify: `src/components/GuestStorytellingTransition.tsx`
- Modify: `src/styles/storytelling.css`

**Step 1: Adaptive Sizing for Small Mobile Screens**
- In `GuestStorytellingTransition.tsx`:
  - When `isMob` is true, calculate initial portrait height based on `window.innerHeight`:
    `const initialHeight = Math.min(vh * 0.38, 280);` for screens `< 480px` to guarantee generous vertical breathing room above and below the portrait card.
- In `storytelling.css`:
  - Add safe area insets to `.story-mobile-top`:
    `padding-top: max(0.5rem, env(safe-area-inset-top));`
  - Add safe area insets to `.story-mobile-bottom`:
    `margin-bottom: max(0.65rem, env(safe-area-inset-bottom));`
  - Welcome Climax for small screens (`<= 480px`):
    - `.story-welcome-title`: `font-size: clamp(1.5rem, 7.2vw, 2.1rem);`
    - `.story-welcome-narrative`: `font-size: 0.88rem; line-height: 1.55; max-width: 320px;`
    - `.story-welcome-meta`: `font-size: 0.55rem; letter-spacing: 0.16em; gap: 0.35rem;`
    - `.story-welcome-btn`: `min-height: 48px; width: 100%; max-width: 280px; font-size: 0.68rem;`

**Step 2: Verification**
- Test on 375x667 (iPhone SE) and 390x844 (iPhone 14):
  - Scroll from 0 to 42%: Image unmasks without touching top bar or bottom dock.
  - Scroll to 50% - 90%: "WELCOME TO THE ASSEMBLY" is centered, text does not overflow or clip off-screen, CTA button is comfortably tappable.

---

### Task 3: Floating Navbar Mobile Editorial Drawer

**Files:**
- Modify: `src/components/FloatingNavbar.tsx`
- Modify: `src/styles/navbar.css`

**Step 1: Add Mobile Menu Drawer State & Markup in `FloatingNavbar.tsx`**
- Add state: `const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);`
- Add a sleek minimal hamburger icon (`Menu` / `X` from `lucide-react`) visible only on mobile screens (`< 768px`).
- Add an expandable full-screen overlay/drawer:
  - Links:
    - BINTANG TAMU (`#the-guests`)
    - TIKET ACARA (`#the-passage`)
    - JADWAL ACARA (`#the-night`)
    - DETAIL EVENT / DOSSIER (`onOpenDossier`)
    - Direct Night 1 & Night 2 shortcuts
  - Automatically close drawer when a link is clicked.
  - Disable body scroll while drawer is open (`document.body.style.overflow = 'hidden'`).

**Step 2: Style the Frosted Glass Mobile Drawer in `navbar.css`**
- Fixed full-screen overlay with `background: rgba(6, 7, 9, 0.96)`, `backdrop-filter: blur(24px)`.
- Large, elegant monumental links with stagger fade-in animation and gold hairline dividers.
- Close button and "AMBIL TIKET" action button at the bottom with safe area padding.

**Step 3: Verification**
- On mobile view: Tap hamburger icon $\rightarrow$ smooth frosted glass drawer opens.
- Tap "TIKET ACARA" $\rightarrow$ drawer closes, page smoothly scrolls to tickets.
- Tap "DETAIL EVENT →" $\rightarrow$ drawer closes, full dossier page opens cleanly.

---

### Task 4: Lineup, Tickets, and Stage Rundown Mobile Touch Polish

**Files:**
- Modify: `src/styles/responsive.css`
- Modify: `src/styles/lineup.css`
- Modify: `src/styles/tickets.css`
- Modify: `src/styles/rundown.css`

**Step 1: Lineup Section Mobile Enhancements**
- Artist cards on mobile:
  - Add `:active` touch feedback: `transform: scale(0.985); transition: transform 120ms ease;`
  - Audio play button: ensure `min-width: 48px; min-height: 48px; border-radius: 50%;` for effortless thumb tapping.
  - Genre tags and performance time badges: enhance contrast and spacing so text never overlaps or clips.

**Step 2: Ticket Admission Passes Mobile Layout**
- Single-column stacked pass layout:
  - Clear visual distinction between Active (`ACQUIRE ADMISSION`) and Sold Out tiers.
  - Full-width acquire buttons (`min-height: 48px`, `font-size: 0.72rem`, `letter-spacing: 0.18em`).
  - Perks checklist: tight, legible bullet layout with gold check icons.

**Step 3: Stage Rundown & Event Gateway Mobile Layout**
- Event Gateway spotlight card:
  - Stack Night 1 and Night 2 cards cleanly with clear dates and venue tags.
  - Full-width action buttons ("INSPECT PROTOCOL // NIGHT 1 →").
- Timetable tab bar:
  - Add horizontal scroll indicator with smooth momentum swipe (`-webkit-overflow-scrolling: touch`).

---

### Task 5: Universal Touch Ergonomics & Clean Build Verification

**Files:**
- Modify: `src/index.css`
- Modify: `src/styles/tokens.css`

**Step 1: Universal Mobile UX Tokens**
- Set `-webkit-tap-highlight-color: transparent` globally on all interactive elements (`button`, `a`, `input`).
- Set `touch-action: manipulation` on buttons and links to eliminate the mobile 300ms tap delay.
- Add `user-select: none` on decorative stamps, kicker badges, and navigation bars to prevent accidental text highlight during scrolling.

**Step 2: Build & Production Bundle Verification**
- Run `npm run build` (`tsc -b && vite build`) to confirm zero compilation errors and clean bundling.

---

### Verification Matrix for Manual Testing (User Testing Checklist)

| Test Item | Device Preset | Expected Behavior |
| :--- | :--- | :--- |
| **Hero Touch Spotlight** | iPhone 14 Pro (393x852) | Dragging finger across the facade reveals the character under a 140px flashlight circle. Lifting finger fades spotlight. |
| **Hero Poster Fit** | iPhone SE (375x667) | Title, red door negative space, date/venue, and `ENTER →` fit inside screen without scrolling required. |
| **Storytelling Small Screen** | iPhone SE (375x667) | Unmasking photo doesn't clip with top/bottom pills. Climax Welcome text and CTA fit within screen. |
| **Mobile Nav Drawer** | Any mobile screen (< 768px) | Hamburger button opens full frosted menu. Tapping a section scrolls smoothly and closes menu. |
| **Lineup Audio Button** | Pixel 7 (412x915) | 48px audio button easily pressed with thumb; strobe flash triggers; audio plays/pauses. |
| **Ticket Passes** | iPhone 14 Pro | Cards stack vertically; "ACQUIRE ADMISSION" button is full-width, easy to tap. |
