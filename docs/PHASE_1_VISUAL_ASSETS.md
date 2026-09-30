# PHASE 1: VISUAL ASSETS & ART DIRECTION

> **Status:** IN PROGRESS (Hero Monument Completed; The Guests In Preparation)  
> **Rule:** No code modification during this phase. Focus strictly on visual world-building, photography, and lighting consistency.

---

## 1. Objective
Establish the complete visual DNA of **The State of Clamour** through high-fidelity, cinematic image assets before building or altering any UI code.

---

## 2. Asset Inventory & Deliverables

### Asset 01: Hero Architecture (`hero_monument`)
* **Role:** Sets the monumental silence, sense of place, and mystery of the event.
* **Specification:**
  * **Aspect Ratio:** `16:9` widescreen.
  * **Subject:** Symmetrical grand civic institution, weathered dark charcoal stone, broad steps, double-height portal.
  * **Pencahayaan:** Midnight blue & charcoal shadows with a single warm, rich oxblood/crimson glow leaking through the cracked portal onto wet asphalt.
  * **Typographic Canvas:** Clean, dark negative space in the upper 35% for title typography.
* **Status:** ✅ **COMPLETED & APPROVED** (`hero_monument_architecture`).
* **Deployment Target:** `public/assets/hero_monument.jpg`

---

### Asset 02: The Guests — Basboi (`guest_basboi`)
* **Role:** The "Release" of kinetic party energy. Proves this is a live, sweating, energetic party.
* **Specification:**
  * **Aspect Ratio:** `9:16` vertical editorial portrait.
  * **Subject:** Live performance energy, dynamic concert posture, microphone in hand, crowd hands silhouetted in the dark foreground.
  * **Pencahayaan & Color Grading:** Hard front stage flash / amber rim-light cutting through atmospheric smoke, high contrast, authentic analog 35mm grain.
  * **No-Go:** No static studio poses, no headphone-holding DJ cliches, no neon rave borders.
* **Status:** ⏳ PENDING PROMPT & GENERATION
* **Deployment Target:** `public/assets/guest_basboi.jpg`

---

### Asset 03: The Guests — Elena Vex (`guest_elena`)
* **Role:** Represents the nocturnal sound, heavy bass pulse, and immersive booth presence.
* **Specification:**
  * **Aspect Ratio:** `9:16` vertical editorial portrait.
  * **Subject:** Behind the decks in heavy haze, focus on the hands/mixer and concentrated facial expression, subtle motion blur of hair/movement.
  * **Pencahayaan & Color Grading:** Deep crimson/oxblood backlight cutting through dense fog, shadowy foreground, high-end editorial grain.
  * **No-Go:** No smiling stock-photo DJ, no cartoonish party lights.
* **Status:** ⏳ PENDING PROMPT & GENERATION
* **Deployment Target:** `public/assets/guest_elena.jpg`

---

### Asset 04: Texture & Overlay System
* **Role:** Bridges web UI and photography into a cohesive cinematic medium.
* **Deliverables:**
  * **35mm Analog Film Grain:** SVG noise filter pattern or subtle WebP grain overlay.
  * **Vignette Mask:** Subtle CSS radial gradient at viewport edges to replicate 35mm projection framing.
* **Status:** DEFINED (Implemented in Phase 2)

---

## 3. Quality & Consistency Gates

Before advancing to Phase 2, verify:
- [x] **Universal Architecture Check:** Monument has no identifiable geographic/religious markers.
- [x] **Lighting Consistency:** Oxblood/crimson (`#5C0D12` / `#8F1D24`) is the exclusive warm hue.
- [ ] **The "Party Energy" Test:** *The Guests* visuals must immediately contrast with the stillness of the Hero.
- [ ] **Asset Compression & Format:** All final image assets compressed to high-efficiency WebP/JPEG under 600KB for rapid initial load.
