# Venue, Timing (20:00 WIB), and Section 1 Audio Mute Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 
1. Menghapus kata "SURAKARTA" secara menyeluruh sehingga label venue hanya menampilkan **"MIZU COMMONROOM"**.
2. Menonaktifkan (mute/hide) audio latar belakang di Section "THE GUESTS" (Hero Section 1 video recap) serta audio flyer selama teaser berlangsung, dengan struktur kode yang siap diaktifkan kembali saat guest diumumkan.
3. Menyeragamkan jadwal waktu kedua acara (30 Oktober & 31 Oktober) menjadi tepat pukul **20:00 WIB (jam 8 malam)** di seluruh section mobile dan desktop.

**Architecture:**
- **Single Source of Truth (`src/data/eventData.ts`):** 
  - Mengosongkan `venueCity: ''` sehingga hanya `venueName: 'MIZU COMMONROOM'` yang dievaluasi.
  - Memperbarui waktu `startDate` dan `performanceTime` menjadi `20:00 WIB`.
  - Mengatur `audioPreviewUrl: null` pada flyer teaser untuk memastikan tidak ada suara tak terduga.
- **Hero & Storytelling Components (`HeroSection.tsx`, `HeroSectionMobile.tsx`, `GuestStorytellingTransition.tsx`):**
  - Mengubah fallback `venueLabel` dari `'SURAKARTA · MIZU COMMONROOM'` menjadi `'MIZU COMMONROOM'`.
  - Mengganti teks jam `22:00 WIB` dan `23:30 WIB` menjadi `20:00 WIB`.
  - Mengunci audio video Section 1 agar tetap `muted = true` selama `IS_LINEUP_TEASER_MODE` aktif, sehingga transisi visual tetap estetik tanpa suara bising yang mengganggu teaser.
- **Lineup Section Components (`LineupSection.tsx`, `LineupSectionMobile.tsx`):**
  - Memastikan kartu flyer tidak memicu event audio jika `mediaSrc` bernilai null.

**Tech Stack:** React 18, TypeScript, Vite, CSS.

---

### Task 1: Update Data Model di `src/data/eventData.ts`
**Files:**
- Modify: `src/data/eventData.ts`

**Detail Perubahan:**
1. Hapus `'SURAKARTA'` dari `venueCity`:
   ```ts
   venueName: 'MIZU COMMONROOM',
   venueCity: '',
   ```
2. Ubah `startDate` menjadi pukul 20:00:
   ```ts
   startDate: '2026-10-30T20:00:00+07:00',
   ```
3. Perbarui `teaserFlyerArtist`:
   ```ts
   performanceTime: '20:00 WIB',
   audioPreviewUrl: null, // Musik di-mute sementara
   ```
4. Perbarui `archivedIndividualArtists`:
   - Malvin: `performanceTime: '20:00 WIB'`
   - Far: `performanceTime: '20:00 WIB'`

---

### Task 2: Hapus "SURAKARTA", Update Jam ke 20:00 WIB, dan Mute Audio di Mobile Hero (`HeroSectionMobile.tsx`)
**Files:**
- Modify: `src/components/mobile/HeroSectionMobile.tsx`

**Detail Perubahan:**
1. **Hapus SURAKARTA pada fallback `venueLabel`:**
   ```tsx
   const venueLabel = event.venueCity
     ? `${event.venueCity} · ${event.venueName}`
     : (event.venueName || 'MIZU COMMONROOM');
   ```
2. **Mute Audio Section 1 saat Teaser Mode:**
   Di dalam fungsi update audio `recapVideo`:
   ```tsx
   // Selama teaser mode berlangsung, audio video Section 1 dimatikan (muted)
   if (IS_LINEUP_TEASER_MODE) {
     if (!recapVideo.muted) recapVideo.muted = true;
     isAudioActiveRef.current = false;
     return;
   }
   ```
3. **Ubah Jam Kedua Malam ke 20:00 WIB:**
   ```tsx
   {/* Schedule Dock */}
   <div className="hero-mobile-schedule-item">
     <span className="hero-mobile-sched-date">30 OKTOBER</span>
     <span className="hero-mobile-sched-artist">{IS_LINEUP_TEASER_MODE ? '?' : 'MALVIN'}</span>
     <span className="hero-mobile-sched-meta">20:00 WIB</span>
     <span className="hero-mobile-sched-venue">MIZU COMMONROOM</span>
   </div>

   <div className="hero-mobile-schedule-item align-right">
     <span className="hero-mobile-sched-date">31 OKTOBER</span>
     <span className="hero-mobile-sched-artist">{IS_LINEUP_TEASER_MODE ? '?' : 'FAR'}</span>
     <span className="hero-mobile-sched-meta">20:00 WIB</span>
     <span className="hero-mobile-sched-venue">MIZU COMMONROOM</span>
   </div>
   ```

---

### Task 3: Hapus "SURAKARTA", Update Jam ke 20:00 WIB, dan Mute Audio di Desktop Hero (`HeroSection.tsx`)
**Files:**
- Modify: `src/components/HeroSection.tsx`

**Detail Perubahan:**
1. **Hapus SURAKARTA pada fallback `venueLabel`:**
   ```tsx
   const venueLabel = event.venueCity
     ? `${event.venueCity} · ${event.venueName}`
     : (event.venueName || 'MIZU COMMONROOM');
   ```
2. **Mute Audio Section 1 saat Teaser Mode:**
   Di dalam fungsi update audio desktop video:
   ```tsx
   if (IS_LINEUP_TEASER_MODE) {
     if (!video.muted) video.muted = true;
     isPlayingAudioRef.current = false;
     return;
   }
   ```
3. **Ubah Jam Kedua Cluster ke 20:00 WIB:**
   - Cluster Top-Right (Day 1): ubah `22:00 WIB` -> `20:00 WIB`.
   - Cluster Bottom-Right (Day 2): ubah `23:30 WIB` -> `20:00 WIB`.

---

### Task 4: Sinkronisasi Jam di `GuestStorytellingTransition.tsx`
**Files:**
- Modify: `src/components/GuestStorytellingTransition.tsx`

**Detail Perubahan:**
1. Ubah teks jam Day 1 (`22:00 WIB`) -> `20:00 WIB`.
2. Ubah teks jam Day 2 (`23:30 WIB`) -> `20:00 WIB`.
3. Di layout mobile bottom schedule:
   - Day 1: `<span className="schedule-time-tag">20:00</span>`
   - Day 2: `<span className="schedule-time-tag">20:00</span>`
4. Pastikan video `photoImgRef` tetap `muted = true` jika `IS_LINEUP_TEASER_MODE` aktif.

---

### Task 5: Validasi, Build Check, & Pengujian
**Files:**
- Command: `npm run build`
- Git verification

**Step 1:** Verifikasi 0 kemunculan kata `SURAKARTA` di folder `src/`.
**Step 2:** Jalankan `npm run build` (tsc -b + vite build) untuk memastikan bebas error kompilasi.
**Step 3:** Verifikasi tampilan di dev server:
- Label venue pembuka: **`MIZU COMMONROOM`**.
- Section 1 "THE GUESTS": Tanpa suara/musik (hening), jam tampil **`20:00 WIB`**, nama guest berupa **`?`**.
- Kartu Flyer Guestlist: Tampil tenang dan monumental tanpa pemutaran musik/audio tak terduga.
