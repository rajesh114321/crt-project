const $ = (id) => document.getElementById(id);
let tokens = [], counters = [], services = [], stats = null, cur = 'dash';
const TITLES = { dash: 'Dashboard', tokens: 'Token Management', counters: 'Counters', services: 'Services', history: 'Token History', reports: 'Reports', analytics: 'Analytics', search: 'Search' };
$('date').textContent = new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
function show(v) {
  cur = v;
  document.querySelectorAll('.view').forEach((x) => x.classList.toggle('on', x.id === 'v-' + v));
  document.querySelectorAll('.side .item[data-view]').forEach((b) => b.classList.toggle('on', b.dataset.view === v));
  $('title').textContent = TITLES[v]; $('side').classList.remove('open'); $('scrim').classList.remove('show'); render();
}
document.querySelectorAll('.side .item[data-view]').forEach((b) => b.onclick = () => show(b.dataset.view));
$('menu').onclick = () => { $('side').classList.add('open'); $('scrim').classList.add('show'); };
$('scrim').onclick = () => { $('side').classList.remove('open'); $('scrim').classList.remove('show'); };
$('logout').onclick = () => { API.logout(); location.href = 'index.html'; };
$('refresh').onclick = async (e) => { setLoading(e.currentTarget, true, 'Refreshing…'); await load(); setLoading(e.currentTarget, false); toast('Data refreshed', 'ok'); };
$('reset').onclick = () => { if (confirm('Reset ALL demo data (users, tokens, counters)?')) API.resetDemo(); };

const bars = (el, rows) => { const max = Math.max(1, ...rows.map((r) => r[1])); el.innerHTML = rows.map((r) => `<div class="bar-row"><span>${esc(r[0])}</span><div class="bar"><i data-w="${(r[1] / max) * 100}"></i></div><b>${r[1]}</b></div>`).join(''); requestAnimationFrame(() => el.querySelectorAll('i').forEach((i) => i.style.width = i.dataset.w + '%')); };
const STATUS_LABEL = { WAITING: 'Waiting', CALLING: 'Serving', COMPLETED: 'Completed', SKIPPED: 'Skipped', CANCELLED: 'Cancelled' };
const mins = (s) => (s / 60).toFixed(1) + ' min';

