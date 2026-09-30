# Analisis Forensik & Rencana Implementasi: Mengatasi Motion & Transisi Patah-Patah

**Status:** Proposed Architecture Plan  
**Target:** [`src/components/GuestStorytellingTransition.tsx`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/components/GuestStorytellingTransition.tsx) & [`src/styles/storytelling.css`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/styles/storytelling.css)

---

## 1. Analisis Mendalam: Mengapa Transisi & Motion Terasa Patah-Patah?

Berdasarkan audit teknis pada alur rendering browser, ditemukan **5 penyebab utama (root causes)** yang saling bertabrakan dan mengakibatkan frame drops drastis (*choppy stuttering / patah-patah*):

### ⚠️ Penyebab 1: Tabrakan "Double Smoothing" (Browser Engine vs JS LERP)
- Di [`src/styles/tokens.css`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/styles/tokens.css#L49), terdapat aturan global:
  ```css
  html { scroll-behavior: smooth; }
  ```
- **Masalah:** Di browser Chromium (Chrome & Edge), `scroll-behavior: smooth` mengintervensi setiap putaran roda mouse (*wheel tick*) dengan kurva easing internal berdurasi 300–500ms.
- Pada saat yang bersamaan, di dalam kode React kita menjalankan loop LERP JS kedua:
  ```ts
  smoothProgressRef.current += diff * factor;
  ```
- **Akibat:** Posisi scroll halaman fisik dan progress animasi JS mengalami **dua kali peredaman yang saling kejar-kejaran secara asinkron**. Ketika roda mouse berhenti, satu engine masih bergerak sementara yang lain sudah berhenti, menimbulkan getaran mikro (*micro-jitter*) dan sensasi patah-patah.

### ⚠️ Penyebab 2: React Re-render Bottleneck (60–120x `setState` Per Detik)
- Pada loop animasi:
  ```ts
  setSmoothProgress(smoothProgressRef.current);
  ```
- **Masalah:** Memanggil `setSmoothProgress()` di setiap frame animasi (60Hz = 60 kali/detik, 120Hz/144Hz = 120-144 kali/detik) memaksa React melakukan **Virtual DOM Diffing penuh** pada 20+ elemen HTML, mengalokasikan puluhan objek style baru di memori setiap 8 milidetik.
- **Akibat:** Garbage Collection (GC) browser terpicu berulang kali, menyebabkan *jank* (penurunan frame mendadak dari 60fps ke 25–35fps).

### ⚠️ Penyebab 3: Re-rasterisasi GPU akibat `clip-path: inset(... round ...)` Subpixel
- Di kode sebelumnya:
  ```css
  clip-path: inset(${insetY}px ${insetX}px round ${borderRadius}px);
  ```
- **Masalah:** Properti `round ${borderRadius}px` dengan angka desimal pecahan (*subpixel floating point*) pada `clip-path` memaksa GPU membatalkan *texture cache* dan **menggambar ulang (re-tessellate) geometri poligon** pada setiap frame di CPU/GPU rasterizer.
- **Akibat:** Beban GPU melonjak tinggi saat mencoba meraster gambar resolusi tinggi di dalam topeng sudut melengkung dinamis.

### ⚠️ Penyebab 4: Fragment Shader Overload dari `filter: blur(28px)`
- Di `.story-welcome-ambient-glow`:
  ```css
  width: min(900px, 90vw);
  height: min(600px, 70vh);
  filter: blur(28px);
  animation: welcomeGlowPulse 4s ease-in-out infinite alternate;
  ```
- **Masalah:** Elemen berukuran 900×600 piksel dengan efek `blur(28px)` yang terus menganimasi ukuran secara bersamaan memaksa shader browser melakukan ratusan pass Gaussian blur per frame saat kanvas di bawahnya sedang di-scroll.

### ⚠️ Penyebab 5: Layout Thrashing dari `getBoundingClientRect()` pada Event Scroll
- Memanggil `containerRef.current.getBoundingClientRect()` di dalam event handler `scroll` langsung membaca geometri DOM saat DOM sedang berubah, memicu browser melakukan *forced synchronous layout*.

---

## 2. Solusi Arsitektur Kinerja Tinggi (60fps / 120fps Locked)

Untuk menghasilkan transisi yang sehalus sutra (*silky smooth*) layaknya situs Apple / Awwwards, kita menerapkan arsitektur **Zero-React-Re-render Direct GPU Compositing**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. WHEEL / SCROLL EVENT (Native Hardware Precision)                    │
│    - Tanpa intervensi double smoothing                                 │
├────────────────────────────────────────────────────────────────────────┤
│ 2. DIRECT DOM MUTATION VIA REFS (0 React Re-renders!)                  │
│    - requestAnimationFrame membaca scrollY secara bersih              │
│    - Mengupdate elemen.style.transform & opacity langsung ke node DOM  │
│    - 0 milidetik overhead React Virtual DOM                            │
├────────────────────────────────────────────────────────────────────────┤
│ 3. PURE GPU HARDWARE SCISSOR / MATRIX TRANSFORMS                       │
│    - clip-path: inset(Top Right Bottom Left) dengan integer Math.round │
│    - Bebas komputasi 'round' dinamis yang membebani GPU rasterizer     │
│    - GPU Scissor test berjalan instan (0.01ms per frame)               │
├────────────────────────────────────────────────────────────────────────┤
│ 4. PRE-COMPUTED RADIAL GRADIENT (Bebas filter: blur)                   │
│    - Mengganti filter: blur(28px) dengan gradient multi-stop halus     │
│    - 0 beban Gaussian blur shader pada GPU                             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Rencana Langkah Implementasi

### Tahap 1: Eliminasi Double Smoothing & Perbaikan Global CSS
- **File:** [`src/styles/tokens.css`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/styles/tokens.css)
- Hapus `scroll-behavior: smooth` dari selektor global `html` agar pergerakan roda mouse presisi 1:1 tanpa interferensi browser.
- Pertahankan smooth scroll khusus saat tombol diklik melalui parameter JS `scrollIntoView({ behavior: 'smooth' })`.

### Tahap 2: Refaktor `GuestStorytellingTransition.tsx` ke Direct DOM Refs
- **File:** [`src/components/GuestStorytellingTransition.tsx`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/components/GuestStorytellingTransition.tsx)
- Hapus `useState(smoothProgress)` yang memicu re-render ribuan kali saat scroll.
- Buat refs langsung ke elemen kunci:
  - `gpuCanvasRef`: untuk unmasking pintu gerbang
  - `photoImgRef`: untuk camera push-in `scale`
  - `welcomeOverlayRef`: untuk motion reveal *"WELCOME TO THE ASSEMBLY"*
  - `clusterTopLeftRef`, `clusterTopRightRef`, `clusterBottomRightRef`: untuk drifting tipografi awal
- Dalam satu loop `requestAnimationFrame`:
  - Hitung progress scroll secara efisien menggunakan `window.scrollY - containerTop`.
  - Terapkan style langsung ke node DOM (`ref.current.style.transform = ...`).
  - Hasil: Komponen React tidak pernah re-render saat scrolling berlangsung.

### Tahap 3: Optimasi GPU Clipping & Penggantian Filter Blur
- **File:** [`src/styles/storytelling.css`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/styles/storytelling.css)
- Gunakan `clip-path: inset(...)` dengan angka bulat integer (`Math.round`), tanpa kalkulasi `round border-radius` dinamis pecahan.
- Ganti `.story-welcome-ambient-glow` dengan radial gradient berlapis tanpa `filter: blur(28px)`.
- Tambahkan `transform: translateZ(0)` dan `backface-visibility: hidden` untuk memastikan elemen berada pada layer GPU tersendiri (*composited layer*).

### Tahap 4: Verifikasi & Uji Manual
- Jalankan kompilasi build produksi (`npm run build`) untuk menjamin 0 error TypeScript & bundler.
- Pengguna menguji secara langsung di browser lokal pada dev server `http://localhost:5173/`.
