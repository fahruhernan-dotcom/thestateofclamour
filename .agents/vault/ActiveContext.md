---
tags:
  - type/active-context
  - type/working-memory
  - workspace/HOW Parkun
workspace: "HOW Parkun"
last_updated: "2026-10-11 19:00"
status: active
up: "[[Index - HOW Parkun]]"
---

# 🧠 Active Context: HOW Parkun

> [!tip] 💡 Living Working Memory
> Berkas ini menyimpan state aktif, keputusan kunci, dan audit kesiapan rilis tiket untuk workspace **HOW Parkun**.
> Dibaca langsung oleh pengembang atau AI Agent menggunakan `/gro resume`.

## 🎯 Milestone Terkini & Status Rilis 19:00 WIB
- **Target Event:** THE STATE OF CLAMOUR // SWEAR IN CONTINENTAL (30–31 Oktober 2026).
- **Rilis Tiket Early Bird:** Minggu, 11 Oktober 2026 pukul 19:00:00 WIB.
- **Status Artatix API:** 🟢 Online (Event ID 2894, `swear_in_continental`).
- **Status Kuota Awal Artatix:**
  - Day 1: ID 22389 (Stok: 25 | Rp 100.000)
  - Day 2: ID 22390 (Stok: 25 | Rp 100.000)
  - 2 Day Pass: ID 22391 (Stok: 20 | Rp 180.000 net)
  - Blind Tickets: ID 22394 & 22395 (Stok: 0 | Sold Out)

## 📌 Checklist Kesiapan & Perbaikan Logika (11 Okt 19:00)
- [x] **Auto-Scheduler 19:00 WIB:** `setTimeout` transisi otomatis dari Blind Ticket ke Early Bird pada 19:00 WIB tanpa perlu hard refresh.
- [x] **Laptop Wake / Sleep Guard:** Event listener `visibilitychange` mengeksekusi sinkronisasi instan saat tab dibuka dari sleep.
- [x] **Non-Blocking Sold Out CTA:** Tombol tiket dengan status habis (`isSoldOut`) tetap menampilkan label `CAPACITY REACHED →`, tetapi **TIDAK DI-DISABLE** (`disabled` dilepas) dan tetap dapat diklik untuk forwarding langsung ke loket resmi Artatix.
- [x] **Matcher Disambiguation:** Memperbaiki bug matching `matchArtatixItemToTier` dengan menambahkan `ARTATIX_ID_MAP` sehingga tiket 2 Day Pass tidak tertukar dengan Day 1 saat stok habis.
- [x] **Deploy Package:** `dist-deploy-ready.zip` dan `dist/` berhasil di-build tanpa error TypeScript.

## ⚙️ Keputusan Arsitektur Kunci
- 💡 **Direct Artatix ID Mapping:** Menggunakan ID resmi Artatix (22389, 22390, 22391, 22394, 22395) untuk eliminasi total false-positive match.
- 💡 **Graceful Forwarding over Hard Block:** Pengunjung web selalu memiliki jalur checkout resmi ke Artatix meski kuota di web berstatus habis (mengantisipasi pembatalan bayar / pelepasan slot di gateway).
- 💡 **Dual cPanel & Vercel Proxy:** Routing proxy internal `/api-artatix` via `api-artatix.php` (cPanel) & `vercel.json` (Vercel) untuk memintas CORS.

## 📁 File Terakhir Diubah
- `src/components/TicketSection.tsx` (Desktop non-blocking button)
- `src/components/mobile/TicketSectionMobile.tsx` (Mobile non-blocking button)
- `src/services/artatixService.ts` (Exact ID map & matcher)
- `src/styles/tickets.css` (Styling `.is-sold-out-cta`)
- `src/styles/mobile/tickets.mobile.css` (Mobile styling `.is-sold-out-cta`)
- `scripts/zip-dist.mjs` (Resilient deployment archiver)
