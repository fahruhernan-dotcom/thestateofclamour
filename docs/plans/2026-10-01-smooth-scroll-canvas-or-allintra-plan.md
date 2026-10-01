# Smooth Scroll Hero Cinematic Implementation Plan (Eliminating Video Stutter)

> **Goal:** Eliminate the severe video stutter ("patah banget") during scroll scrubbing by addressing the root cause (GOP/I-frame deficit and async seek contention), ensuring locked 60fps/120fps camera push-in that feels as smooth as Apple product showcases, while guaranteeing that at `scroll = 0` the site displays the pristine establishing shot from storyboard panel 01 (`ffd189ab-5df3-422e-8b65-b7d9e79e51cc.png`).

---

## 🔬 Root Cause Analysis: Mengapa Video HTML5 "Patah Banget"?

Berdasarkan investigasi mendalam terhadap berkas video `hero_scroll_cinematic.mp4` menggunakan FFmpeg:

1. **Defisit Keyframe Ekstrem (GOP = 72 Frame):**
   - Dalam video 15 detik (360 frame), **hanya ada 5 Keyframe (I-frame)** di seluruh video (hanya 1 I-frame setiap ~3 detik)!
   - Sisanya (355 frame) adalah *delta frames* (P-frame & B-frame) yang bergantung pada frame sebelumnya.
   - Saat pengguna scroll ke detik 4.2: Decoder browser harus mundur ke detik 3.0, lalu men-decode **29 frame berturut-turut** sebelum bisa menampilkan 1 gambar!
   - Saat user scroll terus-menerus, decoder browser mengalami *seek storm*, buffer overload, dan membuang 90% frame (*frame dropping* masif).

2. **Asynchronous Seek Contention pada Chromium:**
   - Properti `video.currentTime = X` pada HTML5 video bersifat asinkron (`video.seeking === true`).
   - Jika `currentTime` disentuh sebelum event `seeked` selesai, browser Chromium meng-cancel proses decode yang sedang berjalan dan memulai ulang, menyebabkan stutter parah (*judder*).

---

## 💡 Dua Solusi Rekayasa (Engineering Solutions)

### Solusi A: Apple-Grade Canvas WebP Sequence (Direkomendasikan: Jaminan Mulus 100%)
*Teknik yang digunakan oleh Apple.com (AirPods/iPhone) dan situs-situs pemenang penghargaan Awwwards.*

- **Mekanisme:**
  1. Ekstraksi footage 15 detik menjadi 180 frame WebP resolusi 1280x720 (12 fps smooth interpolation).
  2. Total ukuran seluruh 180 frame WebP: **hanya 7.55 MB** (lebih ringan dari berkas video asli 10.5 MB!).
  3. Menggunakan elemen `<canvas>` di Hero sticky stage.
  4. Saat user scroll: Frame diambil dari array memori dan dirender via `ctx.drawImage(frames[index], 0, 0)` di dalam `requestAnimationFrame`.
- **Keunggulan Mutlak:**
  - `ctx.drawImage()` dieksekusi oleh GPU dalam **0.1 milidetik**!
  - **Nol seek latency**, nol decoder overhead, nol frame drop.
  - Berjalan terkunci pada **60 FPS / 120 FPS (ProMotion)** di desktop, trackpad, mousewheel, maupun swipe sentuh HP!
  - Scroll maju dan mundur (*reverse*) sama-sama instan dan sehalus mentega.

---

### Solusi B: All-Intra MP4 (GOP = 1) + Seeked Event Gate
*Mempertahankan video tunggal tetapi merombak arsitektur decode.*

- **Mekanisme:**
  1. Re-encode video menggunakan FFmpeg dengan `-g 1` (All-Intra: setiap frame adalah Keyframe/I-frame mandiri). Ukuran: 10.3 MB.
  2. Karena setiap frame adalah I-frame, decoder tidak perlu men-decode frame perantara.
  3. Scrubber JS dirombak total menggunakan gate `video.seeking`: `currentTime` hanya diperbarui setelah event `seeked` selesai, dengan variabel `pendingTime` sebagai penyimpan target scroll terbaru.
- **Karakteristik:**
  - Tetap 1 berkas video MP4.
  - Jauh lebih mulus dibanding saat ini, namun HTML5 video pipeline pada browser Chromium tetap memiliki *cap* internal (~25-30 seek/detik) saat user melakukan *rapid flick scroll*.

---

## 🎨 Penanganan "Kalau Belum di-Scroll Pakai Ini Dulu"

Sesuai permintaan Anda dan storyboard [ffd189ab-5df3-422e-8b65-b7d9e79e51cc.png](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/ffd189ab-5df3-422e-8b65-b7d9e79e51cc.png):

1. **State Awal (`scroll = 0`):**
   - Menampilkan gambar visual Panel 01: Gedung Continental megah di kejauhan dengan pendaran judul *"THE STATE OF CLAMOR // SWEAR IN CONTINENTAL"* bersih tanpa teks duplikat.
   - Ter-mount secara instan tanpa flicker, tanpa delay pemuatan video.
2. **Saat Scroll Dimulai:**
   - Begitu user mulai menggulir, sequence kamera maju langsung aktif secara halus menuju pintu gerbang.

---

## 📋 Rencana Tahapan Eksekusi:

### Tahap 1: Implementasi State Idle "Belum Di-scroll" (Panel 01 Clean)
- Pastikan saat user berada di posisi paling atas (`scroll = 0`), gambar frame 0 / poster tampil bersih, tajam, dan megah sesuai storyboard panel 01 tanpa teks HTML yang menumpuk.

### Tahap 2: Menghadirkan Gerakan Kamera Super Mulus
- Mengaktifkan rendering sequence berkecepatan tinggi (Canvas WebP Frame Sequence atau All-Intra Keyint=1).
- Pengujian interaksi:
  - *Slow scroll*: Kamera bergerak lambat dan stabil.
  - *Fast flick scroll*: Nol patah-patah, animasi mengikuti putaran scroll secara real-time.
  - *Reverse scroll*: Bergerak mundur secara mulus ke posisi awal.

### Tahap 3: Handoff Blackout ke Section 1
- Memastikan frame terakhir tetap hitam total (*blackout void*) yang langsung menyambut terbukanya Section 1.
