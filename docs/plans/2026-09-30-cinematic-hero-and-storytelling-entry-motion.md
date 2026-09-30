# Implementation Plan: Cinematic Hero Elevation & Storytelling Entrance Motion

**Goal:** 
1. Reconstruct the **Hero Section** to match the user's uploaded reference mockup 1:1: pure black background fading into dark smoke/fog, massive high-contrast serif display `SWEAR IN CONTINENTAL` (Playfair Display), subtitle `The State of Clamour`, editorial description, and twin ghost buttons (`Enter The State →` / `The Guests →`) with no top navbar.
2. Resolve the "kosong melompong" (empty feeling) in the **Storytelling Section** (`GuestStorytellingTransition`): Introduce an evocative cinematic entrance motion / ritual welcome reveal ("WELCOME TO THE ASSEMBLY" / "THE DOORS ARE UNSEALED") with atmospheric lighting, ambient mist, and crowd sound/pulse cues as the cathedral portal unseals.
3. Optimize the scroll expansion to be buttery smooth (60fps/120fps) using GPU-accelerated `clip-path` / `transform` and LERP scroll dampening, eliminating all layout reflow lag.

---

### User Feedback & Requirements Addressed

| Issue / Request | Root Cause | Solution |
| :--- | :--- | :--- |
| **Hero Design & Font** | Hero still had the previous layout with video and metallic gold gradient instead of the stark editorial aesthetic in the mockup. | Apply `Playfair Display` serif for `SWEAR IN CONTINENTAL`, clean Inter subtitle and description, twin ghost buttons with arrows, and volumetric smoke/fog background over pure `#000000`. |
| **Tanpa Nav** | `FloatingNavbar` is rendered above the hero. | Omit/hide the navbar from the hero so the first screen is 100% pure focused hero. |
| **"Masih Kosong Melompong"** | The climax of the storytelling section had removed all text, leaving just a static raw photograph with no emotional narrative closure. | Add a cinematic welcome & ritual entrance reveal: as the cathedral portal fills the screen, reveal an elegant monumental overlay ("WELCOME TO THE ASSEMBLY" / "YOU HAVE ENTERED THE SANCTUARY"), glowing stage torchlight, and interactive cue. |
| **"Transisi Kurang Smooth"** | Previous implementation calculated inline pixel `width` and `height`, forcing browser layout reflows on every scroll frame. | Migrate to GPU-accelerated CSS `clip-path: inset(...)` and `transform: scale(...)` with smooth LERP (Linear Interpolation) damping on `requestAnimationFrame`. |

---

### Phase 1: Typography & CSS Design System Tokens

**Files:**
- Modify: `index.html` (verify `Playfair Display:wght@400..900` Google font link)
- Modify: `src/styles/tokens.css` (tokens for `--font-display-serif`, `--color-smoke`, ghost button variables)
- Modify: `src/styles/hero.css` (hero layout, typography, smoke atmosphere, ghost buttons)

**Tasks:**
1. Configure `--font-display-serif: 'Playfair Display', Georgia, serif;` in `src/styles/tokens.css`.
2. Re-architect `src/styles/hero.css`:
   - Hero container: `min-height: 100vh; background: #000000; overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center;`
   - Atmosphere: Dark volumetric smoke clouds rising from bottom (`hero_smoke_atmosphere.jpg` with radial black gradient fade).
   - Display title:
     - `SWEAR IN` (Line 1)
     - `CONTINENTAL` (Line 2)
     - Font: `Playfair Display`, `font-size: clamp(3.2rem, 8vw, 6.8rem)`, stark white `#FFFFFF`, line-height `1.02`.
   - Subtitle:
     - `The State of Clamour` (Inter, 500 weight, white `#FFFFFF`, margin-top `2.5rem`).
   - Description:
     - `A Halloween night of music, movement, and atmosphere. Two nights where the silence breaks.` (Inter, 400 weight, `rgba(255, 255, 255, 0.72)`, max-width 580px).
   - Ghost outline buttons:
     - Two buttons: `Enter The State →` and `The Guests →`
     - Border: `1px solid rgba(255, 255, 255, 0.4)`, transparent background, white text, 2px border radius, subtle hover glow.

---

