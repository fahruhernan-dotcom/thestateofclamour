# Rencana Implementasi: Direct Touch & Pointer Swipe Section 2 (The Guests)

> **Tujuan:** Menghadirkan pengalaman gestur sentuh langsung (*direct touch swipe & drag*) yang responsif, licin, dan natural pada carousel Section 2 (The Guests) di perangkat mobile / layar sentuh, tanpa konflik antara gestur menggeser (*swiping*) dan penekanan kartu (*tapping*).

---

## 🔍 Analisis Masalah Saat Ini

1. **Konflik Tap vs Swipe (`onClick` Interception):**
   - Saat ini kartu artis (`GuestCard`) memasang `onClick={handleCardClick}` langsung pada tag `<article>`.
   - Di perangkat sentuh (touchscreen) maupun simulator browser, ketika pengguna meletakkan jari dan menggeser layar (*swipe*), saat jari diangkat (*touchend*), browser tetap memicu event `click`.
   - Akibatnya, setiap gestur swipe secara tidak sengaja menyalakan/mematikan audio (`toggle ON/OFF`) atau membuka modal, sehingga pengalaman menggeser terasa kaku dan terganggu.

2. **Ketiadaan Drag-to-Scroll Pointer:**
   - Kontainer carousel `.guests-editorial-grid` saat ini murni mengandalkan CSS native `overflow-x: auto`.
   - Pada pengujian di browser desktop (termasuk DevTools Responsive Mode dengan kursor mouse) atau layar sentuh laptop tertentu, pengguna tidak dapat "klik dan tarik langsung" (*drag-to-scroll*) jika kursor mouse digunakan tanpa touch emulation.

3. **Resistensi Scroll Snap (`scroll-snap-stop: always`):**
   - Properti `scroll-snap-stop: always` memaksa browser berhenti kaku di setiap batas kartu, membuat gerakan jari (*flick / fling*) terasa berat dan terperangkap (*sticky*).

4. **Spesifikasi `touch-action`:**
   - Perlu penegasan `touch-action: pan-y` pada `.guests-editorial-grid` dan `.guest-card-container` agar scroll vertikal halaman tetap bebas bergerak, sementara gestur geser horizontal direspons secara instan 1:1 oleh carousel.

---

## 🎯 Target Pengalaman Baru (*Desired Experience*)

1. **Gestur Geser Langsung 1:1 (Direct Touch Drag):**
   - Begitu jari (atau kursor mouse) menyentuh kartu dan bergeser > 6px, carousel langsung bergerak secara instan (*real-time 1:1 tracking*) mengikuti posisi jari.
2. **Pemisahan Jelas antara Tap & Drag:**
   - **Pergerakan < 6px:** Dianggap sebagai **Tap** (menyalakan/mematikan sampel audio artis).
   - **Pergerakan ≥ 6px:** Dianggap sebagai **Drag / Swipe** (menggeser kartu). Event `click` otomatis diredam/dibatalkan (`e.stopPropagation()` & flag `isDragging = true`).
3. **Inersia & Auto-Snap Cerdas (Momentum / Flick):**
   - Jika pengguna melakukan *flick* (gesekan cepat dengan delta > 40px atau kecepatan tinggi), carousel langsung berpindah dengan mulus (*smooth snap*) ke kartu berikutnya atau sebelumnya.
   - Jika gesekan dilepas di tengah jalan tanpa kecepatan tinggi, carousel otomatis merapat (*snap*) ke kartu terdekat yang paling proporsional di tengah layar.
4. **Sinkronisasi Audio Berjalan Mulus:**
   - Ketika kartu yang baru merapat ke tengah layar selesai digeser, audio penampil otomatis mengikuti artis yang berada di tengah (jika audio sebelumnya aktif).
5. **Indikator Kursor Desktop:**
   - Di mode desktop/emulator, tambahkan `cursor: grab` dan `cursor: grabbing` saat ditekan agar pengguna tahu kartu bisa digeser langsung.

---

## 📋 Langkah-Langkah Eksekusi (Action Items)

### Task 1: Implementasi Hook Gestur Sentuh & Pointer Terpadu di `LineupSection.tsx`
- **File:** `src/components/LineupSection.tsx`
- Tambahkan state dan ref gestur:
  - `isDraggingRef`: boolean penanda apakah pengguna sedang dalam proses drag aktif.
  - `startXRef`: koordinat X awal saat sentuhan/klik dimulai.
  - `startScrollLeftRef`: posisi `scrollLeft` kontainer saat gestur dimulai.
  - `dragDistanceRef`: akumulasi jarak perpindahan horizontal.
  - `hasMovedRef`: flag untuk membedakan tap vs drag.
- Pasang event handler pada `.guests-editorial-grid`:
  - `onPointerDown`: Mencatat koordinat awal, melepaskan `scrollSnapType` sementara agar pergerakan jari terasa 100% bebas hambatan (*frictionless*).
  - `onPointerMove`: Memperbarui `scrollLeft` secara instan 1:1 jika pointer sedang ditekan dan mendeteksi arah geser.
  - `onPointerUp` / `onPointerCancel`: Mengaktifkan kembali `scrollSnapType`, menghitung kartu terdekat atau arah flick, lalu melakukan smooth scroll ke kartu target.
  - `onClickCapture`: Mencegah event click terpancar ke kartu jika `hasMovedRef` bernilai `true` (perpindahan > 6px).

### Task 2: Perbaikan Penanganan Tap pada `GuestCard`
- **File:** `src/components/LineupSection.tsx`
- Pastikan `handleCardClick` hanya dieksekusi jika pengguna benar-benar melakukan tap murni (tidak ada pergerakan drag).
- Mencegah *event bubbling* yang tidak diinginkan dari tautan "LIHAT DETAIL EVENT".

### Task 3: Optimasi CSS Touch-Action & Scroll-Snap
- **File:** `src/styles/responsive.css` & `src/styles/lineup.css`
- Ubah `scroll-snap-stop: always !important;` menjadi `scroll-snap-stop: normal !important;` pada mobile view.
- Tambahkan `touch-action: pan-y !important;` pada `.guests-editorial-grid` dan `.guest-card-container` untuk fluiditas gestur swipe horizontal tanpa mengorbankan scroll vertikal.
- Berikan gaya visual `user-select: none; -webkit-user-select: none;` pada kartu agar teks tidak terblok secara tidak sengaja saat jari menyeret kartu.
- Tambahkan transisi halus dan kelas `.is-dragging` untuk menonaktifkan transisi CSS saat jari bergerak agar tidak terjadi lag/stutter.

### Task 4: Pengujian & Validasi
- Uji simulasi sentuhan (*Touch simulation*) pada Chrome DevTools Mobile View.
- Uji interaksi geser cepat (*fast flick*), geser lambat (*slow drag*), dan tap murni.
- Pastikan audio hanya berganti saat kartu baru telah berpindah ke tengah.
- Jalankan verifikasi build: `npm run build` (`tsc -b && vite build`) untuk memastikan 0 error kompilasi.

---

## ❓ Konfirmasi Pengguna

Apakah rencana implementasi gestur sentuh langsung (*direct touch swipe*) ini sudah sesuai dengan yang Anda harapkan sebelum kita mulai mengeksekusi kodenya?
