# Mobile View Master Experience Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Menghadirkan pengalaman mobile view (layar sentuh ponsel ≤ 768px dan ≤ 480px) kelas dunia (*world-class cinematic mobile experience*), bebas tabrakan visual, ergonomis untuk jempol (*thumb-zone friendly*), transisi audio/video responsif dan mulus, serta performa rendering konsisten di 60/120fps.

**Architecture:** Desain mobile-first berbasis token CSS sentral (`src/styles/tokens.css`, `responsive.css`), memanfaatkan hardware acceleration (`transform: translate3d`, `will-change`), modular CSS, dynamic viewport units (`100dvh`, `100svh`), touch ergonomics (target sentuh minimum 44px–48px), dan koordinasi state audio terpusat via `audioCoordinator.ts`.

**Tech Stack:** React 18, TypeScript, Vite 6, Vanilla CSS (Design Tokens, Container/Media Queries), Lucide Icons, Mobile Web APIs (IntersectionObserver, Touch Events, Safe Area Insets).

---

## 📋 Daftar Tugas & Rencana Eksekusi

### Task 1: Global Mobile Viewport & Root Overflow Protection
Memastikan seluruh halaman bebas dari kebocoran scroll horizontal (*horizontal overflow leak*), mendukung *safe area insets* (notch iPhone, dynamic island, pill bar Android), dan responsif terhadap *dynamic viewport height* (`100dvh`).

**Files:**
- Modify: `src/index.css:1-60`
- Modify: `src/styles/tokens.css:90-130`
- Modify: `src/styles/responsive.css:1-50`

**Step 1: Definisikan Safe-Area & Dynamic Height Tokens**
- Tambahkan CSS tokens untuk safe-area:
  ```css
  --safe-top: max(1rem, env(safe-area-inset-top));
  --safe-bottom: max(1rem, env(safe-area-inset-bottom));
  --safe-left: max(1rem, env(safe-area-inset-left));
  --safe-right: max(1rem, env(safe-area-inset-right));
  ```
- Kunci `html, body` dengan `overflow-x: hidden; width: 100%; -webkit-overflow-scrolling: touch;`.

**Step 2: Verifikasi & Test**
- Periksa bahwa scroll horizontal tidak terjadi di viewport 360px, 390px, dan 414px.

---

### Task 2: Hero Living Poster Mobile Optimization (Scene 01)
Menyempurnakan Hero Section di layar ponsel: judul monumental (*clamp* ukuran dinamis), spasi *top announcement bar*, atmosfer kabut, dan tombol aksi `ENTER →`.

**Files:**
- Modify: `src/components/HeroSection.tsx:40-120`
- Modify: `src/styles/hero.css:80-160`
- Modify: `src/styles/responsive.css:70-135`

**Step 1: Penskalaan Tipografi & Spasi Aman Layar Sempit (< 400px)**
- Atur font size judul kampanye di mobile:
  ```css
  .hero-campaign-headline {
    font-size: clamp(1.45rem, 6.4vw, 2.15rem);
    line-height: 1.14;
    letter-spacing: 0.08em;
  }
  ```
- Optimasi spasi antara *Top Announcement Ticker* dengan tumpukan konten Hero agar tidak saling bertumpuk.

**Step 2: Thumb Zone untuk Tombol `ENTER →`**
- Pastikan tombol `ENTER →` berada di jangkauan jempol bawah, min-height 48px, dengan `touch-action: manipulation` dan active press feedback (`scale(0.97)`).
- Mengarahkan langsung ke `#the-guests` secara mulus.

---

### Task 3: Section 1 Storytelling Transition Mobile Pacing (The Guests 01)
Mengoptimalkan runway scroll dan kenyamanan baca teks pada transisi katedral sinematik `GuestStorytellingTransition.tsx`.

**Files:**
- Modify: `src/components/GuestStorytellingTransition.tsx:405-420`
- Modify: `src/styles/storytelling.css:380-550`
- Modify: `src/styles/responsive.css:125-155`

**Step 1: Pacing Runway Scroll Mobile (290vh)**
- Pada desktop runway berjarak `360vh`. Pada mobile, atur ketinggian runway ke `290vh` via CSS media query:
  ```css
  @media (max-width: 768px) {
    .storytelling-container {
      height: 290vh !important;
    }
  }
  ```
  *Rationale: Mengurangi kelelahan jempol pengguna ponsel saat melakukan swipe vertikal, sambil tetap mempertahankan pacing unmasking katedral yang dramatis.*

**Step 2: Keterbacaan Teks Sambutan Katedral ("WELCOME TO THE ASSEMBLY")**
- Pertajam kontras teks sambutan di mobile dengan radial shadow dan video dim overlay yang lebih pekat saat teks muncul di progress 0.36–0.90.
- Periksa cue scroll "GULIR KE BAWAH ↓" di ponsel agar tidak terhalang safe-area bottom bar.

---

### Task 4: Section 2 Lineup Carousel & Audio Interactivity (Scene 02)
Menyempurnakan carousel kartu penampil (MALVIN & BASBOI / FAR & ELENA), visual feedback audio aktif, dan peek affordance swipe.

**Files:**
- Modify: `src/components/LineupSection.tsx:140-230`
- Modify: `src/styles/lineup.css:200-350`
- Modify: `src/styles/responsive.css:160-195`

**Step 1: Peek Affordance & Margin Swipe Mobile**
- Atur lebar kartu di mobile:
  ```css
  .guests-editorial-grid .guest-card-container {
    flex: 0 0 82vw !important;
    max-width: 320px !important;
    scroll-snap-align: center !important;
    scroll-snap-stop: always !important;
  }
  ```
  *Rationale: Sisa 18vw di sisi kanan memperlihatkan potongan kartu berikutnya secara alami, memberi sinyal visual instan kepada user untuk melakukan swipe.*

