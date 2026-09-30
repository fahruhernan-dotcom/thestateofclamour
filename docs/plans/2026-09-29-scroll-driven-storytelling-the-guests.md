# Scroll-Driven Storytelling — THE GUESTS Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a cinematic, scroll-driven storytelling section directly after THE STATE OF CLAMOUR hero that transitions visitors from the monumental silence of THE ARRIVAL into the physical, human concert energy of THE GUESTS using a centered 9:16 concert photograph (`/assets/guests_storytelling.jpg`) that expands into a full-screen viewport.

**Architecture:** 
- The section sits directly between `HeroSection` and `LineupSection` on `HomePage.tsx`.
- Utilizes a sticky scroll container (`height: 280vh`–`300vh`) with scroll progress $\in [0, 1]$ calculated via `requestAnimationFrame` for maximum 60fps smoothness.
- The 9:16 vertical concert photograph starts centered within deep obsidian negative space (`#060709`) and progressively expands outward into a full-bleed viewport (`100vw \times 100vh`) without distortion or awkward cropping.
- Surrounding typography is composed as curated editorial "organized chaos" with real performer metadata (Basboi & Elena Vex), using `Cinzel`, `Cormorant Garamond Italic`, and `Inter`.
- All text elements drift outward via subtle parallax and fade completely as the image approaches full-screen, achieving the emotional release where the concert photograph becomes the sole visual focus ("I have entered the party").

**Tech Stack:** React 19, TypeScript, Vite, Vanilla CSS with custom properties (`Cinzel`, `Cormorant Garamond`, `Inter`), CSS Grid/Flexbox.

---

### Task 1: Asset Alignment & CSS Token Configuration

**Files:**
- Inspect: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/public/assets/guests_storytelling.jpg`
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/index.css:3220-3360`

**Step 1: Verify the concert photography asset**
Confirm that `/assets/guests_storytelling.jpg` is present in `public/assets/` and features the 9:16 gothic concert stage scene with live performer, crowd hands, candelabra, smoke, and oxblood/amber lighting.

**Step 2: Update Storytelling CSS variables & base classes in `src/index.css`**
Set up the container styles and variables adhering strictly to the material palette:
- Obsidian Void: `#060709`
- Midnight: `#0D1117`
- Oxblood: `#5C0D12`
- Crimson: `#8F1D24`
- Antique Gold: `#C5A869`
- Burnished Gold: `#8C6E38`
- Ivory: `#E9E4DA`
- Muted Slate: `#9CA3AF`

```css
/* Storytelling Container Baseline */
.storytelling-container {
  position: relative;
  width: 100%;
  height: 280vh;
  background-color: var(--color-void);
  z-index: 15;
}

.storytelling-sticky {
  position: sticky;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-void);
}
```

**Step 3: Verification**
Verify `src/index.css` syntax and ensure no duplicate or conflicting styles.

---

### Task 2: Refactor Scroll Progress & Progressive Expansion Math in `GuestStorytellingTransition.tsx`

**Files:**
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/components/GuestStorytellingTransition.tsx:50-130`
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/components/GuestStorytellingTransition.tsx:360-405`

**Step 1: Configure 9:16 portrait initial dimensions and smooth expansion interpolation**
In `GuestStorytellingTransition.tsx`:
- Point image `src` to `"/assets/guests_storytelling.jpg"`.
- Set initial dimensions with generous negative space:
  - Mobile: `initialHeight = Math.min(viewport.height * 0.46, 320)`, `initialWidth = initialHeight * (9 / 16)`.
  - Tablet: `initialHeight = Math.min(viewport.height * 0.54, 460)`, `initialWidth = initialHeight * (9 / 16)`.
  - Desktop: `initialHeight = Math.min(viewport.height * 0.60, 560)`, `initialWidth = initialHeight * (9 / 16)`.
- Apply an eased expansion curve:
  ```typescript
  const easedProgress = Math.pow(progress, 1.35);
  const currentWidth = initialWidth + (viewport.width - initialWidth) * easedProgress;
  const currentHeight = initialHeight + (viewport.height - initialHeight) * easedProgress;
  ```
- Subtly zoom the photo focal point during approach (`scale(1 + 0.08 * easedProgress)`) to simulate walking into the crowd.

**Step 2: Staggered text opacity and parallax drifts**
Calculate individual opacity curves and drift vectors for surrounding editorial elements:
```typescript
// Element 1: Kicker & Header (fades earliest: 0.0 -> 0.32)
const op1 = Math.max(0, 1 - progress / 0.32);
const drift1Y = -40 * progress;

// Element 2: Basboi Performance Info (Top Right) (0.04 -> 0.38)
const op2 = Math.max(0, 1 - Math.max(0, progress - 0.04) / 0.34);
const drift2X = 50 * progress;

// Element 3: Vertical Meta Line (Left Mid) (0.06 -> 0.36)
const op3 = Math.max(0, 1 - Math.max(0, progress - 0.06) / 0.30);
const drift3X = -50 * progress;

// Element 4: Elena Vex Performance Info (Bottom Left) (0.08 -> 0.42)
const op4 = Math.max(0, 1 - Math.max(0, progress - 0.08) / 0.34);
const drift4Y = 40 * progress;

// Element 5: Scroll Prompt Cue (fades immediately on scroll: 0.0 -> 0.15)
const opCue = Math.max(0, 1 - progress / 0.15);
```

