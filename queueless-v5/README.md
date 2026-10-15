# QueueLess – Smart Digital Token System (Frontend Only)
**Skip the Line. Save Your Time.**

Plain HTML + CSS + JavaScript. No Node, no MySQL, no install. Data is kept in the browser (`localStorage`).

## Run in VS Code
1. Install the **Live Server** extension (Ritwick Dey).
2. Open this folder in VS Code → right-click `index.html` → **Open with Live Server**.
   (Or run `python -m http.server 8000` in this folder and open http://localhost:8000)
3. Photos load from Unsplash, so you need internet for them. If one fails, a blue-purple gradient is shown instead.

## Demo accounts (development only)
| Role | Email | Password |
|---|---|---|
| Student | student@queueless.com | student123 |
| Admin | admin@queueless.com | admin123 |

You can also register a new student. Admin accounts cannot be self-registered.
Seed data (completed history, waiting students) is **sample data**, created on first load.

## How to test
1. Register or log in as a student → Generate Token (e.g. Fee Counter) → see people ahead + waiting time.
2. Open a second browser tab and log in as admin (leave **Remember me** unchecked, so each tab keeps its own login). Both tabs share the same queue data.
3. Admin → Dashboard → **Call next** on a counter → **Complete** or **Skip**.
4. Back on the student page, press **Refresh Queue Status** (it also auto-refreshes every 6 s).
5. Admin → Reports shows service-time records; Services lets you change the default service time.

## Features (all working, frontend-only)
**Student:** generate token, live position + wait time, cancel, notifications bell, **SMS Simulator** (simulated messages only – no real SMS is sent), **Token Pass with a real QR code** (scannable), **Receipt** (printable / save as PDF) and **star rating + feedback** for completed tokens, dark mode.
**Admin:** call next / complete / skip, counters and services management, token history, reports, **Analytics** (completion rate, actual wait, service time, hourly chart, ratings), **Search** (token / name / ID / status / service / dates + CSV export), **Scan Token** at the counter.
**Public:** Live Queue board (`live.html`) and Campus TV display (`kiosk.html`) – no login needed.

**Also:** queue progress bar, "How is this calculated?" calculator, About Project page (`about.html`) and one-click Demo Student / Demo Admin login buttons (development only).

### Scan Token (Admin → Scan Token)
- Type or paste a token number (e.g. `F105`) or the QR code text, then **Verify**. A USB barcode/QR scanner that "types" the code also works.
- **Use camera** scans the student's QR using the browser's built-in `BarcodeDetector` (Chrome / Edge, needs HTTPS or localhost + camera permission). I could not test the camera in my environment; the typed/pasted path is tested.
- A waiting token can be called to a counter only if it is first in its queue (fair order is kept).

## Waiting-time rule
`Estimated wait = people ahead × average service time ÷ active counters` (rounded up)
- Average service time = total service time ÷ people served, from completed tokens (start = called, end = completed).
- Until a service has 3 completed records, its **default time** is used and the UI says "estimate".
- Averages are never shown below 1 minute (so quick demo clicks still give sensible numbers).

## Files
```
index.html  login.html  register.html  student.html  admin.html
live.html  kiosk.html  pass.html  about.html
assets/img/*.svg  (illustrations)
css/styles.css
js/api.js      in-browser "API + database" (validation, roles, queue logic)
js/ui.js       icons, toasts, modals, QR helper, dark mode, image fallback
js/qrcode.js   QR generator (qrcode-generator, MIT licence, Kazuhiko Arase)
js/student.js  js/admin.js
```

## Honest limits
- Data is per browser/device. Nothing is shared between computers.
- Passwords are hashed (SHA-256) in the browser. Fine for a demo, **not real security** – anyone can edit localStorage in DevTools. Real security needs a server.
- "Forgot password" only shows a message (no email server).
- To reset: Admin → Reports → Reset demo data.
