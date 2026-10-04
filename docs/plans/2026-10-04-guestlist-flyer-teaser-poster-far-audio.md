# Guestlist Flyer Teaser (Gothic Poster & Far Audio) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Menggantikan tampilan guestlist (Lineup Section) saat ini dengan 1 kartu flyer visual "State of Clamour Gothic Poster" yang memainkan musik Far, menyembunyikan sementara 2 guest (Malvin & Far), namun tetap mempertahankan seluruh arsitektur dan logic multi-guest agar mudah digantikan saat flyer resmi masing-masing guest sudah siap.

**Architecture:** 
1. Mengintegrasikan aset `State of Clamour Gothic Poster.png` ke dalam `public/assets/` dengan optimasi web.
2. Memperbarui kontrak data `Artist` di `src/data/eventData.ts` dengan mode teaser: menampilkan item poster Gothic dengan audio backing Far (`/assets/guest_far.mp4`), sembari mengarsipkan data `Malvin` dan `Far` dalam struktur data cadangan (`standbyArtists` atau toggle flag `IS_TEASER_MODE`).
3. Menyesuaikan komponen kartu guest (`GuestCard` di Desktop dan `LineupSectionMobile` di Mobile) agar mendukung mode visual poster gambar (`<img>`) yang dipadukan dengan pemutar audio Far (menggunakan audio tag / coordinator), sehingga visual poster Gothic tetap tampak utuh (tidak tertutup video performance) sementara audio preview tetap berbunyi saat disentuh/di-hover.
4. Menyesuaikan tata letak grid Desktop & Mobile saat menampilkan 1 kartu tunggal agar terpusat secara monumental dan seimbang.

**Tech Stack:** React 18, TypeScript, Vite, CSS Grid/Flexbox, HTML5 Audio / Video Coordinator API.

---

### Task 1: Salin & Optimasi Poster Aset ke Direktori Publik
**Files:**
- Copy: `State of Clamour Gothic Poster.png` -> `public/assets/state_of_clamour_gothic_poster.png`

**Step 1: Salin file aset ke `public/assets/`**
Jalankan perintah copy file di shell PowerShell:
```powershell
Copy-Item "State of Clamour Gothic Poster.png" "public/assets/state_of_clamour_gothic_poster.png"
```

**Step 2: Verifikasi file di `public/assets/`**
Pastikan file dapat diakses oleh browser melalui static assets Vite.

---

### Task 2: Perbarui Data Model Lineup di `eventData.ts` (Mode Teaser dengan Retensi Logic)
**Files:**
- Modify: `src/types/index.ts:34-47` (opsional: tambahkan `isTeaserFlyer?: boolean`)
- Modify: `src/data/eventData.ts:56-84`

**Step 1: Siapkan data teaser poster dan data cadangan**
Di `src/data/eventData.ts`:
```ts
// Mode flag untuk mempermudah pergantian flyer di masa depan
export const IS_LINEUP_TEASER_MODE = true;

// Data guest individual (Malvin & Far) tetap disimpan utuh agar logic tidak hilang
export const archivedIndividualArtists: Artist[] = [
  {
    id: 'art-malvin',
    eventId: 'evt-clamour-2026',
    name: 'Malvin',
    dayLabel: 'Day 1',
    stageName: 'Mizu Commonroom',
    performanceTime: '22:00 WIB',
    imageUrl: '/assets/guest_malvin_poster.png',
    videoUrl: '/assets/guest_malvin.mp4',
    posterUrl: '/assets/guest_malvin_poster.png',
    audioPreviewUrl: null,
    sortOrder: 1
  },
  {
    id: 'art-far',
    eventId: 'evt-clamour-2026',
    name: 'Far',
    dayLabel: 'Day 2',
    stageName: 'Mizu Commonroom',
    performanceTime: '23:30 WIB',
    imageUrl: '/assets/guest_far_poster.png',
    videoUrl: '/assets/guest_far.mp4',
    posterUrl: '/assets/guest_far_poster.png',
    audioPreviewUrl: null,
    sortOrder: 2
  }
];

// Poster Teaser Gothic dengan Audio Far
export const teaserFlyerArtist: Artist = {
  id: 'art-teaser-flyer',
  eventId: 'evt-clamour-2026',
  name: 'SWEAR IN CONTINENTAL',
  dayLabel: '30 — 31 OKTOBER',
  stageName: 'Mizu Commonroom',
  performanceTime: 'GATES UNSEALED 21:00 WIB',
  imageUrl: '/assets/state_of_clamour_gothic_poster.png',
  posterUrl: '/assets/state_of_clamour_gothic_poster.png',
  videoUrl: null, // Jangan render video player visual agar poster gothic tidak tertutup
  audioPreviewUrl: '/assets/guest_far.mp4', // Menggunakan trek audio Far
  sortOrder: 1
};

export const initialArtists: Artist[] = IS_LINEUP_TEASER_MODE
  ? [teaserFlyerArtist]
  : archivedIndividualArtists;
```

