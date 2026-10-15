const $ = (id) => document.getElementById(id);
let user = null, services = [], active = null;
const TITLES = { dash: 'Welcome', gen: 'Generate Token', tokens: 'My Tokens', queue: 'Queue Status', profile: 'Profile' };
$('date').textContent = new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

function show(v) {
  document.querySelectorAll('.view').forEach((x) => x.classList.toggle('on', x.id === 'v-' + v));
  document.querySelectorAll('.side .item[data-view]').forEach((b) => b.classList.toggle('on', b.dataset.view === v));
  $('title').textContent = v === 'dash' && user ? 'Welcome, ' + user.name.split(' ')[0] + ' 👋' : TITLES[v];
  $('side').classList.remove('open'); $('scrim').classList.remove('show');
  if (v === 'queue') loadQueue(); if (v === 'tokens') loadTokens();
}
document.querySelectorAll('.side .item[data-view]').forEach((b) => b.onclick = () => show(b.dataset.view));
$('menu').onclick = () => { $('side').classList.add('open'); $('scrim').classList.add('show'); };
$('scrim').onclick = () => { $('side').classList.remove('open'); $('scrim').classList.remove('show'); };
$('logout').onclick = () => { API.logout(); location.href = 'index.html'; };
$('refresh').onclick = async (e) => { setLoading(e.currentTarget, true, 'Refreshing…'); await loadAll(); setLoading(e.currentTarget, false); toast('Queue status updated', 'ok'); };

