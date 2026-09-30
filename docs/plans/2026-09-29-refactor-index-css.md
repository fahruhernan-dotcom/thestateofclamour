# Refactoring Plan for `src/index.css`

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Clean up, modularize, and eliminate bloat, dead code, and conflicting styles in `src/index.css` (reducing it from 4,060 lines into a streamlined, high-performance design system), with specific focus on line 3590 (refactoring the scroll-driven storytelling section to eliminate outdated climax cards and unify the 9:16 concert image expansion).

**Architecture:**
- Audit and purge orphaned CSS classes from obsolete/dead components (notably 375+ lines of `.passage-editorial-*` belonging to the unused `ThePassageSection.tsx`).
- Refactor Section 12 (Scroll-Driven Storytelling, lines 3193–3684) to eliminate cluttered `.storytelling-climax-card`, `.storytelling-climax-btn`, `.storytelling-narrative-bar`, replacing them with a sleek, centered 9:16 vertical concert photograph expansion architecture (`.storytelling-photo-frame`, `.storytelling-editorial-cluster-*`, and refined mobile storytelling layer).
- Unify and deduplicate fragmented media queries across sections (`@media (max-width: 640px)` and `@media (max-width: 768px)`), standardizing selectors and removing obsolete classes (`.guest-dossier-body`, `.guest-action-strip`).
- Replace hardcoded hex values (`#060709`, `#C5A869`, `#5C0D12`, `#E9E4DA`) with root tokens (`--color-void`, `--color-gold-antique`, `--color-oxblood`, `--color-ivory`), preserving the ultra-thin luxury scrollbar.

**Tech Stack:** Vanilla CSS with CSS Custom Properties, modern Flexbox/Grid, and responsive media queries.

---

### Task 1: Refactor Scroll-Driven Storytelling Section (Lines 3193–3684 / Line 3590 Focus)

**Files:**
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/index.css:3193-3684`
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/components/GuestStorytellingTransition.tsx` (sync class names)

**Step 1: Audit and eliminate contradictory climax card rules**
Remove the following obsolete classes around line 3580–3645:
- `.storytelling-climax-card`
- `.storytelling-scrim`
- `.storytelling-climax-content`
- `.storytelling-climax-btn`
- `.storytelling-narrative-bar` and `.storytelling-narrative-step`

**Step 2: Consolidate 9:16 concert photo container classes**
Replace the fragmented `.storytelling-landscape-*` and `.storytelling-portrait-*` rules with unified, purpose-built rules for the centered 9:16 concert photo:
```css
/* Unified Centered 9:16 Photographic Artifact Container */
.storytelling-photo-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: width, height, transform;
}

.storytelling-photo-frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--color-midnight);
}

.storytelling-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 35%;
  display: block;
  user-select: none;
  pointer-events: none;
}

.storytelling-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 50% 50%, transparent 45%, rgba(6, 7, 9, 0.75) 100%);
}

.storytelling-stage-glow {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60vh;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 100%, rgba(92, 13, 18, 0.42) 0%, rgba(6, 7, 9, 0) 75%);
  z-index: 2;
}
```

**Step 3: Refine Asymmetric Editorial Clusters (Organized Chaos)**
Ensure clean, token-based styles for the 4 editorial text clusters:
- `.story-cluster-top-left` (Headline & Kicker)
- `.story-cluster-top-right` (Basboi Performance Meta)
- `.story-cluster-left-mid` (Vertical Ribbon Metadata)
- `.story-cluster-bottom-right` (Elena Vex Performance Meta)

**Step 4: Keep Clean Mobile Storytelling Layer**
Preserve and polish:
- `.storytelling-mobile-layer`
- `.story-mobile-top-pill`
- `.story-mobile-cue-pill`
- `.story-mobile-bottom`

---

### Task 2: Purge Orphaned & Dead Styles (Lines 3685–4060)

**Files:**
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/index.css:3685-4060`
- Remove/Archive: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/components/ThePassageSection.tsx` (unused dead code)

**Step 1: Check component usage**
Verify that `ThePassageSection.tsx` is completely unreferenced across `src/pages/` and `src/App.tsx` (the actual admission passes section is `TicketSection.tsx`).

**Step 2: Delete orphaned classes from `src/index.css`**
Remove ~375 lines of `.passage-editorial-*` styles that were duplicated or added for `ThePassageSection.tsx`.

**Step 3: Clean up or remove `src/components/ThePassageSection.tsx`**
Remove the unused dead file to prevent code rot.

---

### Task 3: Streamline & Deduplicate Media Queries in `src/index.css`

**Files:**
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/index.css:2097-2588` (Section 9)
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/index.css:3056-3112` (Section 10)

**Step 1: Clean up Section 9 Mobile Overrides**
- Remove dead class selectors: `.guest-dossier-body`, `.guest-action-strip`, `.guest-audio-sample-btn`.
- Keep active selectors: `.guest-card-info-pane`, `.guest-artist-name`, `.guest-audio-trigger-btn`.

**Step 2: Consolidate duplicate `@media` blocks**
Group mobile rules logically by breakpoint:
- Tablet Breakpoint: `@media (max-width: 860px)`
- Mobile Breakpoint: `@media (max-width: 640px)`
- Small Mobile Breakpoint: `@media (max-width: 420px)`

---

### Task 4: Design Token Consistency & Formatting Audit

**Files:**
- Modify: `d:/Dokumen/02_Kerja_Profesional/HOW Parkun/src/index.css`

**Step 1: Standardize token references**
Scan and replace raw recurring hex codes with design system tokens:
- `#060709` $\rightarrow$ `var(--color-void)`
- `#0D1117` $\rightarrow$ `var(--color-midnight)`
- `#5C0D12` $\rightarrow$ `var(--color-oxblood)`
- `#8F1D24` $\rightarrow$ `var(--color-crimson)`
- `#C5A869` $\rightarrow$ `var(--color-gold-antique)`
- `#E9E4DA` $\rightarrow$ `var(--color-ivory)`

**Step 2: Verify typography pairings**
Ensure:
- Headings & Titles $\rightarrow$ `var(--font-monumental)` (`Cinzel`)
- Literary Accents & Dates $\rightarrow$ `var(--font-editorial)` (`Cormorant Garamond`)
- Metadata, UI & Badges $\rightarrow$ `var(--font-body)` (`Inter`)

---

### Task 5: Testing, Build Verification & Dev Server Validation

**Files:**
- Test command: `npm run build`
- Dev server check: `http://localhost:5173/`

**Step 1: Run TypeScript compiler and production build**
```bash
npm run build
```
Expected: `tsc -b && vite build` succeeds with 0 errors and a clean output bundle.

**Step 2: Verify Dev Server HTTP 200**
Confirm the app loads without console errors or styling breakages.

**Step 3: Update Obsidian Vault Working Memory**
Update `ActiveContext.md` and document the refactoring in the `Lemonaru` Obsidian Vault.
