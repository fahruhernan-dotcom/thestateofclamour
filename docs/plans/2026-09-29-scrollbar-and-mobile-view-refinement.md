# Ultra-Thin Scrollbar & Mobile View Visual Refinement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement an ultra-thin, elegant luxury obsidian/gold scrollbar and eliminate visual overlap, awkward proportions, and layout flaws on mobile screens across the entire application.

**Architecture:** 
The solution introduces a cross-browser sleek scrollbar system (CSS variables, `::-webkit-scrollbar`, `scrollbar-width: thin`) tailored to the dark ritual aesthetic. For mobile view, it restructures `GuestStorytellingTransition.tsx` with dynamic viewport-height constraints and a collision-free mobile layer where the scroll prompt and artist cards have dedicated vertical breathing room, and corrects CSS media query mismatches in `src/index.css` for lineup cards, event rosters, and night spotlight pages.

**Tech Stack:** 
React 19, TypeScript, Vite, Vanilla CSS with CSS custom properties and modern media queries.

---

### Task 1: Ultra-Thin Luxury Scrollbar Implementation

**Files:**
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/index.css:48-64`

**Step 1: Inspect existing base rules in `src/index.css`**
Check the `html` and `body` rules in `src/index.css` around lines 48-64.

**Step 2: Add cross-browser ultra-thin scrollbar CSS**
Add the following rules to `src/index.css` to replace the default 17px gray Windows scrollbar with a sleek, 4px-5px antique-gold and obsidian scrollbar:

```css
/* ========================================================================== */
/* ULTRA-THIN LUXURY SCROLLBAR SPECIFICATION                                  */
/* ========================================================================== */

/* Firefox standard */
html {
  scrollbar-width: thin;
  scrollbar-color: rgba(197, 168, 105, 0.32) var(--color-void);
}

/* Chrome, Edge, Safari & Webkit Browsers */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background: var(--color-void);
}

::-webkit-scrollbar-thumb {
  background: rgba(197, 168, 105, 0.28);
  border-radius: 9999px;
  border: 1px solid rgba(13, 17, 23, 0.6);
  transition: background 250ms ease, box-shadow 250ms ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(197, 168, 105, 0.65);
  box-shadow: 0 0 10px rgba(197, 168, 105, 0.35);
}

::-webkit-scrollbar-thumb:active {
  background: var(--color-gold-antique);
}

::-webkit-scrollbar-corner {
  background: var(--color-void);
}

::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}
```

**Step 3: Verify the scrollbar renders smoothly on desktop**
Open `http://localhost:5173/` in a browser and check that the clunky gray scrollbar is replaced with a refined, ultra-thin 5px thumb that highlights to antique gold on hover.

---

### Task 2: Mobile View Restructuring for `GuestStorytellingTransition.tsx`

**Files:**
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/components/GuestStorytellingTransition.tsx:55-70`
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/components/GuestStorytellingTransition.tsx:307-360`
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/components/GuestStorytellingTransition.tsx:402-412`

**Step 1: Fix mobile portal dimensions with viewport-height constraint**
In `GuestStorytellingTransition.tsx`, update initial portal calculation so the 9:16 frame never overflows or crowds the screen on small mobile displays:

```typescript
// Initial 9:16 Portrait Box Dimensions with mobile viewport-height safeguard
const initialHeight = isMobile
  ? Math.min(viewport.height * 0.44, 320)
  : isTablet
  ? Math.min(290, viewport.width * 0.32) * (16 / 9)
  : Math.min(330, Math.max(260, viewport.width * 0.22)) * (16 / 9);

const initialWidth = initialHeight * (9 / 16);
```

**Step 2: Restructure mobile layout to eliminate collision**
Separate the scroll cue and bottom artist tags so they never occupy the same horizontal/vertical space:
- Wrap the mobile header in a subtle frosted pill with clean typography.
- Place the scroll cue either above the bottom artist cards or directly below the portal doorway with a clean indicator:
  - Text: `GULIR KE BAWAH // SCROLL` with compact letter-spacing (`0.2em`) and font size (`0.55rem`).
