# Reorder Reservasi Page Layout: Map First, Consultation Below

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reorder the sections on the dedicated reservation page (`ReservasiPage.tsx`) so that the interactive venue floorplan (`reservasi-inventory-section`) appears directly above the VIP Consultation Hotline (`reservasi-concierge-section`), giving visitors immediate visual access to table positions and availability before offering direct WhatsApp concierge assistance.

**Architecture:**
1. **Component Hierarchy (`ReservasiPage.tsx`):**
   - **Header Cluster:** Title "RESERVASI MEJA & SOFA" & subtitle overview.
   - **Section 1 (Top Priority):** `reservasi-inventory-section` embedding `<FloorPlanViewer day={selectedDay} onDayChange={handleDaySelect} />`.
   - **Section 2 (Secondary / Consultation):** `reservasi-concierge-section` displaying the dual admin cards (Night 01: Admin Ferdi vs Night 02: Admin Day 2) with direct WhatsApp consultation buttons and mobile carousel indicator.
   - **Section 3:** `OfficialFAQSection`.
2. **Style & Rhythm Polish (`src/styles/reservasi.css`):**
   - Update `.reservasi-inventory-section` spacing so it flows naturally from the header cluster and provides clean separation (`margin-bottom: 4rem`) before the concierge cards.
   - Ensure `.reservasi-concierge-section` has appropriate upper and lower breathing room.

---

### Task 1: Reorder Sections in `ReservasiPage.tsx`
**Files:**
- Modify: `src/pages/ReservasiPage.tsx`

**Steps:**
1. Position `<section className="reservasi-inventory-section">` right below `<header className="reservasi-header-cluster">`.
2. Place `<section className="reservasi-concierge-section">` right below the floorplan section.
3. Keep back button text as `"Kembali"`.

---

### Task 2: Polish Section Spacing in `reservasi.css`
**Files:**
- Modify: `src/styles/reservasi.css`

**Steps:**
1. Update `.reservasi-inventory-section` margin to `margin-top: 0.5rem; margin-bottom: 4.5rem;`.
2. Update `.reservasi-concierge-section` margin to `margin: 0 auto 4.5rem;`.

---

### Task 3: Verification & Build
**Steps:**
1. Run `npm run lint` (`tsc --noEmit`).
2. Run `npm run build`.
3. Check browser flow at `http://localhost:5173/#/reservasi`.