---

### Task 3: Dukungan Audio Preview untuk Flyer Poster di Desktop (`LineupSection.tsx`)
**Files:**
- Modify: `src/components/LineupSection.tsx`

**Step 1: Dukung pemutaran audio ketika `videoUrl` bernilai null tetapi `audioPreviewUrl` tersedia**
Di komponen `GuestCard`:
- Jika `artist.videoUrl` tidak ada (karena berupa flyer poster gambar), gunakan elemen `<audio>` internal atau video tanpa visual (`style={{ display: 'none' }}`) yang terhubung ke `audioPreviewUrl` (Far).
- Saat di-hover atau di-tap, audio Far berputar secara mulus melalui `audioCoordinator`.
- Indikator equalizer animasi `"LIVE"` tetap menyala saat suara aktif.
- Strobe flash tetap menyala saat kartu di-trigger.

**Step 2: Format layout saat menampilkan 1 kartu tunggal (Teaser Mode)**
- Tambahkan styling agar bila `artists.length === 1`, kartu berada tepat di tengah (`max-width: 440px; margin: 0 auto;`).
- Sembunyikan kontrol swipe/arrow mobile yang tidak diperlukan bila item hanya 1.

---

### Task 4: Dukungan Audio Preview & Layout di Mobile (`LineupSectionMobile.tsx`)
**Files:**
- Modify: `src/components/mobile/LineupSectionMobile.tsx`
- Modify: `src/styles/mobile/lineup.mobile.css`

**Step 1: Audio playback untuk flyer poster di mobile**
- Tangani `audioRefs` atau hidden media element untuk `audioPreviewUrl` (Far) pada kartu mobile.
- Tap sekali akan memutar/menjeda musik Far dengan fade volume halus.
- Flash flare dan border glow emas aktif selaras dengan ritme interaksi.

**Step 2: Center alignment untuk 1 kartu di mobile**
- Bila `artists.length === 1`, carousel container menempatkan kartu di tengah layar tanpa horizontal overflow yang janggal.
- Titik indikator (`dots`) otomatis di-hide jika hanya ada 1 kartu.

---

### Task 5: Validasi Integrasi & Pengujian
**Files:**
- Review: `LineupSection.tsx` & `LineupSectionMobile.tsx`
- Command: `npm run build`

**Step 1: Test typecheck & build**
Jalankan:
```powershell
npm run build
```
Pastikan exit code 0 tanpa error TypeScript atau Vite.

**Step 2: Uji Interaksi Desktop & Mobile**
- Desktop: Hover kartu menampilkan flash, equalizer bergerak, dan musik Far terdengar.
- Mobile: Tap kartu memicu flash, border emas, dan musik Far berputar. Tap kedua menjeda musik.
- Gambar yang tampil adalah **State of Clamour Gothic Poster** yang utuh, tajam, dan tidak tertutup feed video.
- Tombol `"LIHAT DETAIL EVENT"` tetap dapat diklik untuk membuka modal panduan acara.
