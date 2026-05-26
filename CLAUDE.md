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
├── index.html                   ← Landing page (everything lives here)
├── units360-token-demo.html     ← Live demo: AI & LLM token metering
├── units360-energy-demo.html    ← Live demo: Solar net metering / utilities
└── CLAUDE.md                    ← This file
```

---

## Demo status

| Industry | Demo file | Status |
|---|---|---|
| AI & LLM Platforms | `units360-token-demo.html` | ✅ Live |
| Utilities & Energy | `units360-energy-demo.html` | ✅ Live |
| Mobility & Logistics | — | 🔜 Coming soon |
| Fintech & Banking | — | 🔜 Coming soon |
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

## Session history (reverse chronological)

### 2026-05-26
- Merged "Use Cases" and "Live Demos" into single `#industries` section — 5 cards (2 live, 3 coming soon)
- Upgraded demo cards to premium design: preview pane with dot-grid + shimmer, icon glow, colored border glow on hover, metric chips, pill CTA button, Live/Coming Soon badges
- Created `units360-site/` as standalone Vercel project from `units360-landing.html` + two demo files
- Added `← Units360.ai` back-nav to both demo files
- Initial deploy from scratch (prior site was `demoA/` with a single `index.html`)
