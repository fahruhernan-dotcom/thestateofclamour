# PHASE 4: AUDIT, REFINEMENT & VERIFICATION

> **Status:** PENDING (Prerequisite: Phase 3 Component Reconstruction)  
> **Target:** Full end-to-end quality validation, accessibility, and build stability.

---

## 1. Objective
Rigorously stress-test **The State of Clamour** against the locked creative principles, ergonomic requirements, and production performance standards.

---

## 2. Core Audit Gateways

### 2.1 The "1-Second Ticket Test" (Conversion Clarity)
* [ ] Can a first-time visitor scroll to `THE PASSAGE` and within 1 second understand:
  1. What the tier name is (`PRESALE 01`).
  2. How much it costs (`Rp129.000`).
  3. Where to click to purchase (`GET TICKETS →`).
* [ ] Are sold-out tiers unmistakably distinguished without jarring or flashing alerts?
* [ ] Zero cosplay barriers: No confusing terms like "Class B Security Clearance".

---

### 2.2 The "Party Energy Test" (Emotional Rhythm)
* [ ] Does the visual transition between **The Arrival** and **The Guests** deliver an immediate psychological release?
* [ ] Does the concert photography convey real human presence: sweat, movement, stage smoke, crowd silhouettes?
* [ ] Does the site feel like an exclusive, high-energy Halloween party rather than a cold horror movie or static museum?

---

### 2.3 Visual Token Compliance Audit
* [ ] **Absolute Zero Neon:** Scan computed CSS styles for any remnants of `#CCFF00`, `#00F0FF`, or `#8B5CF6`.
* [ ] **Lighting Discipline:** Ensure red illumination (`--color-crimson` / `--color-oxblood`) is the exclusive warm source.
* [ ] **Typography Rigor:** Ensure `Cinzel` is restricted to monumental headings; `Inter` handles all body text; no excessive tracking on body paragraphs.

---

### 2.4 Audio Preview & Media Ergonomics
* [ ] **Zero Autoplay Guarantee:** Audio must remain completely silent upon initial load.
* [ ] **Discreet Feedback:** Audio playback activates smoothly upon user click, displaying quiet track metadata without blocking UI elements.
* [ ] **Graceful Degradation:** If an audio preview file fails to load or is missing, the player fails silently without throwing console errors or crashing the UI.

---

### 2.5 Mobile Ergonomics & Viewport Scaling
* [ ] **Hero Scaling:** Hero architecture remains centered and majestic on 375px mobile screens; the glowing red entrance remains in view.
* [ ] **Typographic Fluidity:** Headlines use CSS `clamp()` to prevent unwanted line-breaks or screen overflow.
* [ ] **Touch Targets:** All interactive triggers (navbar links, play button, ticket CTA, FAQ accordions) have minimum hit-boxes of $44 \times 44\text{px}$.

---

### 2.6 Technical Build & Performance
* [ ] Run `npm run build` to confirm zero TypeScript compilation errors.
* [ ] Image assets loaded with proper `loading="lazy"` on lower sections.
* [ ] Zero layout shifts (CLS < 0.1) when fonts and hero background finish loading.
