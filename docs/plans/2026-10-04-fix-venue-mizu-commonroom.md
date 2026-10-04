# Venue Correction (Mizu Commonroom) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Mengoreksi seluruh label lokasi dan venue acara dari "BANDUNG · SECRET MONUMENT" menjadi "SURAKARTA · MIZU COMMONROOM" (atau "SOLO · MIZU COMMONROOM") secara konsisten di tampilan Desktop, Mobile, serta data source event.

**Architecture:** Memperbarui data event terpusat di `eventData.ts` (`venueName` dan `venueCity`), memperbarui conditional fallback di `HeroSection.tsx` (Desktop) dan `HeroSectionMobile.tsx` (Mobile) agar tidak lagi memunculkan "BANDUNG", serta memverifikasi konsistensi antar section dan build TypeScript.

**Tech Stack:** React 18, TypeScript, Vite, CSS Modules / Global Tokens.

---

### Task 1: Update Central Event Data Model
**Files:**
- Modify: `src/data/eventData.ts:11-13`

**Step 1: Check existing initialEvent configuration**
Di `src/data/eventData.ts`, `initialEvent` saat ini berisi:
```ts
venueName: 'SECRET MONUMENT',
venueCity: 'CENTRAL MONUMENT',
```
Hal ini menyebabkan logika fallback di hero memicu string `'BANDUNG · SECRET MONUMENT'`.

**Step 2: Update venueName and venueCity**
Ganti dengan:
```ts
venueName: 'MIZU COMMONROOM',
venueCity: 'SURAKARTA',
```
*(Catatan: Ejaan resmi yang valid adalah **Mizu Commonroom**, berlokasi di Jl. Slamet Riyadi No.560, Purwosari, Surakarta).*

---

### Task 2: Fix Desktop Hero Section Venue Fallback & Label
**Files:**
- Modify: `src/components/HeroSection.tsx:770-774`

**Step 1: Identify the hardcoded fallback**
Di `src/components/HeroSection.tsx`:
```tsx
const venueLabel = event.venueCity && event.venueCity !== 'CENTRAL MONUMENT'
  ? `${event.venueCity} · ${event.venueName}`
  : 'BANDUNG · SECRET MONUMENT';
```

**Step 2: Update logic & fallback**
Ubah menjadi:
```tsx
const venueLabel = event.venueCity && event.venueName
  ? `${event.venueCity} · ${event.venueName}`
  : 'SURAKARTA · MIZU COMMONROOM';
```
Hasil pada desktop hero frame awal akan menampilkan:
`30 — 31 OCTOBER 2026`
`SURAKARTA · MIZU COMMONROOM`

---

### Task 3: Fix Mobile Hero Section Venue Fallback & Label
**Files:**
- Modify: `src/components/mobile/HeroSectionMobile.tsx:689-692`

**Step 1: Identify the mobile fallback**
Di `src/components/mobile/HeroSectionMobile.tsx`:
```tsx
const venueLabel = event.venueCity && event.venueCity !== 'CENTRAL MONUMENT'
  ? `${event.venueCity} · ${event.venueName}`
  : 'BANDUNG · SECRET MONUMENT';
```

**Step 2: Update logic & fallback**
Ubah menjadi:
```tsx
const venueLabel = event.venueCity && event.venueName
  ? `${event.venueCity} · ${event.venueName}`
  : 'SURAKARTA · MIZU COMMONROOM';
```
Memastikan frame awal pada mobile hero poster menampilkan `SURAKARTA · MIZU COMMONROOM` secara serasi dan konsisten dengan cluster editorial berikutnya (`SWEAR IN CONTINENTAL · MIZU COMMONROOM`).

---

### Task 4: Verify Consistency Across All Components & Run Validation
**Files:**
- Review: `src/components/GuestStorytellingTransition.tsx`
- Review: `src/pages/EventDetailsPage.tsx`
- Build check: `npm run build`

**Step 1: Verify all venue and location mentions**
Pastikan tidak ada sisa kata `BANDUNG` di seluruh codebase:
Jalankan search regex / case-insensitive untuk memastikan 0 match kata `Bandung`.

**Step 2: Run TypeScript check & Vite build**
Jalankan `npm run build` untuk memvalidasi tidak ada syntax error, type error, ataupun layout breakdown.
