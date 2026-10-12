# HOW Parkun — Session Vault
## Date: 2026-10-12 | Branch: `main`

---

## 1. User Directives & Requests Completed
1. **Dual-Tier Lineup Section (Day 1 & Day 2):**
   - Menata ulang `#lineup` menjadi dua tingkat terpisah: **Day 1 · 30 Okt** (atas) dan **Day 2 · 31 Okt** (bawah).
   - Seluruh kartu menggunakan aset resmi Gothic Teaser Poster (`/assets/state_of_clamour_gothic_poster.jpg`) dengan nama seragam **`Swear In Continental · ?`**.
2. **Eliminasi Lag & Kelap-Kelip (Strobe Flash Removal):**
   - Menghapus efek camera flash strobe flare (`.guest-strobe-flash`, `@keyframes camera-flash-strobe`, dan handler `triggerFlash` / `activeFlashes`) yang sebelumnya memicu lonjakan re-render dan render blending overhead.
3. **Penyempurnaan Centering & Peripheral Depth-of-Field:**
   - Memperbaiki coordinate offside dengan `getBoundingClientRect()` dan `position: relative` pada `.guests-editorial-grid`.
   - Menjaga kartu tengah aktif 100% razor-sharp dalam deadzone 100px (`filter: none`), sementara kartu tepi mempertahankan depth-of-field blur yang halus.
4. **Pembedaan Arah Diagonal Ribbon (Day 1 vs Day 2):**
   - **Day 1**: Mempertahankan arah dari kanan bawah ke atas kiri (`slopeDirection = 1`, kartu kiri naik, kartu kanan turun).
   - **Day 2**: Diubah ke arah berlawanan dari kiri bawah ke kanan atas (`slopeDirection = -1`, kartu kiri turun, kartu kanan naik), menciptakan ritme chevron dinamis.
5. **Penonaktifan Musik Teaser (Audio Preview Off):**
   - Mengosongkan `audioPreviewUrl` pada teaser data sehingga tidak ada audio player tersembunyi, suara, atau badge LIVE equalizer saat di-tap/hover.
6. **Penyempurnaan Navbar:**
   - Memperpendek lebar sticky pill melayang sedikit ke `1040px` (desktop) dan `1120px` (layar lebar).
   - Menghapus tulisan "LINEUP".
   - Mengubah tautan menjadi **`NIGHT 1`** dan **`NIGHT 2`**.
   - Memindahkan posisi link ke sebelah kanan persis di samping tombol `TICKETS →` secara horizontal sebaris (`.nav-right-cluster` dengan `display: flex; white-space: nowrap;`).

---

## 2. File Diubah
- `src/components/FloatingNavbar.tsx`
- `src/styles/navbar.css`
- `src/data/eventData.ts`
- `src/components/LineupSection.tsx`
- `src/components/mobile/LineupSectionMobile.tsx`
- `src/hooks/useCarouselOffset.ts`
- `src/styles/lineup.css`
- `src/styles/mobile/lineup.mobile.css`

---

## 3. Status Verifikasi
- TypeScript compiler (`npx tsc --noEmit`): **Exit Code 0 (No Errors)**.