function svcCard(s) {
  const busy = !!active;
  return `<article class="card svc hover"><div class="ph"><img src="assets/img/${({ svc_office: 'svc-office', svc_fee: 'svc-fee', svc_library: 'svc-library', svc_canteen: 'svc-canteen' })[s.id] || 'svc-office'}.svg" alt="${esc(s.name)} illustration" loading="lazy" width="400" height="200"></div>
    <div class="b"><h3 style="display:flex;gap:8px;align-items:center">${icon(s.icon, 18)} ${esc(s.name)}</h3><p>${esc(s.desc)}</p>
    <div class="meta"><span><b>${s.waiting}</b> waiting</span><span>~<b>${s.estimatedMinutes}</b> min</span><span>${s.activeCounters} counter${s.activeCounters > 1 ? 's' : ''}</span></div>
    <button class="btn btn-primary btn-sm" data-get="${s.id}" ${busy ? 'disabled title="You already have an active token"' : ''}>${icon('ticket', 16)} ${busy ? 'Token active' : 'Get Token'}</button></div></article>`;
}
function activeCard(t) {
  if (!t) return `<div class="card empty">${icon('ticket', 36)}<h3>No active token</h3><p>Pick a service below to generate your digital token.</p></div>`;
  return `<div class="card active-card"><div class="ac-top"><div><small style="opacity:.8">ACTIVE TOKEN · ${esc(t.serviceName)}</small><div class="ac-num">${esc(t.number)}</div></div>${badge(t.status)}</div>
    <div class="ac-grid"><div><small>Counter</small><strong>${esc(t.counterName)}</strong></div><div><small>People ahead</small><strong>${t.peopleAhead}</strong></div>
    <div><small>Est. waiting time</small><strong>${t.status === 'CALLING' ? 'Your turn!' : t.estimatedMinutes + ' min'}</strong></div><div><small>Status</small><strong>${t.status === 'CALLING' ? 'Go to counter' : 'Waiting'}</strong></div></div>
    <div class="prog"><div class="prog-top"><span>Queue proximity</span><b>${t.status === 'CALLING' ? 'Now serving!' : t.peopleAhead + ' ahead'}</b></div><div class="prog-bar"><i style="width:${t.progress}%"></i></div><div class="prog-lbl"><span>Joined</span><span>Turn approaching</span><span>Counter</span></div></div>
    <p class="estnote">${t.peopleAhead} ahead × ${t.avgMinutes} min avg ÷ ${t.activeCounters} active counter${t.activeCounters > 1 ? 's' : ''}${t.avgIsEstimate ? ' · <b>estimate</b> (default time, not enough service records yet)' : ' · based on completed service records'} · <a href="#" data-explain="1" style="text-decoration:underline">How is this calculated?</a></p>
    <div class="ac-foot"><span>Last updated ${fmtTime(new Date().toISOString())}</span><span><a class="btn btn-ghost btn-sm" href="pass.html">View Token Pass</a> <button class="btn btn-ghost btn-sm" data-cancel="${t.id}">Cancel token</button></span></div></div>`;
}
function stats(t) {
  const items = t ? [['users', 'People ahead', t.peopleAhead, ''], ['clock', 'Estimated wait', t.status === 'CALLING' ? 'Now' : t.estimatedMinutes + ' min', 'o'], ['activity', 'Queue status', t.status === 'CALLING' ? 'Your turn' : 'Waiting', 'c']]
    : [['users', 'People ahead', '—', ''], ['clock', 'Estimated wait', '—', 'o'], ['activity', 'Queue status', 'No token', 'c']];
  return items.map((i) => `<div class="card sc"><div class="fi ${i[3]}">${icon(i[0], 22)}</div><div><small>${i[1]}</small><strong>${i[2]}</strong></div></div>`).join('');
}
async function loadAll() {
  [services, active] = await Promise.all([API.getServices(), API.myActive()]);
  loadNotes();
  $('dstats').innerHTML = stats(active); $('activeBox').innerHTML = activeCard(active);
  $('svcA').innerHTML = services.map(svcCard).join(''); $('svcB').innerHTML = services.map(svcCard).join('');
  if ($('v-queue').classList.contains('on')) loadQueue(); if ($('v-tokens').classList.contains('on')) loadTokens();
}
async function loadTokens() {
  const t = await API.myTokens();
  $('tbody').innerHTML = t.length ? t.map((x) => `<tr><td><b>${esc(x.number)}</b></td><td>${esc(x.serviceName)}</td><td>${fmtDate(x.createdAt)} ${fmtTime(x.createdAt)}</td><td>${badge(x.status)}</td><td><div class="acts">${x.status === 'WAITING' || x.status === 'CALLING' ? `<button class="btn btn-light btn-sm" data-cancel="${x.id}">Cancel</button>` : ''}${x.status === 'COMPLETED' ? `<button class="btn btn-light btn-sm" data-receipt="${x.id}">Receipt</button><button class="btn btn-light btn-sm" data-rate="${x.id}">${x.rating ? '<span class="star-txt">' + starsHtml(x.rating) + '</span>' : 'Rate'}</button>` : ''}</div></td></tr>`).join('')
    : `<tr><td colspan="5"><div class="empty">${icon('list', 32)}<h3>No tokens yet</h3><p>Your previous and current tokens will appear here.</p></div></td></tr>`;
}
async function loadQueue() {
  const [board, a] = await Promise.all([API.queueBoard(), API.myActive()]);
  $('myQ').innerHTML = a ? `<div class="card"><h3>Your position in ${esc(a.serviceName)}</h3><div class="chips" style="margin-top:12px">${board.find((b) => b.service.id === a.serviceId).waiting.map((n) => `<span class="chip ${n === a.number ? 'me' : ''}">${n}${n === a.number ? ' (you)' : ''}</span>`).join('') || '<span class="chip now">You are being served</span>'}</div><p class="estnote" style="color:var(--muted)">${a.peopleAhead} ahead · about ${a.estimatedMinutes} min</p></div>` : '';
  $('board').innerHTML = board.map((b) => `<div class="card"><h3 style="margin-bottom:10px">${icon(b.service.icon, 18)} ${esc(b.service.name)}</h3>
    ${b.counters.length ? b.counters.map((c) => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-top:1px solid var(--line)"><span>${esc(c.name)} ${c.status !== 'Active' ? '<span class="badge mute">Closed</span>' : ''}</span><b>${c.serving || '—'}</b></div>`).join('') : '<p>No counters set up.</p>'}
    <p style="margin-top:8px;font-size:.84rem">Waiting: <b>${b.waiting.length}</b></p></div>`).join('');
}
document.addEventListener('click', async (e) => {
  const g = e.target.closest('[data-get]'), c = e.target.closest('[data-cancel]');
  if (g) { setLoading(g, true, 'Generating…'); try { const t = await API.generateToken(g.dataset.get); toast('Token ' + t.number + ' generated!', 'ok'); await loadAll(); show('dash'); } catch (err) { toast(err.message, 'bad'); setLoading(g, false); } }
  if (c && confirm('Cancel this token?')) { try { await API.cancelToken(c.dataset.cancel); toast('Token cancelled', 'ok'); await loadAll(); } catch (err) { toast(err.message, 'bad'); } }
});
$('pf').addEventListener('submit', async (e) => {
  e.preventDefault(); setLoading($('psave'), true, 'Saving…');
  try { user = await API.updateProfile({ name: $('pname').value, phone: $('pphone').value }); $('sname').textContent = user.name; toast('Profile updated', 'ok'); } catch (err) { toast(err.message, 'bad'); }
  setLoading($('psave'), false);
});
(async () => {
  try { user = await API.me(); } catch (e) { location.href = 'login.html'; return; }
  if (user.role !== 'student') { location.href = 'admin.html'; return; }
  $('sname').textContent = user.name; $('sid').textContent = user.studentId; $('pname').value = user.name; $('psid').value = user.studentId; $('pemail').value = user.email; $('pphone').value = user.phone;
  show('dash'); await loadAll();
  setInterval(loadAll, 6000); window.addEventListener('storage', loadAll);
})();

// ---- notifications ----
let seen = null;
async function loadNotes() {
  const list = await API.myNotes(), unread = list.filter((n) => !n.read);
  $('bellN').textContent = unread.length; $('bellN').style.display = unread.length ? 'grid' : 'none';
  $('noteList').innerHTML = list.length ? list.map((n) => `<div class="note ${n.read ? '' : 'new'}"><b>${n.type === 'turn' ? '🔔 ' : ''}${esc(n.text)}</b><small>${fmtTime(n.at)}</small></div>`).join('') : '<div class="empty" style="padding:18px">No notifications yet.</div>';
  if (seen === null) seen = new Set(list.map((n) => n.id));
  else unread.filter((n) => !seen.has(n.id)).reverse().forEach((n) => { seen.add(n.id); toast(n.text, n.type === 'turn' ? 'ok' : 'info'); });
}
$('bell').onclick = async (e) => { e.stopPropagation(); const p = $('notes'); p.classList.toggle('show'); if (p.classList.contains('show')) { await API.markNotesRead(); setTimeout(loadNotes, 1500); } };
document.addEventListener('click', (e) => { if (!e.target.closest('#notes')) $('notes').classList.remove('show'); });

// ---- receipt, feedback, SMS simulator ----
let myTok = [];
async function tokensNow() { myTok = await API.myTokens(); return myTok; }
document.addEventListener('click', async (e) => {
  const r = e.target.closest('[data-receipt]'), q = e.target.closest('[data-rate]');
  if (r) { const t = (await tokensNow()).find((x) => x.id === r.dataset.receipt); if (!t) return;
    openModal(`<h3>Service Receipt</h3><p class="sub">QueueLess · digital service record</p><div class="rc">
      <div><span>Token</span><b>${esc(t.number)}</b></div><div><span>Service</span><b>${esc(t.serviceName)}</b></div><div><span>Student</span><b>${esc(user.name)} (${esc(user.studentId)})</b></div><hr>
      <div><span>Issued</span><b>${fmtDate(t.createdAt)} ${fmtTime(t.createdAt)}</b></div><div><span>Called</span><b>${fmtTime(t.startedAt)}</b></div><div><span>Completed</span><b>${fmtTime(t.completedAt)}</b></div>
      <div><span>Counter</span><b>${esc(t.counterName)}</b></div><div><span>Service time</span><b>${fmtDur(t.startedAt, t.completedAt)}</b></div><hr><div><span>Status</span><b>${badge(t.status)}</b></div></div>
      <p style="margin-top:14px"><button class="btn btn-primary btn-sm noprint" onclick="printModal()">${icon('printer', 16)} Print / Save PDF</button></p>`); }
  if (q) { const t = (await tokensNow()).find((x) => x.id === q.dataset.rate); if (!t) return; let val = t.rating || 0;
    const m = openModal(`<h3>Rate your service</h3><p class="sub">${esc(t.number)} · ${esc(t.serviceName)}</p><div class="stars" id="st">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-v="${n}" aria-label="${n} star">★</button>`).join('')}</div>
      <textarea class="plain" id="fb" placeholder="Tell us how it went (optional)" maxlength="300">${esc(t.feedback || '')}</textarea><p style="margin-top:12px"><button class="btn btn-primary" id="fbgo">Submit feedback</button></p>`);
    const paint = () => m.querySelectorAll('#st button').forEach((b) => b.classList.toggle('on', +b.dataset.v <= val)); paint();
    m.querySelectorAll('#st button').forEach((b) => b.onclick = () => { val = +b.dataset.v; paint(); });
    m.querySelector('#fbgo').onclick = async (ev) => { setLoading(ev.currentTarget, true, 'Saving…'); try { await API.rateToken(t.id, val, m.querySelector('#fb').value); toast('Thanks for your feedback!', 'ok'); closeModal(); loadTokens(); } catch (err) { toast(err.message, 'bad'); setLoading(ev.currentTarget, false); } }; }
});
$('smsBtn').onclick = async () => {
  const list = (await API.myNotes()).slice().reverse();
  openModal(`<h3>SMS Simulator</h3><div class="sim">Simulated only – no real SMS is sent.</div><div class="phone"><div class="top">To: ${esc(user.phone || 'your phone')}</div><div class="body">${list.length ? list.map((n) => `<div class="bubble ${n.type === 'turn' ? 'turn' : ''}">${esc(n.text.startsWith('QueueLess:') ? n.text : 'QueueLess: ' + n.text)}<small>${fmtDate(n.at)} ${fmtTime(n.at)}</small></div>`).join('') : '<div class="empty" style="padding:30px 6px">No messages yet. Generate a token to see one.</div>'}</div></div>`);
};

document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-explain]')) return; e.preventDefault();
  const t = active; if (!t) return;
  const m = openModal(`<h3>How is my waiting time calculated?</h3><p class="sub">Try the numbers yourself. Yours are pre-filled.</p>${waitCalcHtml({ ahead: t.peopleAhead, avg: t.avgMinutes, counters: t.activeCounters })}`, { cls: 'wide' });
  waitCalcInit(m);
});
