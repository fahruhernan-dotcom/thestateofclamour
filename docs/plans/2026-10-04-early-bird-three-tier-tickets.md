# Early Bird 3-Tier Tickets & Artatix Checkout Link

> **Date:** 2026-10-04
> **Status:** IMPLEMENTED (pending visual QA on desktop + mobile)
> **Scope:** Section 3 — THE PASSAGE (`TicketSection` desktop + `TicketSectionMobile`)

---

## 1. Goal
Replace the previous 4 tiers (Blind, Early Bird, Presale 01, VIP) with exactly **3 Early Bird cards**, all linking to the official checkout:
`https://artatix.co.id/event/swear_in_continental`

| Card | Price | Quota |
| :--- | :--- | :--- |
| Early Bird Day 1 (30 Oct) | Rp 100.000 | 30 |
| Early Bird Day 2 (31 Oct) | Rp 100.000 | 30 |
| Early Bird 2 Days Pass | Rp 180.000 | 20 |

The **2 Days Pass** is the recommended / protagonist tier (best value: saves Rp 20.000 vs. two single-day passes).

---

## 2. Changes

1. **Data model** — `src/types/index.ts`
   - Add optional `quota?: number | null` to `TicketTier`.
2. **Data** — `src/data/eventData.ts`
   - Replace `initialTickets` with the 3 tiers (`tkt-early-day1`, `tkt-early-day2`, `tkt-early-2days`).
   - Add `TICKET_URL` constant; every tier uses it as `ticketUrl` (opened by `handleCheckout` in `App.tsx`).
3. **Desktop** — `src/components/TicketSection.tsx`
   - Protagonist id → `tkt-early-2days`; VIP branch disabled.
   - Replace fake `84% ALLOCATED` badge with real `LIMITED · {quota} SLOTS`.
4. **Mobile** — `src/components/mobile/TicketSectionMobile.tsx`
   - Carousel opens centered on `tkt-early-2days`; same quota badge.
5. **Layout** — `src/styles/tickets.css`
   - Grid: 1 col → 3 cols from 900px (max-width 1080px, centered) so 3 cards never leave an orphan row.

---

## 3. Verification Checklist
- [ ] `npx tsc -b` passes.
- [ ] Desktop (≥900px): 3 equal cards in one row; 2 Days Pass shows crown ribbon.
- [ ] Mobile: carousel has 3 dots, starts on the 2 Days Pass, swipe + arrows work.
- [ ] Each `GET TICKETS →` opens the Artatix event URL in a new tab.
- [ ] No remaining references to `tkt-presale1` / `tkt-vip` that affect behavior.

## 4. Open Items / Notes
- Quota numbers are static; update `quota` in `eventData.ts` (or set `status: 'sold_out'`) as stock changes.
- Leftover VIP / `tkt-vip` class branches in the mobile component and CSS are now dead code; can be cleaned up later.
