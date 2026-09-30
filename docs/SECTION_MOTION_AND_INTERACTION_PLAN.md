# SECTION-BY-SECTION MOTION & INTERACTION IMPLEMENTATION PLAN

> **Document Type:** Motion Experience & Interactive Detailing Blueprint  
> **Status:** PROPOSED FOR IMPLEMENTATION REVIEW  
> **Philosophy:** *Ritualized Realism* (Every motion must feel physical, atmospheric, and purposeful—never like generic web animations).

---

## 1. Executive Motion Architecture

| Scene / Section | Primary Motion Experience | Interactive & Tactile Detail ("Detail Inv") |
| :--- | :--- | :--- |
| **Scene 01: Hero (The Arrival)** | 60fps Biological POV Eye-Blink + Slow Camera Dolly | Portal sub-bass heartbeat pulse, gold shimmer sweep, parallax depth on scroll |
| **Scene 02: The Guests** | Concert flash strobe + 3D perspective card tilt | Pulsating acoustic audio ring, live soundwave indicator, kinetic day filter |
| **Scene 03: The Passage** | Cursor-following metallic specular reflection | Embossed official admission watermark seal, live tier status pulse, tactile pass press |
| **Scene 04: The Night** | Scanning radar line tracking down the ledger | Row hover oxblood stage illumination, chronological day switcher with slide transition |
| **Scene 05: Before You Enter** | Smooth accordion spring reveal with rotating brass icon | Protocol index numbering (`[01]`), golden left spine accent, "Protocols Acknowledged" check |
| **Scene 06: Enter The State** | Volumetric red portal light beam | Magnetic hover pull on CTA button, smooth cinematic anchor scroll to tickets |
| **Global Atmosphere** | Faint nocturnal torchlight following mouse cursor | 35mm analog grain, scroll-triggered cinematic staggered fade-ups |

---

## 2. Detailed Section Implementation Breakdown

### Scene 01: THE ARRIVAL (Hero)
* **Motion Experience:**
  * **POV Eye-Blink Loop:** 60fps `requestAnimationFrame` sampling. Ultra-fast 75ms down-stroke, 35ms void reset, 110ms opening with pupil light bloom (`brightness(1.18)` settling in 260ms).
  * **Continuous Camera Dolly:** 16s breathing push-in (`scale(1.0) -> scale(1.06)`) toward the stone facade.
* **Interactive & Atmospheric Details:**
  * **Portal Sub-Bass Heartbeat:** Ambient radial crimson pulse (`.hero-portal-heartbeat-glow`) breathing at 2.4s rhythm like a sub-bass drone inside the monument.
  * **Metallic Typography Foil Shimmer:** Diagonal metallic gleam continuously sweeping across `SWEAR IN CONTINENTAL`.
  * **Parallax Depth Cue:** As the attendee scrolls, the monument recesses into the darkness with a gentle atmospheric fog lift.

---

### Scene 02: THE GUESTS (Lineup / The Release)
* **Motion Experience:**
  * **Stage Lighting Flash Flare:** Hovering a performer portrait triggers an authentic concert strobe flare (`filter: brightness(1.25) contrast(1.15)`), mimicking sudden stage light hitting the performer.
  * **Interactive 3D Perspective Tilt:** Mouse movement over the card computes a subtle 3D tilt (`perspective(1000px) rotateX(...) rotateY(...)`), giving physical depth to the photograph.
* **Interactive & Tactile Details:**
  * **Acoustic Pulse Ring on Audio Trigger:** Clicking the brass play button (`▶`) triggers an animated acoustic ring pulsing outward (`pulse-ring`).
  * **Live Soundwave Indicator:** A quiet, 3-bar animated equalizer bar lights up beside the artist name when audio is active (`LIVE PREVIEW PLAYING`).
  * **Kinetic Day Tabs:** Toggle between `ALL NIGHTS`, `DAY 1 (30 OCT)`, and `DAY 2 (31 OCT)` with a smooth sliding background highlight.

---

