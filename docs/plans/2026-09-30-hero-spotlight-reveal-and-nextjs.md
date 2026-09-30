# Implementation Plan: Hero Cursor-Following Spotlight Reveal & Next.js Integration

**Goal:**
1. Integrate the requested Next.js package.
2. Implement a cursor-following character/horror reveal over the existing Hero section using the exact attached image assets:
   - **Base Image (`BG_IMAGE_1`):** Clean CIVITAS INSTITUTIO building at night with warm red door light (`hero_bg_base.jpg`).
   - **Reveal Image (`BG_IMAGE_2`):** Sinister horror version with blood drippings, street blood pool, corpses, apparitions in the fog, and infernal doorway fire (`hero_bg_reveal.jpg`).
3. Reveal `BG_IMAGE_2` through a smooth, cursor-following 260px circular spotlight with soft feathered edges via CSS `mask-image` and `-webkit-mask-image`, with LERP easing, completely hidden when cursor leaves the hero.
4. Keep the reveal layer above the hero background but beneath all headline text, buttons, and UI elements (`pointer-events: none`).
5. All testing will be performed manually by the user as requested (*"semua pengecekan ku cek manual"*).

---

## 1. Next.js Package Integration Strategy

The project currently runs on **Vite + React 18 + TypeScript**. The user requested: *"sebelumnya lengkapi dulu menggunakan next js package"*.

### Integration Options:
- **Option A (Recommended - Hybrid / Non-Breaking):**
  - Install `next` (`npm install next@latest`) into `package.json` dependencies.
  - This equips the codebase with Next.js capabilities while preserving the active Vite development server and existing builds without disruptive restructuring.
- **Option B (Full Next.js App Router Migration):**
  - Migrate project structure from Vite SPA to Next.js App Router (`src/app/page.tsx`, `src/app/layout.tsx`, `next.config.mjs`, replacing `vite` with `next dev`).
  - *Note:* This is a larger framework migration that replaces the Vite toolchain.

*We will install the `next` package first as requested to complete the project requirements.*

---

## 2. Image Assets Specification

The two attached images are 1:1 pixel-aligned renders of the monumental building (both 1024x571):

| Identifier | Source Asset | Target Location | Description |
| :--- | :--- | :--- | :--- |
| **`BG_IMAGE_1` (Base)** | `media_1790701760249.jpg` | `public/assets/hero_bg_base.jpg` | Base monumental building at night, dark street, eerie red door light. |
| **`BG_IMAGE_2` (Reveal)** | `media_1790701760210.jpg` | `public/assets/hero_bg_reveal.jpg` | Sinister blood-soaked version with corpses, apparitions, and hellfire. |

*Rule:* Zero cropping, zero recoloring, zero resizing, zero alteration of character/scene features.

---

## 3. Cursor Spotlight Reveal Architecture

### Visual & Stacking Hierarchy
```
┌────────────────────────────────────────────────────────┐
│ 1. Hero Content & UI (z-index: 10)                     │
│    - SWEAR IN CONTINENTAL (Playfair Display)          │
│    - The State of Clamour (Subtitle)                   │
│    - Description copy                                  │
│    - Ghost buttons [ Enter The State ] [ The Guests ]  │
├────────────────────────────────────────────────────────┤
│ 2. Soft Atmospheric Vignette Overlay (z-index: 5)      │
│    - Radial darkness to ensure text readability        │
├────────────────────────────────────────────────────────┤
│ 3. Ambient Crimson Spotlight Glow (z-index: 4)         │
│    - Subtle eerie flashlight aura at cursor            │
├────────────────────────────────────────────────────────┤
│ 4. REVEAL LAYER - BG_IMAGE_2 (z-index: 3)              │
│    - mask-image: radial-gradient(circle 260px at X Y)  │
│    - pointer-events: none                              │
│    - opacity: isHovered ? 1 : 0 (smooth fade)          │
├────────────────────────────────────────────────────────┤
│ 5. Dark Atmosphere / Smoke Tint (z-index: 2)           │
├────────────────────────────────────────────────────────┤
│ 6. BASE LAYER - BG_IMAGE_1 (z-index: 1)                │
│    - Full bleed cover matching BG_IMAGE_2 exactly      │
└────────────────────────────────────────────────────────┘
```

### Technical Requirements:
1. **Spotlight Mask Equation:**
   ```css
   -webkit-mask-image: radial-gradient(
     circle 260px at var(--spotlight-x) var(--spotlight-y),
     rgba(0, 0, 0, 1) 0%,
     rgba(0, 0, 0, 1) 150px,
     rgba(0, 0, 0, 0.75) 200px,
     rgba(0, 0, 0, 0.25) 240px,
     rgba(0, 0, 0, 0) 260px
   );
   mask-image: radial-gradient(
     circle 260px at var(--spotlight-x) var(--spotlight-y),
     rgba(0, 0, 0, 1) 0%,
     rgba(0, 0, 0, 1) 150px,
     rgba(0, 0, 0, 0.75) 200px,
     rgba(0, 0, 0, 0.25) 240px,
     rgba(0, 0, 0, 0) 260px
   );
   ```
2. **Smooth Cursor LERP Easing (60fps/120fps):**
   - Track mouse position relative to `#hero` container bounds: `(e.clientX - rect.left, e.clientY - rect.top)`.
   - In `requestAnimationFrame` loop:
     `currentX += (targetX - currentX) * 0.15;`
     `currentY += (targetY - currentY) * 0.15;`
   - Sets CSS variables `--spotlight-x` and `--spotlight-y` or applies directly to element style.
3. **Cursor Leave Behavior:**
   - On `onMouseLeave` / `onPointerLeave`:
     - `isHovered` set to `false`.
     - Reveal layer opacity smoothly transitions to `0` via `transition: opacity 0.4s ease-out`.
     - When re-entering on `onMouseEnter`: smoothly fades back to `1`.
4. **Pass-Through Interaction:**
   - `pointer-events: none` applied strictly to reveal layer and glow so all buttons and links remain 100% clickable.

---

## 4. Proposed Implementation Steps

### Step 1: Install Next.js Package
- Run `npm install next@latest` to add the Next.js package into the project.

### Step 2: Component Upgrade (`src/components/HeroSection.tsx`)
- Add state for `isHovered`, `mousePos` (`{ x, y }`), and target ref.
- Implement LERP smoothing loop using `requestAnimationFrame`.
- Render:
  - Base Image (`/assets/hero_bg_base.jpg`)
  - Reveal Image (`/assets/hero_bg_reveal.jpg`) with dynamic mask
  - Ambient crimson spotlight edge aura
  - Existing Hero content stack (headline, subtitle, copy, buttons)

### Step 3: CSS Refinement (`src/styles/hero.css`)
- Define styles for `.hero-base-layer`, `.hero-reveal-layer`, `.hero-spotlight-glow`.
- Ensure exact pixel-matching alignment between base and reveal images (`object-fit: cover; object-position: center 60%`).
- Maintain existing typography and ghost button styling.

### Step 4: Verification
- Verify build compilation (`npm run build`).
- User will test manually directly on `http://localhost:5173/` as instructed.