### Phase 2: Hero Section Component (`src/components/HeroSection.tsx`)

**Files:**
- Modify: `src/components/HeroSection.tsx`
- Modify: `src/pages/HomePage.tsx`

**Tasks:**
1. Update `HeroSection.tsx` JSX to match the exact mockup structure:
   - Atmospheric background with subtle slow drift animation.
   - Monumental editorial typography:
     - `<h1>` with `SWEAR IN` and `CONTINENTAL` in `Playfair Display`.
     - Subtitle `The State of Clamour`.
     - Editorial copy paragraph.
     - Button cluster:
       - `<button onClick={onEnterState}>Enter The State →</button>`
       - `<button onClick={onExploreGuests}>The Guests →</button>`
2. Remove/hide top `FloatingNavbar` on initial load (`HomePage.tsx`).
3. Connect button triggers:
   - `Enter The State →` smoothly scrolls to ticket passes (`#the-passage`).
   - `The Guests →` smoothly scrolls to storytelling transition (`#the-guests`).

---

### Phase 3: Butter-Smooth GPU-Accelerated Storytelling Transition

**Files:**
- Modify: `src/components/GuestStorytellingTransition.tsx`
- Modify: `src/styles/storytelling.css`

**Tasks:**
1. **Implement LERP (Linear Interpolation) Scroll Smoothing:**
   - Use a smoothed target value for scroll progress: `currentProgress += (targetProgress - currentProgress) * 0.1` on each animation frame.
   - This eliminates trackpad/mousewheel stepping jitter and provides a fluid filmic feel.
2. **GPU-Accelerated Unmasking (`clip-path` & `transform`):**
   - Instead of modifying `element.style.width` and `element.style.height`, wrap the landscape cathedral image in a fixed full-viewport canvas and animate `clip-path: inset(...)`.
   - Initial state (progress 0): `clip-path: inset(calc(50% - 240px) calc(50% - 135px))` (exact 9:16 portrait in center of black screen).
   - Scroll progression (progress 0 $\rightarrow$ 0.85): Inset reduces smoothly to `inset(0% 0%)`.
   - Image transform: `transform: scale(1 + 0.08 * smoothedProgress)` for subtle camera push-in.
   - All animations run on compositor thread (0 layout reflows, locked 60/120fps).

---

### Phase 4: Cinematic Entrance Reveal Motion ("Eliminating Kosong Melompong")

**Files:**
- Modify: `src/components/GuestStorytellingTransition.tsx`
- Modify: `src/styles/storytelling.css`

**Tasks:**
1. **The Entrance Climax Motion (Progress 0.80 $\rightarrow$ 1.0):**
   - As the cathedral doors unmask to full-bleed, trigger an evocative cinematic arrival layer:
     - **Chapter Badge:** `SCENE 02 // SANCTUARY UNSEALED` (Antique Gold, small letter-spacing).
     - **Monumental Greeting:** `WELCOME TO THE ASSEMBLY` (Playfair Display / Cinzel, luminous ivory with soft atmospheric drop shadow).
     - **Editorial Voice:** *"Step across the threshold. The silence breaks inside."* (Cormorant Garamond italic).
     - **Interactive Invitation:** Subtle breathing indicator `[ MASUK KE PANGGUNG UTAMA ↓ ]` which smoothly guides visitor into the lineup.
2. **Atmospheric FX at Climax:**
   - Volumetric amber & oxblood candlelight glow (`radial-gradient`) radiating from the cathedral interior altar.
   - Soft rising smoke particles / haze overlay for authentic Halloween nightlife energy.

---

### Phase 5: Verification & Quality Assurance

**Tasks:**
1. Compile test: `npm run build` (`tsc -b && vite build`) to confirm 0 TypeScript / CSS bundling errors.
2. Visual test via Playwright script:
   - Capture Hero section at 1440x900 (verify typography, buttons, smoke background).
   - Capture Storytelling section initial state (9:16 portrait).
   - Capture Storytelling expansion (smooth unmasking).
   - Capture Storytelling entrance motion (verify "Welcome to the Assembly" reveal and atmospheric lighting).
3. Test smooth scrolling performance across Desktop and Mobile viewports.
4. Update Obsidian vault (`ActiveContext.md` and session logs).
