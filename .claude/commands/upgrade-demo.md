# Upgrade a Units360 Demo

Apply the standard design upgrade to a Units360 demo HTML file.

**Usage:** `/upgrade-demo <filename>`
Example: `/upgrade-demo units360-energy-demo.html`

The file to upgrade is: $ARGUMENTS

---

Before touching anything, read two reference files for exact patterns:
- `units360-scribe-demo.html` — single-ledger invoice, scribe-specific scene
- `units360-cowork-demo.html` — dual invoice comparison, cowork-specific scene

These are the gold standard. The upgrades below describe WHAT to apply; use those files to see HOW it looks in working code.

---

## Changes to apply

Work through these in order. Use Python string replacement (not sed) for bulk CSS changes to avoid quoting issues. Read the file first, then edit.

### 1. Black background theme

Replace CSS variables:
```
--bg:#070c18  →  --bg:#000000
--surface:#0d1526  →  --surface:#0e0e0e
--surface2:#131e35  →  --surface2:#181818
--border:#1e2d4a  →  --border:#2c2c2c
```

Also replace these colors wherever they appear as inline SVG fills or hardcoded CSS backgrounds:
- `#070c18`, `#0d1526`, `#131e35`, `#090e1e`, `#0a0f1e`, `#0a1020`, `#080d1c` → nearest black equivalent (`#000`, `#0a0a0a`, `#111`, `#090909`)
- `#040810`, `#070d1c` → `#050505`
- Old blue border values like `#1e2d4a`, `#2a3f5f` in non-SVG CSS → `#222` or `#2c2c2c`

Update the overlay background: `rgba(7,12,24,0.94)` → `rgba(0,0,0,0.96)`

### 2. Font size increases

Add `font-size:15px` to the `html,body` rule.

Then increase individual elements:
- `#act-title` font-size: whatever it is → `18px`
- `#act-eye` font-size → `10.5px`
- `#act-desc` font-size → `13px`
- `#com-text` font-size → `13px`
- `.m-val` clamp → `clamp(20px, 2.6vw, 30px)`
- `.m-label`, `.m-sub` → `10px`
- `.p-act` → `10.5px`
- `.ev-m-val` → `24px`
- `.ev-m-lbl` → `9.5px`
- `.ev-m-unit` → `9px`
- `.mkey` → `11px`
- `.mval` font-size → `12px`
- `#event-stream` font-size → `11.5px`
- `.ev-block` font-size → `11.5px`, line-height → `1.6`
- `#ev-json-hdr` font-size → `10px`
- `#ev-footer` font-size → `10px`
- `#kbd-hint` font-size → `11.5px`

### 3. Scene SVG: fill empty space

Change the scene wrapper from fixed height to flexible:
```css
/* before */
#scene-wrap { ... flex-shrink:0; height:158px }
/* after */
#scene-wrap { ... flex:1; min-height:100px }
```

This makes the scene expand to fill whatever vertical space remains after the flow diagram, metrics row, and progress bar — eliminating the blank gap.

### 4. Act transition: remove full-screen overlay

**Add this CSS** (before `</style>`):
```css
@keyframes actFlash {
  0%, 15% { background:rgba(0,212,255,0.10); box-shadow:inset 0 0 0 1px rgba(0,212,255,0.2); border-radius:6px }
  100% { background:transparent; box-shadow:none }
}
#act-hdr.flash { animation:actFlash 1.4s ease forwards }
```

**Replace the auto-advance logic in the game loop** (the block that calls `overlayShow`):
```js
// OLD
const next = S.act + 1;
overlayShow(ACTS[next].ovTitle, ACTS[next].ovSub);
setTimeout(() => { overlayHide(); setAct(next); }, 1400);
S.playing = false; S.lastT = null;
setTimeout(() => { S.playing = true; }, 1400);

// NEW
const next = S.act + 1;
S.playing = false; S.lastT = null;
setAct(next);
const ah = $('act-hdr');
ah.classList.remove('flash'); void ah.offsetWidth; ah.classList.add('flash');
setTimeout(() => { S.playing = true; updatePlayBtn(); }, 1000);
```

The overlay HTML and `overlayShow`/`overlayHide` functions can stay — they're just not called anymore.

### 5. MDT always visible — right panel restructure

This is the biggest structural change. The right panel currently has tabs that swap between MDT view and other views. Replace with a persistent MDT header + dynamic area below.

**Remove** the `#term-tabs` HTML block (the tab bar with UNITS/CONVERSIONS or REVENUE/COST tabs).

**Change** `#term-body` CSS from `position:relative` to a flex column:
```css
#term-body { flex:1; overflow:hidden; display:flex; flex-direction:column;
  font-family:'SF Mono','Fira Code',monospace; font-size:11.5px }
```