- Position `BASBOI` and `ELENA VEX` in an elegant, grounded bottom dock with a subtle hairline divider and dark frosted backdrop so it remains crisp and legible.

**Step 3: Modify the mobile JSX render block**
```tsx
{/* Mobile Editorial Layout */}
{isMobile && (
  <div className="storytelling-mobile-layer">
    {/* Top Header Pill */}
    <div
      className="story-mobile-top"
      style={{
        opacity: op1,
        transform: `translate3d(0, ${drift1Y}px, 0)`,
      }}
    >
      <div className="story-mobile-top-pill">
        <div>
          <span className="story-mobile-kicker">
            01 / 02 · {activeStep}
          </span>
          <h2 className="story-mobile-title">
            THE GUESTS
          </h2>
        </div>
        <div className="story-mobile-top-right">
          <span className="story-mobile-status">OPEN PORTAL</span>
          <span className="story-mobile-dates">30–31 OKT</span>
        </div>
      </div>
    </div>

    {/* Dedicated Mobile Scroll Prompt (Positioned safely above bottom dock) */}
    <div
      className="story-mobile-cue-wrapper"
      style={{
        opacity: opCue,
      }}
    >
      <div className="story-mobile-cue-pill">
        <span>GULIR KE BAWAH</span>
        <span className="story-mobile-cue-arrow">↓</span>
      </div>
    </div>

    {/* Bottom Artist Dock */}
    <div
      className="story-mobile-bottom"
      style={{
        opacity: op5,
        transform: `translate3d(0, ${drift5Y}px, 0)`,
      }}
    >
      <div className="story-mobile-artist-block">
        <span className="story-mobile-artist-name">BASBOI</span>
        <span className="story-mobile-artist-meta">MAIN STAGE // 22:30</span>
      </div>
      <div className="story-mobile-bottom-divider" />
      <div className="story-mobile-artist-block text-right">
        <span className="story-mobile-artist-name">ELENA VEX</span>
        <span className="story-mobile-artist-meta text-muted">UNDER-VAULT // 00:00</span>
      </div>
    </div>
  </div>
)}
```

Hide the default desktop `.storytelling-scroll-cue` when `isMobile` is active:
```tsx
{/* Initial Scroll Prompt (Desktop / Tablet only) */}
{!isMobile && (
  <div
    className="storytelling-scroll-cue"
    style={{ opacity: opCue }}
  >
    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', letterSpacing: '0.35em', color: 'rgba(197, 168, 105, 0.85)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
      GULIR UNTUK MELANGKAH MASUK KE GERBANG
    </span>
    <div className="storytelling-scroll-cue-line" />
  </div>
)}
```

---

### Task 3: CSS Refinements for Mobile Storytelling & Navigation in `src/index.css`

**Files:**
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/index.css:3334-3388`

**Step 1: Add dedicated CSS rules for mobile storytelling layer**
```css
/* Mobile Storytelling Refinement */
.storytelling-mobile-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 20;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.25rem 1rem 1.5rem 1rem;
}

.story-mobile-top-pill {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  background: rgba(13, 17, 23, 0.75);
  border: 1px solid rgba(197, 168, 105, 0.22);
  border-radius: 9999px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
}

.story-mobile-kicker {
  font-family: var(--font-body);
  font-size: 0.52rem;
  letter-spacing: 0.2em;
  color: var(--color-gold-antique);
  text-transform: uppercase;
  display: block;
}

.story-mobile-title {
  font-family: var(--font-monumental);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--color-ivory);
  text-transform: uppercase;
  line-height: 1.1;
  margin-top: 0.1rem;
}

.story-mobile-top-right {
  text-align: right;
}

.story-mobile-status {
  font-family: var(--font-body);
  font-size: 0.52rem;
  letter-spacing: 0.18em;
  color: var(--color-crimson);
  text-transform: uppercase;
  display: block;
  font-weight: 600;
}

