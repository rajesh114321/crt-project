/* QueueLess – shared UI helpers */
const ICONS = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  ticket: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M1 12h4M19 12h4M4.2 19.8L7 17M17 7l2.8-2.8"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  skip: '<path d="M5 4l10 8-10 8zM19 5v14"/>',
  play: '<path d="M5 3l14 9-14 9z"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>',
  mail: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M22 6l-10 7L2 6"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  id: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M13 10h6M13 14h4"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  wallet: '<path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h16v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7"/><path d="M16 14h2"/>',
  coffee: '<path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z"/><path d="M6 1v3M10 1v3M14 1v3"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  bar: '<path d="M12 20V10M18 20V4M6 20v-4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  zap: '<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  refresh: '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.8-3.4L23 10M1 14l4.7 4.4A9 9 0 0 0 20.5 15"/>',
  menu: '<path d="M3 12h18M3 6h18M3 18h18"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>',
  tv: '<rect x="2" y="7" width="20" height="13" rx="2"/><path d="M17 2l-5 5-5-5"/>',
  printer: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>'
};
// dark mode (applied immediately to avoid a flash)
document.documentElement.dataset.theme = localStorage.getItem('ql_theme') || '';
function setupTheme() {
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => {
    const draw = () => { b.innerHTML = icon(document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon', 18); b.setAttribute('aria-label', 'Toggle dark mode'); };
    draw();
    b.onclick = () => { const d = document.documentElement.dataset.theme === 'dark' ? '' : 'dark'; document.documentElement.dataset.theme = d; localStorage.setItem('ql_theme', d); document.querySelectorAll('[data-theme-toggle]').forEach((x) => x.dispatchEvent(new Event('redraw'))); draw(); };
    b.addEventListener('redraw', draw);
  });
}
function icon(n, s = 20) {
  return `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;
}
function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((el) => {
    if (el.dataset.done) return;
    el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon, +el.dataset.size || 18));
    el.dataset.done = 1;
  });
}
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtTime = (iso) => iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const STATUS = { WAITING: ['Waiting', 'warn'], CALLING: ['Now Serving', 'info'], COMPLETED: ['Completed', 'ok'], SKIPPED: ['Skipped', 'bad'], CANCELLED: ['Cancelled', 'mute'] };
const badge = (s) => `<span class="badge ${STATUS[s]?.[1] || ''}">${STATUS[s]?.[0] || esc(s)}</span>`;

function toast(msg, type = 'info') {
  let box = document.getElementById('toasts');
  if (!box) { box = document.createElement('div'); box.id = 'toasts'; box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = icon(type === 'ok' ? 'check' : type === 'bad' ? 'x' : 'zap', 18) + `<span>${esc(msg)}</span>`;
  box.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 3200);
}
function setLoading(btn, on, text) {
  if (!btn) return;
  if (on) { btn.dataset.label = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="spin"></span>' + (text || 'Please wait…'); }
  else { btn.disabled = false; if (btn.dataset.label) btn.innerHTML = btn.dataset.label; }
}
function countUp(el, to, ms = 900, decimals = 0) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = to.toFixed(decimals); return; }
  const t0 = performance.now();
  (function f(t) { const p = Math.min(1, (t - t0) / ms); el.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(decimals); if (p < 1) requestAnimationFrame(f); })(t0);
}
// photo with graceful fallback (gradient + icon) if the image URL fails
function photo(id, alt, w = 800, cls = '') {
  if (!id) return `<div class="ph ${cls} img-fail" role="img" aria-label="${esc(alt)}"></div>`;
  return `<div class="ph ${cls}"><img src="https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70" alt="${esc(alt)}" loading="lazy" onerror="this.parentElement.classList.add('img-fail');this.remove()"></div>`;
}
document.addEventListener('DOMContentLoaded', () => {
  hydrateIcons(); setupTheme();
  document.querySelectorAll('.pw-toggle').forEach((b) => b.addEventListener('click', () => {
    const i = document.getElementById(b.dataset.target); i.type = i.type === 'password' ? 'text' : 'password';
    b.setAttribute('aria-label', i.type === 'password' ? 'Show password' : 'Hide password');
  }));
  document.querySelectorAll('[data-fail-img]').forEach((img) => {
    const art = img.dataset.failImg;
    const bad = () => { if (art && !img.src.endsWith(art)) { img.src = art; } else { img.parentElement.classList.add('img-fail'); img.remove(); } };
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) bad();
    img.addEventListener('error', bad);
  });
});

/* ---- modal + QR helpers ---- */
function openModal(html, opts = {}) {
  closeModal();
  const w = document.createElement('div'); w.id = 'modal'; w.className = 'modal-wrap';
  w.innerHTML = `<div class="modal ${opts.cls || ''}" role="dialog" aria-modal="true"><button class="modal-x" aria-label="Close">${icon('x', 18)}</button>${html}</div>`;
  w.addEventListener('click', (e) => { if (e.target === w || e.target.closest('.modal-x')) closeModal(); });
  document.addEventListener('keydown', escClose);
  document.body.appendChild(w); return w.querySelector('.modal');
}
function escClose(e) { if (e.key === 'Escape') closeModal(); }
function closeModal() { const m = document.getElementById('modal'); if (m) { if (window.onModalClose) window.onModalClose(); m.remove(); } document.removeEventListener('keydown', escClose); }
function printModal() { document.body.classList.add('pm'); window.print(); }
window.addEventListener('afterprint', () => document.body.classList.remove('pm'));
function qrSvg(text) {
  if (typeof qrcode === 'undefined') return '';
  const q = qrcode(0, 'M'); q.addData(text); q.make();
  return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }).replace(/<svg /, '<svg role="img" aria-label="QR code for token" ');
}
const tokenCode = (t, studentId) => 'QL|' + t.number + '|' + (studentId || '') + '|' + t.id;
function starsHtml(n) { return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n); }
function fmtDur(a, b) { if (!a || !b) return '—'; const s = Math.round((new Date(b) - new Date(a)) / 1000); return s < 60 ? s + ' sec' : (s / 60).toFixed(1) + ' min'; }

// interactive waiting-time calculator (same rule the app uses)
function waitCalcHtml(o = {}) {
  const a = o.ahead ?? 5, v = o.avg ?? 3, c = o.counters ?? 1;
  return `<div class="calc"><div class="formula"><b>Estimated wait</b> = people ahead × average service time ÷ active counters</div>
    <label>People ahead: <b id="cA">${a}</b><input type="range" id="rA" min="0" max="30" value="${a}"></label>
    <label>Average service time (min): <b id="cV">${v}</b><input type="range" id="rV" min="1" max="15" step="0.5" value="${v}"></label>
    <label>Active counters: <b id="cC">${c}</b><input type="range" id="rC" min="1" max="6" value="${c}"></label>
    <div class="result"><span>Result</span><strong id="cR"></strong></div>
    <p class="calc-note">Average time = total service time ÷ people served, from completed tokens. With fewer than 3 records, a default time is used and shown as an <b>estimate</b>.</p></div>`;
}
function waitCalcInit(root) {
  const g = (id) => root.querySelector('#' + id), upd = () => { const a = +g('rA').value, v = +g('rV').value, c = +g('rC').value; g('cA').textContent = a; g('cV').textContent = v; g('cC').textContent = c; g('cR').textContent = '≈ ' + Math.ceil((a * v) / c) + ' min'; };
  ['rA', 'rV', 'rC'].forEach((id) => g(id).addEventListener('input', upd)); upd();
}
