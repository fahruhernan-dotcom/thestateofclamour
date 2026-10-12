---
tags:
  - type/active-context
  - type/working-memory
  - workspace/HOW Parkun
workspace: "HOW Parkun"
last_updated: "2026-10-12 11:25"
status: active
up: "[[Index - HOW Parkun]]"
---

# 🧠 Active Context: HOW Parkun

> [!tip] 💡 Living Working Memory
> Berkas ini menyimpan state aktif, keputusan kunci, dan tugas tertunda untuk workspace **HOW Parkun**.
> Dibaca langsung oleh pengembang atau AI Agent menggunakan `/gro resume`.

## 🎯 Milestone Terkini & Status
- **Sesi Terakhir:** [[session-2026-10-12-lineup-navbar]] (`2026-10-12 11:25`)
- **Ringkasan:** 
  1. **Dual-Tier Lineup Section (Day 1 & Day 2):** Menata ulang `#lineup` menjadi dua tingkat terpisah: Day 1 · 30 Okt (atas) dan Day 2 · 31 Okt (bawah), dengan seluruh kartu menggunakan Gothic Teaser Poster dan nama `Swear In Continental · ?`.
  2. **Eliminasi Lag & Kelap-Kelip (Strobe Flash Removal):** Menghapus efek strobe flash flare dan animasi berat yang menyebabkan lag saat interaksi/hover.
  3. **Penyempurnaan Centering & Peripheral Blur:** Memperbaiki coordinate offside dengan `getBoundingClientRect()` dan `position: relative`, menjaga kartu aktif di tengah 100% razor-sharp dalam deadzone 100px.
  4. **Pembedaan Arah Diagonal Ribbon:** Day 1 dari kanan bawah ke atas kiri (`slopeDirection = 1`) vs Day 2 dari kiri bawah ke kanan atas (`slopeDirection = -1`), menciptakan ritme chevron dinamis.
  5. **Penonaktifan Audio Teaser:** Mematikan pemutaran audio, streaming video tersembunyi, dan badge LIVE equalizer saat fase teaser.
  6. **Penyempurnaan & Reposisi Navbar:** Memperpendek max-width sticky pill (1040px/1120px), menghapus label "LINEUP", menyederhanakan menjadi "NIGHT 1" & "NIGHT 2", dan memindahkannya ke sisi kanan berdampingan horizontal (`.nav-right-cluster`) dengan tombol "TICKETS →".
- **Status Proyek:** 🟢 **PRODUCTION-READY**.

## 📌 Checklist & Next Actions
- [x] Dual-tier stacked lineup (Day 1 & Day 2)
- [x] Gothic teaser poster untuk seluruh 6 card dengan nama `Swear In Continental · ?`
- [x] Eliminasi efek kelap-kelip / camera flash strobe untuk menghapus lag
- [x] Dead-center alignment presisi & peripheral depth-of-field blur
- [x] Pembedaan arah diagonal ribbon (Day 1 slope +1 vs Day 2 slope -1)
- [x] Penonaktifan preview musik teaser
- [x] Perpendek lebar sticky pill navbar (1040px / 1120px)
- [x] Hapus "LINEUP" dari navbar, ganti "NIGHT 1" & "NIGHT 2"
- [x] Reposisi menu ke sisi kanan berdampingan horizontal dengan tombol tiket
- [x] Update Obsidian/Agent Vault documentation

## ⚙️ Keputusan Arsitektur Kunci
- 💡 **Opposing Diagonal Chevron Trajectory:** Memanfaatkan parameter `slopeDirection` pada hook GPU `useCarouselOffset` untuk membalikkan kalkulasi `translateY` dan `rotateZ` pada Day 2 tanpa merusak deadzone spotlight di tengah.
- 💡 **Zero-Audio Teaser Mode:** Mengosongkan `audioPreviewUrl` pada dataset teaser untuk menghindari inisialisasi media player tersembunyi dan overhead network/GPU.
- 💡 **Explicit Horizontal Nav Right Cluster:** Menggunakan `.nav-right-cluster` dengan `display: flex; white-space: nowrap; align-items: center;` untuk menjamin tautan `NIGHT 1 · NIGHT 2` dan tombol `TICKETS →` selalu berada dalam satu baris horizontal tanpa risiko wrapping vertikal.

## 📁 File Terakhir Diubah
- `src/components/FloatingNavbar.tsx`
- `src/styles/navbar.css`
- `src/data/eventData.ts`
- `src/components/LineupSection.tsx`
- `src/components/mobile/LineupSectionMobile.tsx`
- `src/hooks/useCarouselOffset.ts`
- `src/styles/lineup.css`
- `src/styles/mobile/lineup.mobile.css`
- `.agents/vault/session-2026-10-12-lineup-navbar.md`
- `.agents/vault/ActiveContext.md`

## 📜 Riwayat Sesi Terbaru
| Tanggal | Sesi | Ringkasan |
|---|---|---|
| `2026-10-12 11:25` | [[session-2026-10-12-lineup-navbar]] | Dual-tier lineup teaser, eliminasi lag kelap-kelip, pembedaan arah diagonal Day 1 vs Day 2, penonaktifan audio teaser, dan reposisi link navbar berdampingan horizontal dengan tiket |
| `2026-10-12 05:28` | [[2026-10-12 - 05.28 - Penyempurnaan Arsitektur Smooth Morphing Navbar IDLIX & Pelebaran Sticky Pill Desktop]] | Arsitektur smooth morphing navbar IDLIX, pelebaran sticky pill desktop ke 1140px/1240px, height 50px locked, git commit & push main |
| `2026-10-11 23:25` | [[2026-10-11 - 23.25 - Implementasi Smooth Navbar, Halaman Denah, Reservasi & Dual-Admin WA]] | Restorasi CSS navbar, integrasi smooth FloatingNavbar, halaman Denah & Reservasi, dual-admin WA, link IG & TikTok |
| `2026-10-11 19:20` | [[2026-10-11 - 19.20 - Eliminasi Countdown Timer & Penetapan Statis Early Bird]] | Penghapusan timer rilis, penetapan statis tier Early Bird di eventData.ts, build dist-deploy.zip, push commit 5833f4f |
