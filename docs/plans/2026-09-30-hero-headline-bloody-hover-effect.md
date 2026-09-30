# Hero Headline Bloody Hover Effect ("Berdarah-Darah") Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Menghadirkan efek horor interaktif "berdarah-darah" pada tipografi headline Hero ("SWEAR IN CONTINENTAL"), di mana saat kursor diarahkan atau disentuh pada teks, huruf-huruf mengalami transformasi dramatis menjadi darah kental merah tua (visceral dark crimson) lengkap dengan efek tetesan darah (blood drips) yang mengalir menetes ke bawah arsitektur monumen.

**Architecture:** 
1. **Interactive Trigger Logic (`HeroSection.tsx`)**: Menambahkan state interaktif `isHeadlineBleeding` dan tracking kursor/touch pada `.hero-editorial-headline` untuk memicu transisi efek darah seketika saat kursor masuk (`mouseenter`/`mousemove`/`touchstart`), serta efek meluruh halus saat kursor keluar (`mouseleave`/`touchend`).
2. **Text Texture Transformation (CSS & SVG Filter)**: Mengubah teks dari warna putih murni (*pristine white serif*) menjadi gradasi darah kental yang mengilap basah (*arterial liquid blood*), dipadukan dengan filter SVG distorsi likuid (`feTurbulence` + `feDisplacementMap`) dan crimson demonic chromatic shadow glow.
3. **Procedural SVG Blood Drips**: Menempatkan elemen tetesan darah (*blood stalactites / drips*) di sepanjang tangkai bawah huruf ("S", "W", "E", "A", "R", "C", "O", "N", "T", dll.) yang memanjang ke bawah dengan akselerasi gravitasi saat di-hover.
4. **Wall Blood Runoff Backdrop**: Memberikan efek lelehan darah halus yang mengalir dari bawah headline ke arah kolom batu monumen di latar belakang, sesuai dengan referensi visual horor poster.

**Tech Stack:** React 19, TypeScript, CSS Keyframe Animations & GPU-accelerated transforms, SVG Filters, Playwright Browser Verification.

---

### Task 1: SVG Liquid Blood Filter & Drip Overlay Architecture in `HeroSection.tsx`

**Files:**
- Modify: `src/components/HeroSection.tsx`

**Step 1: Definisikan Komponen / SVG Filter untuk Efek Darah Cair**
Tambahkan elemen `<svg>` tersembunyi berdimensi 0×0 yang mendefinisikan filter:
- `<filter id="blood-liquid-displace">`: Menggunakan `feTurbulence` (tipe `fractalNoise`, frekuensi rendah untuk bentuk organik) dan `feDisplacementMap` untuk memberikan tepi huruf yang tampak basah meleleh dan tidak beraturan layaknya darah kental yang mengalir.
- Warna gradasi darah kental: kombinasi `#2b0004` (darah mengering), `#8b0000` (deep crimson), dan `#e11d48` (bright visceral arterial red).

**Step 2: Tambahkan Procedural Blood Drips di Bawah Huruf Headline**
Di dalam `.hero-editorial-headline`, letakkan overlay container `.hero-blood-drips-layer` yang memuat path tetesan darah SVG yang tersinkronisasi dengan posisi huruf:
```tsx
<div className={`hero-blood-drips-layer ${isBleeding ? 'is-dripping' : ''}`} aria-hidden="true">
  {/* Variasi tetesan darah panjang, sedang, dan tetesan menetes */}
  <svg viewBox="0 0 1000 120" preserveAspectRatio="none" className="blood-drips-svg">
    {/* Jalur tetesan darah organik yang mengalir ke bawah */}
    ...
  </svg>
</div>
```

**Step 3: Tambahkan Event Listener Hover & Touch pada Headline**
- `onMouseEnter={() => setIsBleeding(true)}`
- `onMouseLeave={() => setIsBleeding(false)}`
- `onTouchStart={() => setIsBleeding(prev => !prev)}`

---

### Task 2: Implementasi Styling "Berdarah-Darah" di `src/styles/hero.css`