async function load() {
  [tokens, counters, services, stats] = await Promise.all([API.adminTokens(), API.getCounters(), API.getAllServices(), API.adminStats()]);
  render();
}
async function render() {
  if (!stats) return;
  if (cur === 'dash') {
    const items = [['ticket', 'Total tokens today', stats.total, ''], ['clock', 'Waiting tokens', stats.waiting, 'o'], ['check', 'Completed tokens', stats.completed, 'g'], ['activity', 'Avg. service time', stats.avgMinutes === null ? '—' : stats.avgMinutes + ' min', 'c']];
    $('astats').innerHTML = items.map((i) => `<div class="card sc"><div class="fi ${i[3]}">${icon(i[0], 22)}</div><div><small>${i[1]}</small><strong>${i[2]}</strong></div></div>`).join('');
    $('ctrBoard').innerHTML = counters.map((c) => `<div class="card ctr"><h3>${esc(c.name)} ${c.status === 'Active' ? '<span class="badge ok">Active</span>' : '<span class="badge mute">' + esc(c.status) + '</span>'}</h3><small>${esc(c.serviceName)}</small>
      <div class="cur">${c.serving || '—'}</div><small>${c.serving ? 'Now serving' : 'Idle'}</small>
      <div class="acts" style="margin-top:12px">${c.serving ? `<button class="btn btn-ok btn-sm" data-do="complete" data-id="${c.servingId}">${icon('check', 14)} Complete</button><button class="btn btn-warn btn-sm" data-do="skip" data-id="${c.servingId}">${icon('skip', 14)} Skip</button>` : `<button class="btn btn-primary btn-sm" data-do="call" data-id="${c.id}" ${c.status !== 'Active' ? 'disabled' : ''}>${icon('play', 14)} Call next</button>`}</div></div>`).join('');
    bars($('bars'), stats.perService.map((s) => [s.name, s.count]));
    $('recent').innerHTML = tokens.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6).map((t) => `<div style="display:flex;justify-content:space-between;gap:8px;padding:9px 0;border-top:1px solid var(--line)"><span><b>${esc(t.number)}</b> · ${esc(t.serviceName)}</span><span>${badge(t.status)} <small style="color:var(--muted)">${fmtTime(t.updatedAt)}</small></span></div>`).join('') || '<div class="empty">No activity yet.</div>';
  }
  if (cur === 'tokens') {
    const q = $('q').value.toLowerCase(), f = $('fs').value;
    $('callCtr').innerHTML = counters.filter((c) => c.status === 'Active').map((c) => `<option value="${c.id}">${esc(c.name)} · ${esc(c.serviceName)}</option>`).join('');
    const rows = tokens.filter((t) => (f === 'active' ? t.status === 'WAITING' || t.status === 'CALLING' : !f || t.status === f) && (!q || (t.number + t.studentName + t.serviceName).toLowerCase().includes(q)));
    $('tt').innerHTML = rows.length ? rows.map((t) => `<tr><td><b>${esc(t.number)}</b><br><small style="color:var(--muted)">${esc(t.studentName)}</small></td><td>${esc(t.serviceName)}</td><td>${esc(t.counterName)}</td><td>${badge(t.status)}</td>
      <td><div class="acts">${t.status === 'CALLING' ? `<button class="btn btn-ok btn-sm" data-do="complete" data-id="${t.id}">Complete</button>` : ''}${t.status === 'WAITING' || t.status === 'CALLING' ? `<button class="btn btn-light btn-sm" data-do="skip" data-id="${t.id}">Skip</button>` : '<span style="color:var(--muted)">—</span>'}</div></td></tr>`).join('')
      : `<tr><td colspan="5"><div class="empty">${icon('ticket', 32)}<h3>No tokens match</h3><p>Try a different filter.</p></div></td></tr>`;
  }
  if (cur === 'counters') {
    $('csvc').innerHTML = services.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join('');
    $('ctb').innerHTML = counters.map((c) => `<tr><td><b>${esc(c.name)}</b></td><td>${esc(c.serviceName)}</td><td>${c.serving || '—'}</td><td>${c.status === 'Active' ? '<span class="badge ok">Active</span>' : '<span class="badge mute">' + esc(c.status) + '</span>'}</td>
      <td><div class="acts"><button class="btn btn-light btn-sm" data-do="toggle" data-id="${c.id}" data-st="${c.status === 'Active' ? 'Closed' : 'Active'}">${c.status === 'Active' ? 'Close' : 'Open'}</button><button class="btn btn-light btn-sm" data-do="delctr" data-id="${c.id}">${icon('trash', 14)}</button></div></td></tr>`).join('');
  }
  if (cur === 'services') {
    $('stb').innerHTML = services.map((s) => `<tr><td><b>${esc(s.name)}</b><br><small style="color:var(--muted)">${esc(s.desc)}</small></td><td><input class="plain" type="number" min="1" max="60" value="${s.defaultAvg}" style="width:80px" data-avg="${s.id}"></td><td>${s.avg.estimated ? '<span class="badge warn">Estimate</span>' : s.avg.minutes + ' min'}</td><td>${s.avg.records}</td><td>${s.active ? '<span class="badge ok">Active</span>' : '<span class="badge mute">Disabled</span>'}</td>
      <td><div class="acts"><button class="btn btn-light btn-sm" data-do="saveavg" data-id="${s.id}">Save time</button><button class="btn btn-light btn-sm" data-do="togsvc" data-id="${s.id}">${s.active ? 'Disable' : 'Enable'}</button></div></td></tr>`).join('');
  }
  if (cur === 'history') {
    const q = $('hq').value.toLowerCase(), f = $('hs').value;
    const rows = tokens.filter((t) => (!f || t.status === f) && (!q || (t.number + t.studentName + t.serviceName).toLowerCase().includes(q)));
    $('ht').innerHTML = rows.length ? rows.map((t) => `<tr><td><b>${esc(t.number)}</b></td><td>${esc(t.studentName)}</td><td>${esc(t.serviceName)}</td><td>${fmtDate(t.createdAt)} ${fmtTime(t.createdAt)}</td><td>${badge(t.status)}</td></tr>`).join('') : `<tr><td colspan="5"><div class="empty"><h3>No history found</h3></div></td></tr>`;
  }
  if (cur === 'analytics') {
    const a = await API.analytics();
    const cards = [['check', 'Completion rate', a.completionRate === null ? '—' : a.completionRate + '%', 'g'], ['clock', 'Avg. actual wait', a.avgWait === null ? '—' : a.avgWait + ' min', 'o'], ['activity', 'Avg. service time', a.avgService === null ? '—' : a.avgService + ' min', 'c'], ['users', 'Avg. rating', a.rating === null ? '—' : a.rating + ' / 5', '']];
    $('anStats').innerHTML = cards.map((i) => `<div class="card sc"><div class="fi ${i[3]}">${icon(i[0], 22)}</div><div><small>${i[1]}</small><strong>${i[2]}</strong></div></div>`).join('');
    const hrs = a.byHour.map((v, i) => [i, v]).filter((x) => x[1] > 0), lo = Math.max(0, (hrs[0]?.[0] ?? 9) - 1), hi = Math.min(23, (hrs[hrs.length - 1]?.[0] ?? 12) + 1), mx = Math.max(1, ...a.byHour);
    $('hourCols').innerHTML = a.byHour.slice(lo, hi + 1).map((v, i) => `<div class="c"><b>${v || ''}</b><i style="height:${(v / mx) * 100}%"></i><span>${(lo + i) % 12 || 12}${lo + i < 12 ? 'a' : 'p'}</span></div>`).join('');
    bars($('anStatus'), a.status.map((s) => [STATUS_LABEL[s[0]], s[1]]));
    $('anSvc').innerHTML = a.perService.map((s) => `<tr><td>${esc(s.name)}</td><td>${s.tokens}</td><td>${s.avg} min ${s.estimated ? '<span class="badge warn">est.</span>' : ''}</td></tr>`).join('');
    $('anRate').textContent = a.rating ? starsHtml(Math.round(a.rating)) + ' (' + a.ratingCount + ')' : '';
    bars($('anDist'), a.dist.map((v, i) => [(i + 1) + ' ★', v]).reverse());
    $('anFb').innerHTML = a.feedback.length ? a.feedback.map((f) => `<div style="padding:8px 0;border-top:1px solid var(--line);font-size:.88rem"><span class="star-txt">${starsHtml(f.rating)}</span> <b>${esc(f.number)}</b> · ${esc(f.name)}<br><span style="color:var(--muted)">${esc(f.text)}</span></div>`).join('') : '<p style="color:var(--muted);font-size:.88rem">No written feedback yet. Students can rate completed tokens.</p>';
  }
  if (cur === 'search') { if ($('ssv').options.length === 1) $('ssv').innerHTML += services.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join(''); doSearch(); }
  if (cur === 'reports') {
    bars($('sbars'), [['Waiting', stats.waiting], ['Serving', stats.calling], ['Completed', stats.completed], ['Skipped', stats.skipped], ['Cancelled', stats.cancelled]]);
    bars($('bars2'), stats.perService.map((s) => [s.name, s.count]));
    const r = await API.serviceRecords();
    $('rt').innerHTML = r.length ? r.map((x) => `<tr><td><b>${esc(x.tokenNumber)}</b></td><td>${esc(x.serviceName)}</td><td>${esc(x.counterName)}</td><td>${fmtTime(x.startedAt)}</td><td>${fmtTime(x.completedAt)}</td><td>${mins(x.seconds)}</td></tr>`).join('') : `<tr><td colspan="6"><div class="empty"><h3>No service records yet</h3><p>Complete a token to create one.</p></div></td></tr>`;
  }
}
async function act(fn, ok) { try { await fn(); if (ok) toast(ok, 'ok'); await load(); } catch (e) { toast(e.message, 'bad'); } }
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-do]'); if (!b) return; const id = b.dataset.id;
  ({ call: () => act(() => API.callNext(id), 'Next token called'), complete: () => act(() => API.completeToken(id), 'Token completed'), skip: () => act(() => API.skipToken(id), 'Token skipped'),
    toggle: () => act(() => API.saveCounter({ id, status: b.dataset.st }), 'Counter updated'), delctr: () => confirm('Delete this counter?') && act(() => API.deleteCounter(id), 'Counter deleted'),
    saveavg: () => act(() => API.saveService({ id, defaultAvg: document.querySelector(`[data-avg="${id}"]`).value }), 'Default time saved'),
    togsvc: () => { const s = services.find((x) => x.id === id); act(() => API.saveService({ id, defaultAvg: s.defaultAvg, active: !s.active }), 'Service updated'); } })[b.dataset.do]?.();
});
$('callNext').onclick = () => { const id = $('callCtr').value; if (!id) return toast('No active counter available', 'bad'); act(() => API.callNext(id), 'Next token called'); };
$('q').oninput = $('fs').onchange = $('hq').oninput = $('hs').onchange = render;
$('cf').addEventListener('submit', (e) => { e.preventDefault(); act(() => API.saveCounter({ name: $('cname').value, serviceId: $('csvc').value }), 'Counter added').then(() => $('cname').value = ''); });
$('sf').addEventListener('submit', (e) => { e.preventDefault(); act(() => API.saveService({ name: $('sname').value, desc: $('sdesc').value, defaultAvg: $('savg').value }), 'Service added').then(() => { $('sname').value = ''; $('sdesc').value = ''; }); });
(async () => {
  let u; try { u = await API.me(); } catch (e) { location.href = 'login.html'; return; }
  if (u.role !== 'admin') { location.href = 'student.html'; return; }
  $('aname').textContent = u.name; await load(); setInterval(load, 6000); window.addEventListener('storage', load);
})();

