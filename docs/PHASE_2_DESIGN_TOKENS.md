# PHASE 2: DESIGN SYSTEM, TYPOGRAPHY & DESIGN TOKENS

> **Status:** PENDING (Prerequisite: Phase 1 Asset Approval)  
> **Target Files:** [`index.html`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/index.html), [`src/index.css`](file:///d:/Dokumen/02_Kerja_Profesional/HOW%20Parkun/src/index.css)

---

## 1. Objective
Establish the foundational styling tokens, typography pairings, and material treatments in CSS, completely eradicating legacy "cyber-rave" artifacts.

---

## 2. Typography Integration (`index.html`)

### Fonts to Load
1. **Cinzel** (Weights: 400, 600, 700) — Primary Monumental Display for Entity & Campaign titles.
2. **Cormorant Garamond** (Weights: 400, 600, Italic) — Editorial accents and poetic narrative touches.
3. **Inter** (Weights: 400, 500, 600) — High-legibility functional UI, tickets, metadata, and body copy.

### Fonts to Purge
* ❌ Remove `Michroma` (too sci-fi/racing).
* ❌ Remove `Space Grotesk` (too generic startup).

```html
<!-- Google Fonts CDN Configuration -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

## 3. Design Tokens Architecture (`src/index.css`)

### Color System (*Darkness → Reveal → Light*)
```css
:root {
  /* Canvas & Shadows */
  --color-void: #060709;          /* Deepest obsidian canvas */
  --color-midnight: #0D1117;      /* Cold charcoal blue ambient */
  --color-surface-dark: #12161F;  /* Subdued card/container surface */

  /* The Single Signal of Life & Party */
  --color-oxblood: #5C0D12;       /* Rich dark blood red */
  --color-crimson: #8F1D24;       /* Warm light source / edge illumination */
  --color-crimson-glow: rgba(143, 29, 36, 0.4);

  /* Rare Physical Materials */
  --color-gold-antique: #C5A869;  /* Cast brass / ancient gold */
  --color-gold-burnished: #8C6E38;/* Deep gold shadow tone */
  --color-gold-hairline: rgba(197, 168, 105, 0.2);

  /* Functional Typography */
  --color-ivory: #E9E4DA;         /* Crisp, high-contrast readable text */
  --color-muted: #9CA3AF;         /* Secondary administrative metadata */
  --color-dim: #4B5563;           /* De-emphasized borders & timestamps */
}
```

### Material & Typography Utilities
```css
/* Monumental Title Styling */
.font-monumental {
  font-family: 'Cinzel', serif;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

/* Antique Gold Metallic Treatment */
.text-gold-metallic {
  background: linear-gradient(180deg, #F3E7C4 0%, #C5A869 50%, #8C6E38 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(197, 168, 105, 0.15);
}

/* Film Credits Style Metadata */
.font-metadata {
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-muted);
}

/* Hairline Document Borders */
.border-document-hairline {
  border: 1px solid var(--color-gold-hairline);
  background: linear-gradient(180deg, rgba(18, 22, 31, 0.7) 0%, rgba(6, 7, 9, 0.9) 100%);
}
```

### Purge Directives
* ❌ Remove all `--accent-volt: #CCFF00;`
* ❌ Remove all `--accent-cyan: #00F0FF;`
* ❌ Remove all multi-colored glowing pulse keyframe animations.

---

## 4. Phase 2 Verification Checklist
- [ ] Google Fonts correctly render without FOIT/layout shifts.
- [ ] Zero instances of `#CCFF00` or `#00F0FF` remaining in stylesheet.
- [ ] Ivory text maintains WCAG AA contrast against `--color-void` (> 7:1).
- [ ] Film grain overlay performs at 60 FPS without GPU lag.
