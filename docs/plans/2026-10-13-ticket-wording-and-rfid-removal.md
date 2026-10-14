# Update Ticket Section Headline to "TIKET" & Remove RFID References Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:**
1. Update the section headline from **"THE PASSAGE"** to **"TIKET"** on both Desktop and Mobile views.
2. Remove and replace all references to **"RFID"** (such as *"verified RFID access"*, *"OFFICIAL VERIFIED RFID PASS"*, *"gelang RFID"*) across the entire application, replacing them with **gelang kertas resmi / official wristband pass**, accurately reflecting the client's actual event ticketing system.

---

### Task 1: Update Desktop Ticket Section (`TicketSection.tsx`)
**Files:**
- Modify: `src/components/TicketSection.tsx`

**Steps:**
1. Change `<h2 className="section-headline">THE PASSAGE</h2>` to `<h2 className="section-headline">TIKET</h2>`.
2. Update eyebrow to `TIKET MASUK RESMI` and subtext to remove RFID reference.
3. Update guarantee badge from `OFFICIAL VERIFIED RFID PASS` to `OFFICIAL WRISTBAND PASS`.

---

### Task 2: Update Mobile Ticket Section (`TicketSectionMobile.tsx`)
**Files:**
- Modify: `src/components/mobile/TicketSectionMobile.tsx`

**Steps:**
1. Change `<h2 className="tickets-mobile-headline">THE PASSAGE</h2>` to `<h2 className="tickets-mobile-headline">TIKET</h2>`.
2. Update eyebrow and subtext to remove RFID reference.
3. Update card guarantee badge from `OFFICIAL VERIFIED RFID PASS` to `OFFICIAL WRISTBAND PASS`.

---

### Task 3: Clean Up Perks & Inclusions (`eventData.ts` & `reservationData.ts`)
**Files:**
- Modify: `src/data/eventData.ts`
- Modify: `src/data/reservationData.ts`

**Steps:**
1. In `eventData.ts`: Replace `'Verified RFID access pass'` with `'Official wristband access pass'`.
2. In `reservationData.ts`: Replace `(RFID)` with `(Gelang Resmi)`.

---

### Task 4: Harmonize Rules, FAQ, and Rundowns
**Files:**
- Modify: `src/pages/NightOneEventPage.tsx`
- Modify: `src/pages/NightTwoEventPage.tsx`
- Modify: `src/components/RulesFAQ.tsx`
- Modify: `src/components/mobile/RulesFAQMobile.tsx`
- Modify: `src/pages/EventDetailsPage.tsx`

**Steps:**
1. Replace references to `gelang RFID` with `gelang fisik resmi` / `wristband resmi`.

---

### Task 5: Verification
**Steps:**
1. Run `npm run lint` (`tsc --noEmit`) to verify 0 errors.
