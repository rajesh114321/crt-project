# QueueLess – Cloud Deployment & 2FA Configuration Guide

This guide explains how to deploy **QueueLess – Smart Digital Token System** to cloud providers (Render, Railway, Docker) and configure live **Gmail SMTP OTP** and **Twilio Phone SMS OTP**.

---

## 1. Cloud Deployment Options

### Option A: Render.com (Recommended Free Hosting)
1. Fork or push this repository to GitHub.
2. Sign in to [Render.com](https://render.com) and click **New + > Blueprint**.
3. Select your repository. Render automatically reads `render.yaml` and sets up the build and start commands.
4. Under Environment Variables, add:
   - `GMAIL_APP_PASSWORD`: Your 16-character Google App Password (see Section 2).
   - `TWILIO_ACCOUNT_SID`: (Optional for live SMS)
   - `TWILIO_AUTH_TOKEN`: (Optional for live SMS)
   - `TWILIO_PHONE_NUMBER`: (Optional for live SMS)
5. Click **Apply**. Render will run `npm run build` and launch the container on a secure HTTPS URL.

### Option B: Railway.app
1. Go to [Railway.app](https://railway.app) and create a **New Project > Deploy from GitHub Repo**.
2. Railway detects `Procfile` and Node.js environment automatically.
3. In Railway **Settings > Build Command**, enter:
   ```bash
   npm run build
   ```
4. In Railway **Settings > Start Command**, enter:
   ```bash
   npm start
   ```
5. Add environment variables from `backend/.env.example`.

### Option C: Docker Container
To run QueueLess anywhere with Docker:
```bash
# Build the production image
docker build -t queueless-app .

# Run the container
docker run -d -p 5000:5000 \
  -e NODE_ENV=production \
  -e GMAIL_USER="24r21a6620@mlrit.ac.in" \
  -e GMAIL_APP_PASSWORD="your_16_char_password" \
  -e ADMIN_PHONE="+918121301736" \
  queueless-app
```
Access the application at `http://localhost:5000`.

---

## 2. Gmail SMTP OTP Configuration (Fixing "GMAIL_APP_PASSWORD not configured")

To dispatch real verification emails from your Gmail address:

1. Go to your Google Account: [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Ensure **2-Step Verification** is turned **ON**.
3. Search for or navigate to **App passwords**: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Enter an App Name (e.g., `QueueLess Campus Security`) and click **Create**.
5. Google will display a **16-character password** (e.g., `abcd efgh ijkl mnop`).
6. Copy the password **without spaces** (`abcdefghijklmnop`).
7. In `backend/.env` (or cloud dashboard):
   ```env
   GMAIL_USER=24r21a6620@mlrit.ac.in
   GMAIL_APP_PASSWORD=abcdefghijklmnop
   ```
8. Restart the server. Verification emails will now dispatch instantly via Google's secure SMTP servers!

> **Note:** If `GMAIL_APP_PASSWORD` is left empty during local testing, QueueLess runs in **Evaluation Simulator Mode**: the single-use 6-digit code is logged to the server terminal and displayed in a developer test badge on the screen so you are never locked out.

---

## 3. Twilio SMS OTP Configuration

To dispatch real mobile SMS messages via Twilio:

1. Create a free account at [https://console.twilio.com/](https://console.twilio.com/).
2. Obtain a trial or active phone number with SMS capability.
3. Copy your **Account SID** and **Auth Token**.
4. In `backend/.env` (or cloud dashboard):
   ```env
   TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```
5. Mobile SMS OTPs will now be delivered directly to the administrator's registered mobile number (`+91 8121301736`).

---

## 4. Primary Administrator Credentials

- **Name:** Rajesh Guguloth
- **Email:** `24r21a6620@mlrit.ac.in`
- **Phone:** `+91 8121301736`
- **Default Demo Password:** `admin123` (Bcrypt hashed in database)
- **Security Policy:**
  - HMAC-SHA256 salted single-use 6-digit cryptographic OTPs.
  - 5-minute expiration window.
  - 60-second resend cooldown timer.
  - Anti-brute-force lockout after 5 incorrect attempts.

---

## 5. Health Check & API Diagnostics

- Health check endpoint: `GET /api/health`
- Admin Gateway status: `GET /api/auth/admin/config-status`
- Audit Activity logs: `GET /api/auth/admin/activity-logs`