// ---- search ----
let found = [];
function doSearch() {
  const q = $('sq').value.trim().toLowerCase(), st = $('ss').value, sv = $('ssv').value, f = $('sfrom').value ? new Date($('sfrom').value + 'T00:00:00') : null, t = $('sto').value ? new Date($('sto').value + 'T23:59:59') : null;
  found = tokens.filter((x) => (!st || x.status === st) && (!sv || x.serviceId === sv) && (!f || new Date(x.createdAt) >= f) && (!t || new Date(x.createdAt) <= t) && (!q || (x.number + ' ' + x.studentName + ' ' + x.studentId).toLowerCase().includes(q)));
  $('scount').textContent = found.length + ' result' + (found.length === 1 ? '' : 's');
  $('sres').innerHTML = found.length ? found.map((x) => `<tr><td><b>${esc(x.number)}</b></td><td>${esc(x.studentName)}<br><small style="color:var(--muted)">${esc(x.studentId)}</small></td><td>${esc(x.serviceName)}</td><td>${fmtDate(x.createdAt)} ${fmtTime(x.createdAt)}</td><td>${fmtDur(x.startedAt, x.completedAt)}</td><td>${x.rating ? '<span class="star-txt">' + starsHtml(x.rating) + '</span>' : '—'}</td><td>${badge(x.status)}</td></tr>`).join('') : `<tr><td colspan="7"><div class="empty">${icon('search', 32)}<h3>No tokens found</h3><p>Try different filters.</p></div></td></tr>`;
}
['sq', 'ss', 'ssv', 'sfrom', 'sto'].forEach((id) => $(id).addEventListener('input', doSearch));
$('sclear').onclick = () => { ['sq', 'ss', 'ssv', 'sfrom', 'sto'].forEach((id) => $(id).value = ''); doSearch(); };
$('scsv').onclick = () => {
  if (!found.length) return toast('Nothing to export', 'bad');
  const rows = [['Token', 'Student', 'Student ID', 'Service', 'Created', 'Called', 'Completed', 'Status', 'Rating']].concat(found.map((x) => [x.number, x.studentName, x.studentId, x.serviceName, x.createdAt, x.startedAt || '', x.completedAt || '', x.status, x.rating || '']));
  const csv = rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'queueless-tokens.csv'; a.click(); toast('CSV downloaded', 'ok');
};
// ---- counter scanner (type/paste code, USB scanner, or camera where the browser supports QR detection) ----
let stream = null, scanTimer = null;
window.onModalClose = () => { clearInterval(scanTimer); if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; } };
$('scanBtn').onclick = () => {
  const m = openModal(`<h3>Scan / Verify Token</h3><p class="sub">Scan the student's QR pass, or type the token number (e.g. F105) or code.</p>
    <div class="formrow"><div class="field" style="flex:1"><input class="plain" id="scode" placeholder="Token code or number" autocomplete="off"></div><button class="btn btn-primary btn-sm" id="sgo">Verify</button></div>
    <button class="btn btn-light btn-sm" id="scam" data-icon="ticket">Use camera</button><div id="camBox"></div><div id="sres2"></div>`, {});
  hydrateIcons(m); const input = m.querySelector('#scode'); input.focus();
  const verify = async () => {
    const box = m.querySelector('#sres2'); try {
      const t = await API.verifyToken(input.value); const free = counters.filter((c) => c.serviceId === t.serviceId && c.status === 'Active' && !c.serving);
      box.innerHTML = `<div class="scan-res"><div style="display:flex;justify-content:space-between;align-items:center"><span class="big">${esc(t.number)}</span>${badge(t.status)}</div>
        <div>${esc(t.studentName)} · ${esc(t.studentId)}<br><span style="color:var(--muted)">${esc(t.serviceName)} · ${t.status === 'WAITING' ? t.peopleAhead + ' ahead · about ' + t.estimatedMinutes + ' min' : esc(t.counterName)}</span></div>
        ${t.status === 'WAITING' ? (t.firstInQueue ? (free.length ? `<div class="formrow" style="margin:0"><select class="plain" id="sctr">${free.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select><button class="btn btn-ok btn-sm" id="sserve">Call to counter</button></div>` : '<p style="color:var(--warn)">First in queue, but no free active counter.</p>') : `<p style="color:var(--warn)">Not their turn yet – ${t.peopleAhead} token(s) ahead. Fair order is kept.</p>`) : ''}
        ${t.status === 'CALLING' ? `<button class="btn btn-ok btn-sm" id="sdone">Complete token</button>` : ''}${['COMPLETED', 'SKIPPED', 'CANCELLED'].includes(t.status) ? '<p style="color:var(--bad)">This token is already closed.</p>' : ''}</div>`;
      const sv = box.querySelector('#sserve'); if (sv) sv.onclick = async () => { try { await API.callNext(box.querySelector('#sctr').value); toast('Token called', 'ok'); await load(); verify(); } catch (e) { toast(e.message, 'bad'); } };
      const sd = box.querySelector('#sdone'); if (sd) sd.onclick = async () => { try { await API.completeToken(t.id); toast('Token completed', 'ok'); await load(); verify(); } catch (e) { toast(e.message, 'bad'); } };
    } catch (e) { box.innerHTML = `<div class="form-err show" style="margin-top:14px">${esc(e.message)}</div>`; }
  };
  m.querySelector('#sgo').onclick = verify; input.addEventListener('keydown', (e) => { if (e.key === 'Enter') verify(); });
  m.querySelector('#scam').onclick = async () => {
    if (!('BarcodeDetector' in window) || !navigator.mediaDevices?.getUserMedia) return toast('Camera QR scanning is not supported in this browser. Type the token instead, or use Chrome/Edge.', 'bad');
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const v = document.createElement('video'); v.className = 'cam'; v.srcObject = stream; v.setAttribute('playsinline', ''); v.play(); m.querySelector('#camBox').replaceChildren(v);
      const det = new BarcodeDetector({ formats: ['qr_code'] });
      scanTimer = setInterval(async () => { try { const r = await det.detect(v); if (r.length) { input.value = r[0].rawValue; window.onModalClose(); m.querySelector('#camBox').innerHTML = ''; verify(); } } catch (e) {} }, 400);
    } catch (e) { toast('Could not open the camera: ' + e.message, 'bad'); }
  };
};
