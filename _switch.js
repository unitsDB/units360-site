/* ───────────────────────────────────────────────────────────────
   Units360 — Design Version Switcher  (review / internal tool)
   Drop <script src="/_switch.js"></script> before </body> on any page.
   • Bottom-left pill: Old · 01 · 02 · 03
   • "3D BG" toggle writes localStorage `u360_webgl` ("1"/"0") and reloads.
   • Hidden automatically in production: add ?prod to the URL, or set
     window.U360_HIDE_SWITCH = true before this script, or click ✕.
   ─────────────────────────────────────────────────────────────── */
(function () {
  // ── Hide in production ───────────────────────────────────────────
  var params = new URLSearchParams(location.search);
  if (params.has('prod') || window.U360_HIDE_SWITCH ||
      sessionStorage.getItem('u360_switch_hidden') === '1') return;

  // ── Versions — links built relative to the current page so they work
  //    both in preview and on Vercel (where folders sit at the site root). ─
  var path = location.pathname;
  var tail = path.match(/\/v([123])\/[^/]*$/);          // matches .../vN/<file>
  var current = tail ? ('v' + tail[1]) : 'old';
  var baseDir = tail ? path.replace(/\/v[123]\/[^/]*$/, '/')
                     : path.replace(/[^/]*$/, '');        // dir containing the versions
  var VERSIONS = [
    { id: 'old', label: 'Old', href: baseDir + 'index.html',    ready: true  },
    { id: 'v1',  label: '01',  href: baseDir + 'v1/index.html', ready: true  },
    { id: 'v2',  label: '02',  href: baseDir + 'v2/index.html', ready: true  },
    { id: 'v3',  label: '03',  href: baseDir + 'v3/index.html', ready: false }
  ];

  var webglOn = (localStorage.getItem('u360_webgl') || '1') !== '0';

  // ── Build UI ─────────────────────────────────────────────────────
  var wrap = document.createElement('div');
  wrap.id = 'u360-switch';
  wrap.innerHTML =
    '<style>' +
    '#u360-switch{position:fixed;left:16px;bottom:16px;z-index:9999;' +
      'font-family:"JetBrains Mono",ui-monospace,monospace;' +
      'display:flex;align-items:center;gap:8px;padding:7px 9px;' +
      'background:rgba(8,11,20,.82);backdrop-filter:blur(16px);' +
      '-webkit-backdrop-filter:blur(16px);border:1px solid rgba(120,140,200,.22);' +
      'border-radius:12px;box-shadow:0 10px 34px rgba(0,0,0,.5);user-select:none}' +
    '#u360-switch .u-lbl{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;' +
      'color:#677099;padding:0 4px 0 2px}' +
    '#u360-switch .u-seg{display:flex;background:rgba(255,255,255,.04);' +
      'border:1px solid rgba(120,140,200,.16);border-radius:8px;overflow:hidden}' +
    '#u360-switch a.u-v{font-size:11px;font-weight:600;letter-spacing:.5px;' +
      'color:#9aa2c4;text-decoration:none;padding:6px 11px;transition:background .15s,color .15s}' +
    '#u360-switch a.u-v+ .u-v{border-left:1px solid rgba(120,140,200,.14)}' +
    '#u360-switch a.u-v:hover{color:#e8eaf6;background:rgba(255,255,255,.05)}' +
    '#u360-switch a.u-v.on{color:#03120f;background:#00d4b4}' +
    '#u360-switch a.u-v.soon{color:#4a5070;cursor:not-allowed}' +
    '#u360-switch .u-3d{display:flex;align-items:center;gap:6px;cursor:pointer;' +
      'font-size:10px;letter-spacing:.5px;color:#9aa2c4;padding:5px 9px;border-radius:8px;' +
      'border:1px solid rgba(120,140,200,.16);background:rgba(255,255,255,.03)}' +
    '#u360-switch .u-3d:hover{color:#e8eaf6}' +
    '#u360-switch .u-pip{width:7px;height:7px;border-radius:50%}' +
    '#u360-switch .u-x{cursor:pointer;color:#5b637f;font-size:13px;' +
      'line-height:1;padding:2px 4px}' +
    '#u360-switch .u-x:hover{color:#e8eaf6}' +
    '</style>';

  // label
  var lbl = document.createElement('span');
  lbl.className = 'u-lbl'; lbl.textContent = 'Design';
  wrap.appendChild(lbl);

  // version segmented control
  var seg = document.createElement('div'); seg.className = 'u-seg';
  VERSIONS.forEach(function (v) {
    var a = document.createElement('a');
    a.className = 'u-v' + (v.id === current ? ' on' : '') + (v.ready ? '' : ' soon');
    a.textContent = v.label;
    if (v.ready) { a.href = v.href; }
    else { a.title = 'Not built yet'; a.addEventListener('click', function (e) { e.preventDefault(); }); }
    seg.appendChild(a);
  });
  wrap.appendChild(seg);

  // 3D toggle
  var t = document.createElement('div'); t.className = 'u-3d';
  var pip = document.createElement('span'); pip.className = 'u-pip';
  pip.style.background = webglOn ? '#00d4b4' : '#4a5070';
  var tt = document.createElement('span');
  tt.textContent = '3D ' + (webglOn ? 'ON' : 'OFF');
  t.appendChild(pip); t.appendChild(tt);
  t.addEventListener('click', function () {
    localStorage.setItem('u360_webgl', webglOn ? '0' : '1');
    location.reload();
  });
  wrap.appendChild(t);

  // hide
  var x = document.createElement('span');
  x.className = 'u-x'; x.textContent = '✕'; x.title = 'Hide for this session';
  x.addEventListener('click', function () {
    sessionStorage.setItem('u360_switch_hidden', '1');
    wrap.remove();
  });
  wrap.appendChild(x);

  document.body.appendChild(wrap);
})();
