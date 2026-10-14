# Direct Reservation Navigation & Day Context Synchronization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure that clicking "RESERVASI SEKARANG" (and related reservation CTAs) from the Day 1 or Day 2 pages directly navigates the visitor to the dedicated `ReservasiPage`, automatically preselecting the correct event date (Day 1: 30 Okt / Admin Ferdi vs Day 2: 31 Okt / Admin Day 2), while preserving smooth back-navigation to the originating event page.

**Architecture:**
1. **Hash Routing & State Layer (`App.tsx`):** Enhance `parseViewFromHash` to parse query parameters (`#/reservasi?day=day-1` and `#/reservasi?day=day-2`). Add `selectedReservationDay` and `previousView` state tracking to ensure clicking "Kembali" on `ReservasiPage` restores the visitor back to their previous page (`NightOneEventPage` or `NightTwoEventPage`) instead of abruptly falling back to `HomePage`.
2. **Page Layer (`NightOneEventPage.tsx` & `NightTwoEventPage.tsx`):** Introduce `onOpenReservasi: (day: 'day-1' | 'day-2') => void` prop. Wire the primary Hero CTA `"RESERVASI SEKARANG"` to call `onOpenReservasi` directly. Keep the secondary Hero button `"JELAJAHI VENUE"` as the smooth in-page scroll to the visual floorplan.
3. **Reservation View Layer (`ReservasiPage.tsx`):** Accept `initialDay?: 'day-1' | 'day-2'` prop and sync internal `selectedDay` state with smooth auto-scroll to the corresponding Concierge Admin card.
4. **Navigation Layer (`FloatingNavbar.tsx`):** Clarify behavior when clicking "RESERVASI" from the menu so it routes directly to `#/reservasi?day=...` when intended.

**Tech Stack:** React 18, TypeScript, Hash-based client-side router, CSS transitions.

---

### Task 1: Update `App.tsx` State & Router
**Files:**
- Modify: `src/App.tsx`

**Steps:**
1. Add state: `const [selectedReservationDay, setSelectedReservationDay] = useState<'day-1' | 'day-2'>('day-1');`
2. Add state: `const [previousView, setPreviousView] = useState<ViewMode>('home');`
3. Update `parseViewFromHash` to detect `day=day-2` or `day=day-1` from hash.
4. Enhance `handleOpenReservasi` to accept `(packageId?: string, targetDay: 'day-1' | 'day-2' = 'day-1')`.
5. Create `handleBackFromReservasi` to return to `previousView` (`event-night-1`, `event-night-2`, or `home`).
6. Pass `initialDay={selectedReservationDay}` and `onBack={handleBackFromReservasi}` to `<ReservasiPage />`.
7. Pass `onOpenReservasi={(day) => handleOpenReservasi(undefined, day)}` to `<NightOneEventPage />` and `<NightTwoEventPage />`.

---

### Task 2: Wire Day 1 & Day 2 Hero CTA Buttons
**Files:**
- Modify: `src/pages/NightOneEventPage.tsx`
- Modify: `src/pages/NightTwoEventPage.tsx`

**Steps:**
1. In `NightOneEventPage.tsx`: Add `onOpenReservasi?: (day: 'day-1' | 'day-2') => void` to `Props`.
2. Connect primary button `"RESERVASI SEKARANG"` to `onOpenReservasi ? onOpenReservasi('day-1') : scrollToSection('reservasi')`.
3. In `NightTwoEventPage.tsx`: Add `onOpenReservasi?: (day: 'day-1' | 'day-2') => void` to `Props`.
4. Connect primary button `"RESERVASI SEKARANG"` to `onOpenReservasi ? onOpenReservasi('day-2') : scrollToSection('reservasi')`.
5. Ensure `"JELAJAHI VENUE"` remains as in-page scroll to `#reservasi`.

---

### Task 3: Sync `ReservasiPage.tsx` Initial Day Prop
**Files:**
- Modify: `src/pages/ReservasiPage.tsx`

**Steps:**
1. Add `initialDay?: 'day-1' | 'day-2'` to `Props`.
2. Initialize `selectedDay` state with `initialDay || 'day-1'`.
3. Add `useEffect` to update `selectedDay` if `initialDay` prop changes.

---

### Task 4: Align `FloatingNavbar.tsx` Reservation Navigation
**Files:**
- Modify: `src/components/FloatingNavbar.tsx`

**Steps:**
1. In `handleReservasiClick`: When user is on `event-night-1` or `event-night-2`, navigate to `#/reservasi?day=day-1` or `#/reservasi?day=day-2` directly.

---

### Task 5: Verification & Quality Assurance
**Steps:**
1. Run `npm run lint` (`tsc --noEmit`) to verify zero type errors.
2. Run `npm run build` to verify production bundling.
3. Test manual flows: Day 1 $\rightarrow$ Reservasi $\rightarrow$ Back $\rightarrow$ Day 1, and Day 2 $\rightarrow$ Reservasi $\rightarrow$ Back $\rightarrow$ Day 2.
