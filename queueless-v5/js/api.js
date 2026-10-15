/* QueueLess – frontend-only data layer.
   Plays the role of the REST API + database, using localStorage.
   Every method is async and validates input / role, like a server would. */
(function () {
  const KEY = 'queueless_fe_v2', SESSION = 'queueless_session';
  const MIN_RECORDS = 3;        // completed records needed before the real average is used
  const MIN_AVG_MINUTES = 1;    // floor, so demo clicks done in seconds still give sensible estimates
  const now = () => new Date().toISOString();
  const uid = (p) => p + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const fail = (m) => { throw new Error(m); };
  const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

  async function hash(pw) {
    try {
      const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('queueless:' + pw));
      return 'sha256$' + [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
    } catch (e) { return 'plain$' + btoa(pw); }
  }

  let db = null;
  const save = () => localStorage.setItem(KEY, JSON.stringify(db));
  const sync = () => { try { const r = localStorage.getItem(KEY); if (r) db = JSON.parse(r); } catch (e) {} };

  async function seed() {
    const t = (min) => new Date(Date.now() - min * 60000).toISOString();
    const services = [
      { id: 'svc_office', code: 'O', name: 'College Office', desc: 'Document services and certificates', defaultAvg: 4, img: 'photo-1562774053-701939374585', icon: 'building', active: true },
      { id: 'svc_fee', code: 'F', name: 'Fee Counter', desc: 'Fee payments and receipts', defaultAvg: 3, img: 'photo-1554224155-6726b3ff858f', icon: 'wallet', active: true },
      { id: 'svc_library', code: 'L', name: 'Library', desc: 'Book issue, return and renewals', defaultAvg: 2, img: 'photo-1481627834876-b7833e8f5570', icon: 'book', active: true },
      { id: 'svc_canteen', code: 'C', name: 'Canteen', desc: 'Food ordering and collection', defaultAvg: 3, img: 'photo-1567521464027-f127ff144326', icon: 'coffee', active: true }
    ];
    const counters = [
      { id: 'ctr_1', name: 'Counter 1', serviceId: 'svc_office', status: 'Active' },
      { id: 'ctr_2', name: 'Counter 2', serviceId: 'svc_fee', status: 'Active' },
      { id: 'ctr_3', name: 'Counter 3', serviceId: 'svc_fee', status: 'Active' },
      { id: 'ctr_4', name: 'Counter 4', serviceId: 'svc_library', status: 'Active' },
      { id: 'ctr_5', name: 'Counter 5', serviceId: 'svc_canteen', status: 'Active' }
    ];
    const users = [
      { id: 'usr_admin', name: 'Dr. Arvind Sharma', studentId: 'ADMIN-01', email: 'admin@queueless.com', phone: '9876543210', role: 'admin', pw: await hash('admin123'), demo: true },
      { id: 'usr_student', name: 'Rajesh Kumar', studentId: '2024CS108', email: 'student@queueless.com', phone: '9123456789', role: 'student', pw: await hash('student123'), demo: true }
    ];
    const names = ['Ananya Iyer', 'Rohit Verma', 'Sneha Reddy', 'Karthik Rao', 'Priya Nair', 'Arjun Das'];
    const sample = names.map((n, i) => ({ id: 'usr_demo' + i, name: n, studentId: '2024X' + (200 + i), email: 'demo' + i + '@queueless.com', phone: '', role: 'student', pw: 'none', demo: true }));
    users.push(...sample);
    const tokens = [];
    const seq = { svc_office: 100, svc_fee: 100, svc_library: 100, svc_canteen: 100 };
    const add = (svc, u, status, minsAgo, dur) => {
      seq[svc]++;
      const s = services.find((x) => x.id === svc);
      const tk = { id: uid('tok'), number: s.code + seq[svc], userId: u.id, studentName: u.name, serviceId: svc, counterId: null, status, createdAt: t(minsAgo), updatedAt: t(minsAgo), startedAt: null, completedAt: null, sample: true };
      if (dur) {
        tk.startedAt = t(minsAgo - 1);
        tk.completedAt = new Date(new Date(tk.startedAt).getTime() + dur * 60000).toISOString();
        tk.counterId = counters.find((c) => c.serviceId === svc).id;
      }
      tokens.push(tk);
    };
    // sample completed history (office, fee, library; canteen has none -> default estimate shown)
    [3, 4, 5, 3].forEach((d, i) => add('svc_fee', sample[i % 6], 'COMPLETED', 120 - i * 10, d));
    [4, 5, 4].forEach((d, i) => add('svc_office', sample[i], 'COMPLETED', 100 - i * 10, d));
    [2, 2, 3].forEach((d, i) => add('svc_library', sample[i + 1], 'COMPLETED', 90 - i * 10, d));
    // sample waiting people so queues are not empty
    add('svc_fee', sample[0], 'WAITING', 14); add('svc_fee', sample[1], 'WAITING', 12);
    add('svc_fee', sample[2], 'WAITING', 9); add('svc_fee', sample[3], 'WAITING', 6);
    add('svc_office', sample[4], 'WAITING', 8); add('svc_office', sample[5], 'WAITING', 4);
    db = { users, services, counters, tokens, seq };
    save();
  }

  const ready = (async () => { sync(); if (!db) await seed(); })();
  const R = async (fn, ms) => { await ready; sync(); if (db && !db.notes) db.notes = []; await delay(ms); return fn(); };
  const note = (userId, text, type) => { db.notes = db.notes || []; db.notes.push({ id: uid('n'), userId, text, type, at: now(), read: false }); db.notes = db.notes.slice(-200); };

  const safe = (u) => { if (!u) return null; const { pw, ...r } = u; return r; };
  const me = () => {
    const id = localStorage.getItem(SESSION) || sessionStorage.getItem(SESSION);
    const u = id && db.users.find((x) => x.id === id);
    if (!u) fail('Please log in to continue.');
    return u;
  };
  const admin = () => { const u = me(); if (u.role !== 'admin') fail('Access denied: administrators only.'); return u; };
  const svcOf = (id) => db.services.find((s) => s.id === id);
  const todayStr = () => new Date().toDateString();

  // ---- waiting-time logic ----
  function serviceRecords(serviceId) {
    return db.tokens.filter((t) => t.status === 'COMPLETED' && t.startedAt && t.completedAt && (!serviceId || t.serviceId === serviceId))
      .map((t) => ({ tokenNumber: t.number, serviceId: t.serviceId, counterId: t.counterId, startedAt: t.startedAt, completedAt: t.completedAt, seconds: Math.round((new Date(t.completedAt) - new Date(t.startedAt)) / 1000) }));
  }
  function avgFor(serviceId) {
    const s = svcOf(serviceId), recs = serviceRecords(serviceId);
    if (recs.length < MIN_RECORDS) return { minutes: s ? s.defaultAvg : 3, estimated: true, records: recs.length };
    const total = recs.reduce((a, r) => a + r.seconds, 0);                       // total service time
    const m = Math.max(MIN_AVG_MINUTES, Math.round((total / recs.length / 60) * 10) / 10); // ÷ people served
    return { minutes: m, estimated: false, records: recs.length };
  }
  const activeCounters = (sid) => Math.max(1, db.counters.filter((c) => c.serviceId === sid && c.status === 'Active').length);
  const waitingList = (sid) => db.tokens.filter((t) => t.serviceId === sid && t.status === 'WAITING').sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  function queueInfo(t) {
    const avg = avgFor(t.serviceId), n = activeCounters(t.serviceId);
    const ahead = t.status === 'WAITING' ? Math.max(0, waitingList(t.serviceId).findIndex((x) => x.id === t.id)) : 0;
    const est = t.status === 'WAITING' ? Math.ceil((ahead * avg.minutes) / n) : 0;  // people ahead × avg, shared across active counters
    const ctr = db.counters.find((c) => c.id === t.counterId);
    const base = Math.max(t.aheadAtJoin ?? Math.max(ahead + 2, 8), ahead, 1);
    const progress = t.status === 'WAITING' ? Math.min(92, Math.max(8, Math.round(((base - ahead) / base) * 100))) : 100;
    return { ...t, progress, serviceName: svcOf(t.serviceId).name, counterName: ctr ? ctr.name : 'Not assigned yet', peopleAhead: ahead, avgMinutes: avg.minutes, avgIsEstimate: avg.estimated, activeCounters: n, estimatedMinutes: est };
  }
  const isActive = (t) => t.status === 'WAITING' || t.status === 'CALLING';

  window.API = {
    ready,
    async register(d) {
      return R(async () => {
        const name = (d.name || '').trim(), email = (d.email || '').trim().toLowerCase(), sid = (d.studentId || '').trim(), phone = (d.phone || '').trim();
        if (name.length < 2) fail('Please enter your full name.');
        if (!sid) fail('Student ID / roll number is required.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('Enter a valid email address.');
        if (!/^[0-9+\-\s]{10,15}$/.test(phone)) fail('Enter a valid phone number (10–15 digits).');
        if (!d.password || d.password.length < 6) fail('Password must be at least 6 characters.');
        if (d.password !== d.confirm) fail('Passwords do not match.');
        if (db.users.some((u) => u.email.toLowerCase() === email)) fail('An account with this email already exists.');
        if (db.users.some((u) => (u.studentId || '').toLowerCase() === sid.toLowerCase())) fail('This student ID is already registered.');
        const u = { id: uid('usr'), name, studentId: sid, email, phone, role: 'student', pw: await hash(d.password) };
        db.users.push(u); save();
        return safe(u);
      });
    },
    async login(email, password, remember) {
      return R(async () => {
        const u = db.users.find((x) => x.email.toLowerCase() === (email || '').trim().toLowerCase());
        if (!u || u.pw === 'none' || u.pw !== (await hash(password || ''))) fail('Invalid email or password.');
        localStorage.removeItem(SESSION); sessionStorage.removeItem(SESSION);
        (remember ? localStorage : sessionStorage).setItem(SESSION, u.id);
        return safe(u);
      }, 350);
    },
    logout() { localStorage.removeItem(SESSION); sessionStorage.removeItem(SESSION); },
    async me() { return R(() => safe(me()), 0); },
    async updateProfile(d) {
      return R(() => {
        const u = me(); const name = (d.name || '').trim();
        if (name.length < 2) fail('Please enter your name.');
        if (!/^[0-9+\-\s]{10,15}$/.test((d.phone || '').trim())) fail('Enter a valid phone number.');
        u.name = name; u.phone = d.phone.trim(); save(); return safe(u);
      });
    },
    // ---- services & counters ----
    async getServices() {
      return R(() => {
        me();
        return db.services.filter((s) => s.active).map((s) => {
          const a = avgFor(s.id), w = waitingList(s.id).length, n = activeCounters(s.id);
          return { ...s, waiting: w, avgMinutes: a.minutes, avgIsEstimate: a.estimated, activeCounters: n, estimatedMinutes: Math.ceil((w * a.minutes) / n) };
        });
      }, 200);
    },
    async getAllServices() { return R(() => { admin(); return db.services.map((s) => ({ ...s, avg: avgFor(s.id) })); }, 100); },
    async getCounters() {
      return R(() => {
        me();
        return db.counters.map((c) => {
          const cur = db.tokens.find((t) => t.counterId === c.id && t.status === 'CALLING');
          return { ...c, serviceName: svcOf(c.serviceId)?.name || '—', serving: cur ? cur.number : null, servingId: cur ? cur.id : null };
        });
      }, 100);
    },
    // ---- tokens ----
    async generateToken(serviceId) {
      return R(() => {
        const u = me(); const s = svcOf(serviceId);
        if (!s || !s.active) fail('This service is not available.');
        if (u.role !== 'student') fail('Only students can generate tokens.');
        const ex = db.tokens.find((t) => t.userId === u.id && isActive(t));
        if (ex) fail('You already have an active token (' + ex.number + '). Complete or cancel it first.');
        db.seq[serviceId] = (db.seq[serviceId] || 100) + 1;       // sequence is never reused -> no duplicate numbers
        const t = { id: uid('tok'), number: s.code + db.seq[serviceId], userId: u.id, studentName: u.name, serviceId, counterId: null, aheadAtJoin: waitingList(serviceId).length, status: 'WAITING', createdAt: now(), updatedAt: now(), startedAt: null, completedAt: null };
        db.tokens.push(t);
        note(u.id, 'QueueLess: Token ' + t.number + ' for ' + s.name + ' generated. ' + waitingList(serviceId).length + ' in queue.', 'created');
        save(); return queueInfo(t);
      }, 300);
    },
    async myTokens() { return R(() => { const u = me(); return db.tokens.filter((t) => t.userId === u.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(queueInfo); }, 100); },
    async myActive() { return R(() => { const u = me(); const t = db.tokens.find((x) => x.userId === u.id && isActive(x)); return t ? queueInfo(t) : null; }, 100); },
    async cancelToken(id) {
      return R(() => {
        const u = me(); const t = db.tokens.find((x) => x.id === id);
        if (!t || t.userId !== u.id) fail('Token not found.');
        if (!isActive(t)) fail('This token is already closed.');
        t.status = 'CANCELLED'; t.updatedAt = now(); save(); return queueInfo(t);
      });
    },
    async queueBoard() {
      return R(() => {
        me();
        return db.services.filter((s) => s.active).map((s) => ({
          service: s, waiting: waitingList(s.id).map((t) => t.number),
          counters: db.counters.filter((c) => c.serviceId === s.id).map((c) => { const cur = db.tokens.find((t) => t.counterId === c.id && t.status === 'CALLING'); return { ...c, serving: cur ? cur.number : null }; })
        }));
      }, 100);
    },
    // ---- admin ----
    async adminTokens() { return R(() => { admin(); return db.tokens.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((t) => ({ ...queueInfo(t), studentId: (db.users.find((u) => u.id === t.userId) || {}).studentId || '' })); }, 100); },
    async adminStats() {
      return R(() => {
        admin();
        const today = db.tokens.filter((t) => new Date(t.createdAt).toDateString() === todayStr());
        const recs = serviceRecords();
        const avg = recs.length ? Math.round((recs.reduce((a, r) => a + r.seconds, 0) / recs.length / 60) * 10) / 10 : null;
        const by = (st) => db.tokens.filter((t) => t.status === st).length;
        return { total: today.length, waiting: by('WAITING'), calling: by('CALLING'), completed: by('COMPLETED'), skipped: by('SKIPPED'), cancelled: by('CANCELLED'), avgMinutes: avg, records: recs.length,
          perService: db.services.map((s) => ({ name: s.name, count: db.tokens.filter((t) => t.serviceId === s.id).length })) };
      }, 100);
    },
    async callNext(counterId) {
      return R(() => {
        admin(); const c = db.counters.find((x) => x.id === counterId);
        if (!c) fail('Counter not found.');
        if (c.status !== 'Active') fail(c.name + ' is not active.');
        if (db.tokens.some((t) => t.counterId === c.id && t.status === 'CALLING')) fail(c.name + ' is already serving a token. Complete or skip it first.');
        const next = waitingList(c.serviceId)[0];
        if (!next) fail('No waiting tokens for ' + svcOf(c.serviceId).name + '.');
        next.status = 'CALLING'; next.counterId = c.id; next.startedAt = now(); next.updatedAt = now();
        note(next.userId, 'Your turn! Token ' + next.number + ' is called at ' + c.name + '.', 'turn');
        const upNext = waitingList(c.serviceId)[0]; if (upNext) note(upNext.userId, 'You are next in line for ' + svcOf(c.serviceId).name + ' (token ' + upNext.number + ').', 'next');
        save(); return queueInfo(next);
      }, 200);
    },
    async completeToken(id) {
      return R(() => {
        admin(); const t = db.tokens.find((x) => x.id === id);
        if (!t) fail('Token not found.');
        if (t.status !== 'CALLING') fail('Only a token being served can be completed.');
        t.status = 'COMPLETED'; t.completedAt = now(); t.updatedAt = now(); note(t.userId, 'Token ' + t.number + ' completed. Thank you!', 'done'); save(); return queueInfo(t);
      }, 150);
    },
    async skipToken(id) {
      return R(() => {
        admin(); const t = db.tokens.find((x) => x.id === id);
        if (!t) fail('Token not found.');
        if (!isActive(t)) fail('This token is already closed.');
        t.status = 'SKIPPED'; t.updatedAt = now(); note(t.userId, 'Token ' + t.number + ' was skipped by staff. Please generate a new token if needed.', 'skip'); save(); return queueInfo(t);
      }, 150);
    },
    async saveCounter(d) {
      return R(() => {
        admin();
        if (d.id) {
          const c = db.counters.find((x) => x.id === d.id); if (!c) fail('Counter not found.');
          if (d.status) {
            if (d.status !== 'Active' && db.tokens.some((t) => t.counterId === c.id && t.status === 'CALLING')) fail('Finish the token being served first.');
            c.status = d.status;
          }
        } else {
          if (!svcOf(d.serviceId)) fail('Choose a service.');
          if (!(d.name || '').trim()) fail('Enter a counter name.');
          db.counters.push({ id: uid('ctr'), name: d.name.trim(), serviceId: d.serviceId, status: 'Active' });
        }
        save();
      });
    },
    async deleteCounter(id) {
      return R(() => {
        admin();
        if (db.tokens.some((t) => t.counterId === id && t.status === 'CALLING')) fail('Finish the token being served first.');
        db.counters = db.counters.filter((c) => c.id !== id); save();
      });
    },
    async saveService(d) {
      return R(() => {
        admin();
        const avg = Number(d.defaultAvg);
        if (!(avg > 0 && avg <= 60)) fail('Default service time must be between 1 and 60 minutes.');
        if (d.id) {
          const s = svcOf(d.id); if (!s) fail('Service not found.');
          if (d.name) s.name = d.name.trim();
          if (d.desc !== undefined) s.desc = d.desc.trim();
          s.defaultAvg = avg;
          if (d.active !== undefined) s.active = d.active;
        } else {
          const name = (d.name || '').trim(); if (!name) fail('Enter a service name.');
          const id = uid('svc');
          db.services.push({ id, code: name[0].toUpperCase(), name, desc: (d.desc || '').trim(), defaultAvg: avg, img: '', icon: 'list', active: true });
          db.seq[id] = 100;
        }
        save();
      });
    },
    async serviceRecords() {
      return R(() => {
        admin();
        return serviceRecords().map((r) => ({ ...r, serviceName: svcOf(r.serviceId)?.name, counterName: db.counters.find((c) => c.id === r.counterId)?.name || '—' })).reverse();
      }, 100);
    },
    // ---- feedback ----
    async rateToken(id, rating, comment) {
      return R(() => {
        const u = me(); const t = db.tokens.find((x) => x.id === id);
        if (!t || t.userId !== u.id) fail('Token not found.');
        if (t.status !== 'COMPLETED') fail('You can rate a service only after it is completed.');
        rating = Number(rating); if (!(rating >= 1 && rating <= 5)) fail('Please choose 1 to 5 stars.');
        t.rating = rating; t.feedback = (comment || '').trim().slice(0, 300); t.ratedAt = now(); save(); return queueInfo(t);
      });
    },
    // ---- counter scan / verify (admin) ----
    async verifyToken(code) {
      return R(() => {
        admin(); code = (code || '').trim(); if (!code) fail('Enter or scan a token code.');
        const parts = code.split('|'); let t = null;
        if (parts[0] === 'QL' && parts[3]) t = db.tokens.find((x) => x.id === parts[3]);
        if (!t) t = db.tokens.find((x) => x.id === code);
        if (!t) t = db.tokens.filter((x) => x.number.toLowerCase() === (parts[1] || code).toLowerCase()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        if (!t) fail('No token found for "' + code + '".');
        const u = db.users.find((x) => x.id === t.userId) || {};
        const info = queueInfo(t);
        return { ...info, studentId: u.studentId || '', firstInQueue: t.status === 'WAITING' && waitingList(t.serviceId)[0]?.id === t.id };
      }, 100);
    },
    // ---- analytics (admin) ----
    async analytics() {
      return R(() => {
        admin(); const T = db.tokens, done = T.filter((t) => t.status === 'COMPLETED');
        const byHour = Array(24).fill(0); T.forEach((t) => byHour[new Date(t.createdAt).getHours()]++);
        const waits = T.filter((t) => t.startedAt).map((t) => (new Date(t.startedAt) - new Date(t.createdAt)) / 60000).filter((m) => m >= 0);
        const closed = T.filter((t) => ['COMPLETED', 'SKIPPED', 'CANCELLED'].includes(t.status)).length;
        const rated = T.filter((t) => t.rating), dist = [1, 2, 3, 4, 5].map((n) => rated.filter((t) => t.rating === n).length);
        const recs = serviceRecords();
        return {
          total: T.length, completionRate: closed ? Math.round((done.length / closed) * 100) : null,
          avgWait: waits.length ? Math.round((waits.reduce((a, b) => a + b, 0) / waits.length) * 10) / 10 : null,
          avgService: recs.length ? Math.round((recs.reduce((a, r) => a + r.seconds, 0) / recs.length / 60) * 10) / 10 : null,
          rating: rated.length ? Math.round((rated.reduce((a, t) => a + t.rating, 0) / rated.length) * 10) / 10 : null, ratingCount: rated.length, dist, byHour,
          status: ['WAITING', 'CALLING', 'COMPLETED', 'SKIPPED', 'CANCELLED'].map((st) => [st, T.filter((t) => t.status === st).length]),
          perService: db.services.map((sv) => { const a = avgFor(sv.id); return { name: sv.name, tokens: T.filter((t) => t.serviceId === sv.id).length, records: a.records, avg: a.minutes, estimated: a.estimated }; }),
          feedback: rated.filter((t) => t.feedback).slice(-5).reverse().map((t) => ({ number: t.number, rating: t.rating, text: t.feedback, name: t.studentName }))
        };
      }, 100);
    },
    // ---- notifications ----
    async myNotes() { return R(() => { const u = me(); return db.notes.filter((n) => n.userId === u.id).sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 20); }, 0); },
    async markNotesRead() { return R(() => { const u = me(); db.notes.forEach((n) => { if (n.userId === u.id) n.read = true; }); save(); }, 0); },
    // ---- public live board (no login needed; no personal data) ----
    async publicQueue() {
      return R(() => db.services.filter((s) => s.active).map((s) => {
        const a = avgFor(s.id), n = activeCounters(s.id), w = waitingList(s.id).map((t) => t.number);
        return { id: s.id, name: s.name, code: s.code, icon: s.icon, waiting: w, avgMinutes: a.minutes, avgIsEstimate: a.estimated, estimatedMinutes: Math.ceil((w.length * a.minutes) / n),
          counters: db.counters.filter((c) => c.serviceId === s.id).map((c) => { const cur = db.tokens.find((t) => t.counterId === c.id && t.status === 'CALLING'); return { id: c.id, name: c.name, status: c.status, serving: cur ? cur.number : null }; }) };
      }), 0);
    },
    resetDemo() { localStorage.removeItem(KEY); location.reload(); }
  };
})();