**Step 3: Verification**
Confirm that as `progress` increases from 0.0 to 1.0, the width and height smoothly approach 100vw and 100vh without jumps or layout thrashing.

---

### Task 3: Editorial Typography & Asymmetric "Organized Chaos" Layout

**Files:**
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/components/GuestStorytellingTransition.tsx:170-305`
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/index.css:3260-3370`

**Step 1: Implement the 4 Asymmetric Editorial Clusters (Desktop & Tablet)**
Arrange informational elements around the central 9:16 portrait using actual event data:
1. **Top-Left (Editorial Header):**
   - Kicker: `01 // THE GUESTS` (Inter, uppercase, Antique Gold, `0.625rem`)
   - Title: `RITUAL OF RECOGNITION` (Cinzel, `1.6rem`, Ivory)
   - Accent note: `The silence of the stone breaks.` (Cormorant Garamond Italic, Muted Slate, `0.9rem`)
2. **Top-Right (Performer 1 — Basboi):**
   - Performer Name: `BASBOI` (Cinzel, Antique Gold, `1.85rem`, bold)
   - Date & Time: `30 OCTOBER · 22:30 WIB` (Inter, Ivory, `0.75rem`)
   - Stage: `MAIN STAGE` (Inter, Oxblood/Crimson accent, `0.65rem`)
3. **Left-Mid (Vertical Meta Ribbon):**
   - Fine vertical hairline (Antique Gold 20%)
   - Vertical rotated text: `SWEAR IN CONTINENTAL · TWO NIGHTS ASSEMBLY` (Cinzel, `0.58rem`, Muted Slate)
4. **Bottom-Left / Bottom-Right (Performer 2 — Elena Vex):**
   - Performer Name: `ELENA VEX` (Cinzel, Antique Gold, `1.85rem`, bold)
   - Date & Time: `31 OCTOBER · 00:00 WIB` (Inter, Ivory, `0.75rem`)
   - Stage: `NOCTURNAL STAGE` (Inter, Oxblood accent, `0.65rem`)

**Step 2: Avoid decorative clutter**
- No generic SaaS cards or heavy box backgrounds on desktop.
- Floating typography directly on `#060709` obsidian canvas with subtle text-shadows for legibility.

**Step 3: Verification**
Check typography font family bindings (`Cinzel`, `Cormorant Garamond`, `Inter`) and color contrast against `#060709`.

---

### Task 4: Complete Typography Fade & Full-Bleed Climax State (The Party Release)

**Files:**
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/components/GuestStorytellingTransition.tsx:415-460`
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/index.css:3390-3450`

**Step 1: Eliminate intrusive UI cards at final state**
- Remove the old card with button and text at the bottom.
- Ensure that at `progress > 0.85`:
  - All editorial text has faded to `opacity: 0`.
  - The photo reaches full-bleed dimensions (`100vw \times 100vh`).
  - No cards or buttons obscure the concert photograph.
  - Border hairline opacity fades to `0`.

**Step 2: Add subtle atmospheric oxblood concert glow & film texture**
- Apply a nocturnal oxblood ambient light (`radial-gradient`) in the background that warms up as the visitor approaches (`opacity: progress * 0.45`).
- Ensure the concert photograph focal point (the veiled performer singing with raised hands from the crowd) stays perfectly centered and immersive.

**Step 3: Add smooth transition to the next section**
- As user scrolls past `1.0`, the page flows seamlessly into `<LineupSection />` (`#the-guests`).

---

### Task 5: Mobile View Editorial Layout & Responsive Experience

**Files:**
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/components/GuestStorytellingTransition.tsx:305-365`
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/index.css:3370-3440`

**Step 1: Refine mobile layer with real performer data**
On mobile screens (`<= 768px`):
- Top Pill:
  - `01 // THE GUESTS` (Antique Gold)
  - `SWEAR IN CONTINENTAL` (Ivory)
- Centered 9:16 vertical concert photograph floating with clean vertical breathing space.
- Scroll Cue: Dedicated pill `GULIR KE BAWAH ↓` that fades out immediately as scrolling starts (`opacity: opCue`).
- Bottom Artist Dock (grounded frosted obsidian bar):
  - Left: `BASBOI` · `30 OKT · 22:30 WIB` · `MAIN STAGE`
  - Hairline gold divider
  - Right: `ELENA VEX` · `31 OKT · 00:00 WIB` · `NOCTURNAL STAGE`
- Staggered fading: As mobile user scrolls down, both top pill and bottom dock fade away cleanly (`op1` and `op5`), allowing the concert image to expand smoothly to full-screen.

**Step 2: Verification across viewports**
Verify layout behavior at 375px (iPhone SE), 390px (iPhone 14/15/16), 768px (iPad mini), and 1440px (Desktop).

---

### Task 6: Build Verification & Quality Review

**Files:**
- Inspect: Production build and console outputs

**Step 1: Run TypeScript compiler and production build**
```bash
npm run build
```
Expected: `tsc -b && vite build` succeeds with 0 errors.

**Step 2: Verify HTTP server response**
Verify that the Vite dev server running at `http://localhost:5173/` serves the updated section with HTTP 200 OK.

**Step 3: Document completed work into Obsidian Vault**
Update `ActiveContext.md` and create a dedicated devlog session note in the user's `Lemonaru` Obsidian Vault.
