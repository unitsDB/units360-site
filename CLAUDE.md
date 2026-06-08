# Units360.ai Demo Site — Claude Context

## What this project is
A static multi-page site hosted on Vercel that serves as the public-facing landing page and interactive demo hub for **Units360.ai** — a no-DevOps platform for the usage economy (define any unit, deploy live APIs + dashboards in minutes).

Vercel project: `drcloudehr/units360-site`
Live URL: https://units360-site.vercel.app
Deploy command (from this folder): `vercel --prod`

---

## File structure
```
units360-site/
├── index.html                      ← Landing page
├── demo-shared.css                 ← Shared light-theme tokens + base styles (link from every demo)
├── units360-token-demo.html        ← Live demo: AI & LLM token metering
├── units360-energy-demo.html       ← Live demo: Solar net metering / utilities
├── units360-logistics-demo.html    ← Live demo: Mobility & logistics
├── units360-fintech-demo.html      ← Live demo: Fintech & banking
├── units360-scribe-demo.html       ← Live demo: Healthcare AI scribe
├── units360-cowork-demo.html       ← Live demo: Co-working space (light-theme reference)
└── CLAUDE.md                       ← This file
```

---

## Demo status

| Industry | Demo file | Status |
|---|---|---|
| AI & LLM Platforms | `units360-token-demo.html` | ✅ Live |
| Utilities & Energy | `units360-energy-demo.html` | ✅ Live |
| Mobility & Logistics | `units360-logistics-demo.html` | ✅ Live |
| Fintech & Banking | `units360-fintech-demo.html` | ✅ Live |
| Healthcare AI (Scribe) | `units360-scribe-demo.html` | ✅ Live |
| Co-working Space | `units360-cowork-demo.html` | ✅ Live |
| Healthcare | — | 🔜 Coming soon |

---

## How to add a new demo

1. Drop the new `.html` file into this folder.
2. Add a `← Units360.ai` back-nav to the top of the new file (copy from an existing demo — it's a fixed `<a>` tag right after `<body>`).
3. In `index.html`, find the card for that industry (search for the industry name). It will be a `dcard dcard--soon` div. Make these changes:
   - Remove `dcard--soon` from the class list.
   - Swap `<div class="dcard-badge">Coming Soon</div>` → `<div class="dcard-live"><span class="dcard-live-dot"></span>Live</div>`
   - Replace `<div class="dcard-cta dcard-cta--soon">In Development</div>` with:
     ```html
     <a class="dcard-cta" href="your-demo-file.html" onclick="event.stopPropagation()">
       Launch Demo <span class="dcard-arrow">→</span>
     </a>
     ```
4. Commit and run `vercel --prod`.

---

## Design system (index.html)

### CSS variables (`:root`)
| Var | Value | Use |
|---|---|---|
| `--bg` | `#03040e` | Page background |
| `--accent` | `#4f8ef7` | Primary blue |
| `--teal` | `#00d4b4` | Secondary / highlights |
| `--accent2` | `#7c5ef7` | Purple |
| `--glass-bg` | `rgba(12,17,45,.55)` | Card backgrounds |
| `--glass-bd` | `rgba(100,130,220,.18)` | Card borders |

### Card CSS variables (per-card, set via inline style)
| Var | Purpose |
|---|---|
| `--dc` | Card accent color (rgba, semi-transparent) — used for glow/preview bg |
| `--dc-solid` | Card accent color (solid hex) — used for border, CTA button, icon glow |

### Industry → particle state mapping (3D WebGL background)
Clicking a card calls `pickIndustry(name, el)` which transitions the Three.js particle system. Valid state names: `llm`, `utilities`, `logistics`, `fintech`, `healthcare`.

---

## Section order in index.html
1. Nav
2. `#hero` — headline + CTA buttons
3. `#explainer` — scroll-driven 5-panel story (chaos → unit → account → transaction → mdt)
4. `#industries` — **Use Cases & Live Demos** (5 industry cards, merged section)
5. `#why` — 6 feature cards
6. `#compare-teaser` — comparison table vs OpenMeter
7. `#signup` — early access form
8. Footer

---

## Demo quality rules (apply to every demo, new or upgraded)

These rules were established while building the Co-working Space demo and must be carried forward to all demos.

### 1. Color schema — always use `demo-shared.css`
Every demo HTML file must link `demo-shared.css` before its own `<style>` block:
```html
<link rel="stylesheet" href="demo-shared.css">
```
Override only demo-specific colors in the local `<style>`. Never hard-code the light-theme palette inline — change it in one place.

Key tokens:
| Token | Value | Meaning |
|---|---|---|
| `--bg` | `#f1f5f9` | Page background (light slate) |
| `--surface` | `#ffffff` | Card / panel |
| `--surface2` | `#f8fafc` | Recessed surface |
| `--teal` | `#0891b2` | Primary accent |
| `--text` | `#0f172a` | Body text |
| `--muted` | `#64748b` | Labels / secondary |
| `--border` | `#e2e8f0` | Borders |

### 2. No engineering jargon in the UI
These terms are internal to Units360's engine. They must **never appear as visible UI labels** — replace them everywhere (nav pills, badges, tab labels, log lines, tooltips).

| Banned term | Replace with |
|---|---|
| MDT | "Usage Event" or "Live Reading" |
| RTE | (hide entirely — it's infrastructure, not user-facing) |
| Unit Definition | "What you're measuring" |
| Account Mapping | "Who gets billed" |
| Transaction Log | "Usage Log" |
| Metering Pipeline | "Live Tracking" |

If a term must appear in a code/API snippet for developer audiences, it's fine in a `<code>` block — just not as a UI label.

### 3. New-user onboarding principle
Every act / panel must answer **"what just happened, in plain English"** before showing numbers. Concretely:
- The **commentary strip** at the bottom of the demo must always explain the current act in one plain sentence (no jargon, no acronyms).
- Act labels in the progress bar should use business language: "A booking is made", "Usage is tracked", "Invoice is generated" — not "Event ingestion", "MDT flush", "RTE dispatch".
- The **first act** of every demo should orient the user: who is the customer, what are they paying for, what does one unit mean.
- Numbers should always carry a unit label next to them (e.g. "42 credits", "3.2 kWh", "$18.40") — never a bare number.

### 4. Demo structure checklist (before shipping)
- [ ] `demo-shared.css` linked
- [ ] No MDT / RTE in any visible label
- [ ] Act 1 explains the business scenario in plain English
- [ ] Commentary strip present and populated for every act
- [ ] All metric values carry a unit label
- [ ] `← Units360.ai` back-nav present (fixed, top-left)
- [ ] Tested at 1280px wide (the design target)

---

## Session history (reverse chronological)

### 2026-05-26
- Merged "Use Cases" and "Live Demos" into single `#industries` section — 5 cards (2 live, 3 coming soon)
- Upgraded demo cards to premium design: preview pane with dot-grid + shimmer, icon glow, colored border glow on hover, metric chips, pill CTA button, Live/Coming Soon badges
- Created `units360-site/` as standalone Vercel project from `units360-landing.html` + two demo files
- Added `← Units360.ai` back-nav to both demo files
- Initial deploy from scratch (prior site was `demoA/` with a single `index.html`)