.story-mobile-dates {
  font-family: var(--font-editorial);
  font-style: italic;
  font-size: 0.72rem;
  color: var(--color-muted);
}

/* Dedicated Mobile Scroll Cue */
.story-mobile-cue-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  margin-bottom: 0.85rem;
  pointer-events: none;
  z-index: 25;
}

.story-mobile-cue-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  background: rgba(6, 7, 9, 0.82);
  border: 1px solid rgba(197, 168, 105, 0.3);
  border-radius: 9999px;
  font-family: var(--font-body);
  font-size: 0.55rem;
  letter-spacing: 0.18em;
  color: var(--color-gold-antique);
  text-transform: uppercase;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: storytellingPulse 2s ease-in-out infinite;
}

.story-mobile-cue-arrow {
  font-size: 0.65rem;
  animation: bounceDown 1.5s infinite;
}

@keyframes bounceDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(3px); }
}

/* Bottom Artist Dock */
.story-mobile-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: rgba(13, 17, 23, 0.85);
  border: 1px solid rgba(197, 168, 105, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
  margin-top: 0;
}

.story-mobile-artist-block {
  display: flex;
  flex-direction: column;
}

.story-mobile-artist-name {
  font-family: var(--font-monumental);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--color-ivory);
  line-height: 1.1;
}

.story-mobile-artist-meta {
  font-family: var(--font-body);
  font-size: 0.52rem;
  color: var(--color-gold-antique);
  letter-spacing: 0.1em;
  margin-top: 0.2rem;
}

.story-mobile-bottom-divider {
  width: 1px;
  height: 1.8rem;
  background: rgba(197, 168, 105, 0.25);
  margin-inline: 0.5rem;
}
```

---

### Task 4: Global Mobile Media Query Fixes (Lineup, Roster, Spotlight, Timetable)

**Files:**
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/index.css:2198-2230`

**Step 1: Fix class selector mismatches for Lineup Cards on mobile**
In `@media (max-width: 640px)`:
Replace the unused `.guest-dossier-body` and `.guest-headline-name` rules with the actual classes used in `LineupSection.tsx`:
- `.guest-card-info-pane`: padding: `1.25rem 1rem 1rem`
- `.guest-artist-name`: `font-size: clamp(1.4rem, 6vw, 1.75rem);`
- `.guest-day-kicker`: `font-size: 0.62rem;`
- `.guest-performance-meta`: `font-size: 0.72rem;`
- Ensure `.guest-audio-trigger-btn` has a touch-friendly hit area (`44px x 44px`).

**Step 2: Ensure Event Roster cards and Single Night spotlight cards stack cleanly on mobile**
Confirm that `.events-roster-grid` switches to single column:
```css
@media (max-width: 768px) {
  .events-roster-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .event-roster-card-top {
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .event-roster-content {
    padding: 1.25rem 1rem;
  }

  .night-spotlight-card {
    grid-template-columns: 1fr;
  }

  .night-spotlight-info {
    padding: 1.5rem 1.15rem;
  }
}
```

---

### Task 5: Testing, Visual Audit, and Verification

**Files:**
- Test URL: `http://localhost:5173/`

**Step 1: Check build & TypeScript compilation**
Run: `npm run build`
Expected: 0 errors, successful production bundle generation.

**Step 2: Check Desktop scrollbar appearance**
Verify in browser that the scrollbar is ultra-thin, dark obsidian background, subtle gold thumb, no arrows or gray tracks.

**Step 3: Check Mobile View at 375px (iPhone SE) and 390px (iPhone 14/15/16)**
Verify in mobile responsive mode:
- No text collisions in `GuestStorytellingTransition`.
- Scroll cue is clearly legible and does not collide with artist names.
- Central portal image fits comfortably with equal breathing space above and below.
- Lineup cards, admission tickets, and event cards are responsive and readable without horizontal overflow.
