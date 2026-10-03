# Ticket Cards — Glass Transparency & UI/UX Polish

> **Date:** 2026-10-04
> **Status:** IMPLEMENTED (pending visual QA)
> **Scope:** Section 3 — THE PASSAGE (desktop `tickets.css`, mobile `tickets.mobile.css`, `TicketSectionMobile.tsx`)

---

## 1. Problems (from mobile screenshot 393x852)
1. Cards read as near-opaque dark slabs; the crimson cathedral backdrop barely shows through.
2. Category tag and `LIMITED · N SLOTS` badge sit on one line and collide (`1 NIGHT PASS · 30 OCT LIMITED · 30 SLOTS`).
3. Carousel opened on card 1/3 instead of the recommended 2 Days Pass (initial centering ran too early).
4. All cards look equally important while swiping; no clear "focused" card.
5. Perk text (muted grey) loses contrast once the card becomes more transparent.

## 2. Plan

| # | Change | File |
| :-- | :-- | :-- |
| 1 | Lower card fill alpha (~0.74 → ~0.34, protagonist ~0.5), keep strong `backdrop-filter` blur + saturate, add faint top-light gradient so it still feels like glass | `tickets.css`, `tickets.mobile.css` |
| 2 | Stack header: category on top, quota as a separate pill below (no collision at any width) | both CSS |
| 3 | Improve legibility on transparent glass: lighter perk colour, subtle `text-shadow` on title/price | both CSS |
| 4 | Mobile focus state: active card full size/opacity, neighbours slightly dimmed + scaled (`is-focused`) | `TicketSectionMobile.tsx`, mobile CSS |
| 5 | Robust initial centering: re-run on next frame and again after 350ms (layout/fonts settled) | `TicketSectionMobile.tsx` |

## 3. Verification Checklist
- [ ] `npx tsc -b` passes.
- [ ] Cathedral backdrop visibly shows through cards (desktop + mobile) without hurting text contrast.
- [ ] Category and quota pill never overlap (320px → 1440px).
- [ ] Mobile opens centered on **Early Bird 2 Days Pass**; neighbours dimmed.
- [ ] Hover levitation and protagonist lift still work on desktop.
- [ ] CTA text and price remain WCAG AA readable.