**Files:**
- Modify: `src/styles/hero.css`

**Step 1: Styling State Normal vs State Berdarah pada `.hero-editorial-headline`**
- Normal:
  ```css
  .hero-editorial-headline {
    color: #FFFFFF;
    text-shadow: 0 4px 30px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 0, 0, 0.85);
    transition: all 450ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  ```
- State Berdarah (`.hero-editorial-headline.is-bleeding`):
  ```css
  .hero-editorial-headline.is-bleeding {
    background: linear-gradient(
      180deg,
      #3f0006 0%,
      #8b0000 28%,
      #be123c 62%,
      #5c0d12 88%,
      #200003 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 
      0 0 20px rgba(225, 29, 72, 0.85),
      0 0 40px rgba(139, 0, 0, 0.9),
      0 8px 30px rgba(0, 0, 0, 0.95);
    filter: url(#blood-liquid-displace) drop-shadow(0 0 15px rgba(225, 29, 72, 0.4));
    transform: scale(1.018);
  }
  ```

**Step 2: Animasi Tetesan Darah Memanjang (Gravity Acceleration Drips)**
- Buat keyframe animation `@keyframes blood-drip-flow`:
  - `0%`: `transform: scaleY(0); opacity: 0;`
  - `30%`: `transform: scaleY(0.45); opacity: 0.85;`
  - `70%`: `transform: scaleY(0.9); opacity: 0.95;`
  - `100%`: `transform: scaleY(1); opacity: 1;`
- Buat partikel tetesan yang lepas (*falling droplets*):
  - `@keyframes blood-drop-fall`: tetesan kecil yang jatuh ke bawah menuju pintu merah monumen lalu memudar.

**Step 3: Background Stone Vein Blood Runoff**
- Tambahkan efek lelehan darah di dinding arsitektur (`.hero-blood-wall-runoff`):
  - Linear/radial blend gradient merah darah kental dengan blend mode `multiply` / `color-burn` di atas latar belakang batu monumen.
  - Opasitas transisi dari 0 menjadi 0.75 saat headline di-hover.

---

### Task 3: Polishing Responsivitas Mobile & Integrasi Interaksi

**Files:**
- Modify: `src/styles/hero.css`
- Modify: `src/styles/responsive.css` (jika ada override mobile)

**Step 1: Penyesuaian Viewport Mobile (390px)**
- Pada layar sentuh smartphone, tetesan darah diskalakan agar proporsional dengan font clamp `clamp(3.2rem, 7.8vw, 6.8rem)`.
- Mengizinkan toggle sentuh (*tap on headline*) sehingga pengguna ponsel dapat menikmati efek yang sama persis seperti desktop hover.

**Step 2: Transisi Dwell & Fade-out yang Lembut**
- Saat kursor meninggalkan headline, darah tidak langsung menghilang kasar dalam 1 frame, melainkan memudar secara sinematik selama 600ms (`transition: opacity 600ms ease, filter 600ms ease`).

---

### Task 4: Verifikasi & Testing E2E Visual

**Files:**
- Run: `npm run build` (memastikan zero error di TypeScript & Vite)
- Create & Run: `verify_blood_text_hover.py` (Playwright E2E)

**Step 1: Test Compile & Build**
Jalankan `npm run build` untuk memverifikasi sintaks TypeScript dan bundle Vite.

**Step 2: Test Playwright Desktop Hover**
- Buka `http://localhost:5173/` pada resolusi 1440×900.
- Tangkap screenshot sebelum hover: Teks headline berwarna putih bersih.
- Arahkan kursor (`hover()`) tepat di atas teks `SWEAR IN CONTINENTAL`.
- Verifikasi perubahan class `is-bleeding`, perubahan style background-clip, dan kemunculan elemen tetesan darah.
- Tangkap screenshot saat hover untuk verifikasi visual estetika darah kental.

**Step 3: Test Playwright Mobile Tap**
- Buka pada resolusi 390×844 (viewport mobile).
- Tap pada headline dan verifikasi efek berdarah aktif.