### Scene 03: THE PASSAGE (Tickets / Admission Documents)
* **Motion Experience:**
  * **Specular Light Tracking:** The card surface responds to cursor coordinates (`mouseX, mouseY`), casting a subtle moving gold reflection like light hitting laminated foil.
* **Interactive & Tactile Details:**
  * **Embossed Official Seal Watermark:** An authentic official admission stamp watermark (`THE STATE OF CLAMOUR // ADMIT ONE`) faintly visible in the background, rotating 5 degrees on hover.
  * **Live Allocation Pulse Dot:** For active tiers (`PRESALE 01`), a subtle pulsing amber beacon: `"ACTIVE TIER · FAST ALLOCATION"`.
  * **Tactile Click Feedback:** Clicking `GET TICKETS →` generates a micro-ripple before opening the official checkout.

---

### Scene 04: THE NIGHT (Timetable Ledger)
* **Motion Experience:**
  * **Scanning Radar Timeline Line:** A subtle, ultra-thin crimson-gold beam slowly scanning down the ledger, giving the impression of an active operational dispatch.
* **Interactive & Tactile Details:**
  * **Row Expansion & Stage Illumination:** Hovering any timetable row illuminates it with a subtle oxblood stage gradient and reveals the stage room details with smooth micro-padding.
  * **Day 1 / Day 2 Switcher:** Clean tab toggle that transitions timetable rows with staggered fade-ins.

---

### Scene 05: BEFORE YOU ENTER (Protocols & Rules)
* **Motion Experience:**
  * **Smooth Height Spring Transition:** Expanding an accordion item animates smoothly using CSS grid interpolation without layout snapping.
  * **Rotating Brass Icon:** The plus/minus icon smoothly rotates $90^\circ$ upon toggle.
* **Interactive & Tactile Details:**
  * **Protocol Numbering:** Clean badges: `PROTOCOL [01]`, `PROTOCOL [02]`, etc.
  * **Gold Left Spine Accent:** When open, a vertical 2px antique gold border illuminates down the left edge of the card.
  * **Interactive Protocol Acknowledgment:** An interactive button at the bottom: `"I HAVE READ AND ACCEPT THE PROTOCOLS"`, displaying an animated gold checkmark when confirmed.

---

### Scene 06: ENTER THE STATE (Final CTA Gateway)
* **Motion Experience:**
  * **Volumetric Beacon Light:** A dramatic vertical beam of crimson light projecting upwards from the bottom of the section into the darkness.
* **Interactive & Tactile Details:**
  * **Magnetic Button Pull:** The primary button (`ENTER THE STATE →`) has an expanding crimson aura and subtle magnetic hover pull.
  * **Smooth Scroll Anchor:** Clicking smoothly scrolls directly to `#the-passage` and highlights the active ticket tier.

---

### Global Atmosphere: The Nocturnal Torchlight
* **Cursor-Follower Torch:** A faint, ultra-subtle ambient spotlight (`radial-gradient(circle 320px at mouseX mouseY, rgba(197, 168, 105, 0.035), transparent 80%)`) following the mouse cursor across the dark background. It creates an unforgettable feeling of holding a lantern inside a vast, dark monument.

---

## 3. Step-by-Step Execution Sequence

1. **Step 1:** Implement Global Cursor Torch & Scroll Parallax in `App.tsx` and `src/index.css`.
2. **Step 2:** Upgrade Scene 02 (`LineupSection.tsx`): 3D perspective tilt, concert strobe hover, and acoustic pulse rings on audio preview.
3. **Step 3:** Upgrade Scene 03 (`TicketSection.tsx`): Specular cursor light tracking, embossed watermark seal, and allocation pulse.
4. **Step 4:** Upgrade Scene 04 (`StageRundown.tsx`): Interactive timetable row illumination, radar scanner line, and day switcher.
5. **Step 5:** Upgrade Scene 05 (`RulesFAQ.tsx`): Smooth grid accordion, rotating brass icons, and protocol acknowledgment interaction.
6. **Step 6:** Upgrade Scene 06 (`FinalCTA.tsx`): Volumetric beacon light and magnetic hover button.
7. **Step 7:** Run `npm run build` and live browser verification.