**Add these CSS rules** (before `</style>`):
```css
#mdt-always { flex-shrink:0; border-bottom:1px solid var(--border); overflow:hidden }
#mdt-full { padding:10px; display:flex; flex-direction:column; gap:6px; overflow-y:auto; max-height:280px }
#mdt-compact { padding:6px 10px; display:none; flex-direction:column; gap:4px }
.mc-chip { font-size:10.5px; padding:5px 10px; border-radius:5px;
  font-family:'SF Mono','Fira Code',monospace; display:flex; align-items:center; gap:6px; flex-wrap:wrap }
/* color variants: add .mc-chip.teal, .mc-chip.green, .mc-chip.amber, .mc-chip.blue as needed */
.mc-chip-key { color:var(--muted); font-size:9.5px }
#dyn-area { flex:1; min-height:0; overflow:hidden; position:relative }
/* all dynamic views are absolute within dyn-area */
#event-view, #dash-view, #inv-view, #summary-view, #change-view { position:absolute; inset:0; overflow:hidden }
```

**Restructure `#term-body` HTML:**
```html
<div id="term-body">

  <!-- Always-visible MDT -->
  <div id="mdt-always">
    <div id="mdt-full">
      <!-- KEEP all existing MDT msec sections here (both/all of them) -->
      <!-- Remove display:none from any section that was previously hidden -->
    </div>
    <div id="mdt-compact">
      <!-- 1-2 summary chips, one per MDT section -->
      <!-- e.g.: <div class="mc-chip teal">🪙 unit1 · unit2 · unit3</div> -->
      <!-- Write chips that summarise the unit definitions in one line each -->
    </div>
  </div>

  <!-- Dynamic area -->
  <div id="dyn-area">
    <!-- Move all existing views here: event-view, dash-view, inv-view, etc. -->
    <!-- Add style="display:none" to all of them by default -->
  </div>

</div>
```

**Update `setAct()`** — replace the view show/hide block:
```js
// MDT: full typewriter in act 0, compact chips after
const isAct0 = idx === 0;
$('mdt-full').style.display = isAct0 ? 'flex' : 'none';
$('mdt-compact').style.display = isAct0 ? 'none' : 'flex';

// Show correct dynamic view
// Map each termMode to its element and display value
// e.g.: $('event-view').style.display = a.termMode === 'event' ? 'flex' : 'none';
// Keep all the existing show/hide logic but change the target IDs to match the dyn-area structure
```

**Update `switchMdtTab()`** — remove section hiding (both sections always visible in `mdt-full`):
```js
function switchMdtTab(i) {
  S.mdtTab = i;
  // no section hiding — typewriter moves to next section automatically
}
```

### 6. Real invoice

Replace any JSON line-by-line typed invoice OR basic card-row invoice with a proper invoice document.

**Add invoice CSS** (before `</style>`). Copy the `.inv-doc`, `.inv-lh`, `.inv-table`, `.inv-totals`, `.inv-footer`, `.inv-t-final` etc. block from `units360-scribe-demo.html` for single invoices, or the `.inv-doc-pair`, `.inv-doc-card`, `.inv-dc-*` block from `units360-cowork-demo.html` for comparison invoices.

**Replace the `#inv-view` content** with a proper invoice document:
- Company letterhead (logo name + tagline)
- Invoice number + date
- From / Bill To section
- Service line items table (Description, Qty, Rate, Amount)
- Totals section (subtotals + net total)
- Footer with Units360.ai attribution

For demos with a single period: use the scribe single-invoice pattern.
For demos that show rate changes across periods: use the cowork dual-invoice pattern.

Reveal animation: use `opacity:0` on sections + a staggered JS setTimeout loop to fade each section in after the act starts (see `revealInvoice()` in scribe demo).

### 7. Invoice panel widening

**Add CSS** (after `#right-panel` rule):
```css
#right-panel.inv-wide { max-width:none; flex:2.4; transition:flex .35s ease }
```

**Add padding** to all invoice elements — outer container should have at least 14px left/right padding, table cells at least 12–16px horizontal padding.

**In `setAct()`**, toggle the class:
```js
if (idx === 4) $('right-panel').classList.add('inv-wide');
else $('right-panel').classList.remove('inv-wide');
```

### 8. Left-panel invoice summary card (optional but recommended)

Add a compact visual invoice summary below the metrics row in the left panel. It appears in the last 1–2 acts. See `#left-inv` and `.li-*` CSS + HTML in `units360-scribe-demo.html` for the exact pattern.

---

## After applying changes

1. Verify in browser that:
   - Black background, no navy remnants
   - Scene SVG fills available height with no blank gap
   - Act transitions show only the act-header flash (no black overlay)
   - MDT sections visible as compact chips from Act 2 onwards
   - Invoice act widens the right panel and shows a real-looking invoice document
2. `git add <file> && git commit -m "Apply standard demo upgrade to <demo name>"`
3. `vercel --prod` from `units360-site/`