**Step 2: Visual Breathing Glow Saat Audio Aktif**
- Tambahkan efek border gold subtle pulse pada kartu yang sedang memutar audio di mobile:
  ```css
  .guest-card-container.is-playing-audio {
    border-color: var(--color-gold-antique);
    box-shadow: 0 0 25px rgba(197, 168, 105, 0.32), inset 0 0 15px rgba(197, 168, 105, 0.12);
  }
  ```
- Perjelas badge `LIVE` mini equalizer bar di sudut kanan atas info pane.

**Step 3: Navigasi & Target Sentuh Kontrol Bawah**
- Tombol arrow *Prev/Next* dan dot nama artis: min-height 44px, bebas tap-highlight biru bawaan browser, nyaman ditekan jempol.
- Tombol `LIHAT DETAIL EVENT →` memiliki area sentuh luas (min 44px) terpisah dari tap toggle audio.

---

### Task 5: Section 3 Timetable & Event Cards Mobile Ergonomics (Scene 03)
Menyempurnakan kartu event Night I dan Night II di `StageRundown.tsx`.

**Files:**
- Modify: `src/components/StageRundown.tsx:35-180`
- Modify: `src/styles/rundown.css:1-150`
- Modify: `src/styles/responsive.css:210-270`

**Step 1: Stack Layout Responsif Kartu Event**
- Susun highlight grid (Tanggal, Jam, Panggung, Batas Usia) menjadi 2 kolom rapi di layar ponsel dengan padding yang nyaman.
- Tombol `DETAIL EVENT NIGHT I →` dan `DETAIL EVENT NIGHT II →` full-width 100% dengan min-height 48px.

---

### Task 6: Section 4 Admission Tickets Mobile Optimization (Scene 04)
Menyempurnakan kartu tiket di `TicketsSection.tsx`.

**Files:**
- Modify: `src/components/TicketsSection.tsx:30-150`
- Modify: `src/styles/tickets.css:80-220`
- Modify: `src/styles/responsive.css:195-215`

**Step 1: Card Structure & Price Display**
- Tata letak kartu tiket (General Admission vs VIP Sanctuary) dengan kontras harga gold metallic yang terbaca jelas.
- Tombol `AMBIL TIKET →` full-width dengan state `:active` yang empuk (*tactile compression*).

---

### Task 7: Floating Navbar & Mobile Navigation Drawer
Menyempurnakan drawer navigasi mobile frosted glass di `FloatingNavbar.tsx`.

**Files:**
- Modify: `src/components/FloatingNavbar.tsx:75-214`
- Modify: `src/styles/navbar.css:95-220`

**Step 1: Frosted Acrylic Glass Drawer**
- Backdrop blur `18px`, background dark obsidian semi-transparan `rgba(6, 7, 9, 0.94)`.
- Dukungan safe area insets atas (`padding-top: max(1.5rem, env(safe-area-inset-top))`) dan bawah.
- Tombol close silang `X` berada di sudut kanan atas dengan touch target 48x48px.
- Link menu besar (*01 BINTANG TAMU*, *02 TIKET ACARA*, *03 JADWAL ACARA*, *✦ DETAIL EVENT*) dengan divider tipis dan feedback tekan visual.

---

### Task 8: Event Details / Dossier Page Mobile Perfection
Menyempurnakan modal/halaman penuh detail acara di `EventDetailsPage.tsx`.

**Files:**
- Modify: `src/pages/EventDetailsPage.tsx:28-130`
- Modify: `src/styles/dossier.css:150-320`
- Modify: `src/styles/responsive.css:335-510`

**Step 1: Horizontal Scrollable Tabs**
- Tab bar horizontal: *01 // RUNDOWN*, *02 // VENUE*, *03 // PROTOKOL*, *04 // FAQ*.
- Menghilangkan scrollbar jelek (`scrollbar-width: none`), mendukung geser halus dengan touch momentum (`-webkit-overflow-scrolling: touch`).
- Tab aktif mendapatkan pill background gold antique metalik.

**Step 2: Timetable Mobile Matrix & Protocol Specs**
- Susunan jadwal rundown vertikal jam per jam yang tidak terpotong pada layar 360px.
- Item checklist protokol dengan ikon SVG (centang hijau/gold, peringatan merah) yang sejajar rapi.

---

### Task 9: Verifikasi Komprehensif & Build Test
- Menjalankan build produksi `npm run build` (`tsc -b && vite build`) untuk verifikasi 0 error.
- Pengujian responsiveness pada resolusi:
  - 360 x 800 (Galaxy S20)
  - 390 x 844 (iPhone 12 / 13 / 14)
  - 414 x 896 (iPhone XR / 11)
  - 768 x 1024 (iPad / Tablet mini)
- Sinkronisasi log sesi ke Obsidian Vault.

---

## 🎯 Indikator Keberhasilan (Definition of Done)
1. **Zero Horizontal Scroll:** Tidak ada geser samping liar di layar hp mana pun (`overflow-x: hidden`).
2. **Ergonomic Touch Targets:** Seluruh tombol dan link interaktif memiliki tinggi minimal 44px–48px.
3. **Smooth Video & Audio Flow:** Section 1 video terus berputar tanpa pause; Section 2 audio aktif saat tap dan berpindah mulus saat swipe; Section 1 aktif kembali saat scroll ke atas.
4. **Cinematic Aesthetic:** Tipografi Michroma / Monumental tetap anggun, tidak terpotong, dan kontras visual tajam di layar OLED/LCD ponsel.
5. **Clean Production Build:** `tsc -b && vite build` lolos 100% tanpa error.
