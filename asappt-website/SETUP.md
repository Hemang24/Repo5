# ASAP PT Website — Setup Guide

## Quick Start (Development)

```bash
cd /home/user/asappt-website
npm install
npm run dev
# Open http://localhost:3000
```

Copy `.env.local.example` to `.env.local` and fill in your credentials before the intake form and chatbot will work.

---

## Environment Variables

Create `.env.local` in the project root:

```bash
cp .env.local.example .env.local
```

### Required variables:

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API key for the insurance/FAQ chatbot |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Google Service Account credentials JSON (stringified) |
| `GOOGLE_DRIVE_FOLDER_ID` | ID of the Google Drive folder for patient intakes |
| `GOOGLE_CLOUD_PROJECT_ID` | Your Google Cloud project ID |

---

## Google Cloud Setup (one-time)

### Step 1 — Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **Select a project → New Project**
3. Name it `asappt-intake` → Create

### Step 2 — Enable APIs

In your project, go to **APIs & Services → Library** and enable:

- **Cloud Vision API** (for OCR on ID/insurance cards)
- **Google Drive API** (for uploading patient intake files)

### Step 3 — Create a Service Account

1. Go to **IAM & Admin → Service Accounts**
2. Click **+ Create Service Account**
3. Name: `asappt-intake-service` → Create
4. Role: **Editor** (or create a custom role with Drive and Vision permissions)
5. Click **Done**

### Step 4 — Download the JSON Key

1. Click the service account you just created
2. Go to **Keys → Add Key → Create new key → JSON**
3. Download the `.json` file — this is your service account credentials

### Step 5 — Set the Environment Variable

Open the downloaded JSON file. Copy its entire contents and paste it as a **single line** into your `.env.local`:

```bash
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"asappt-intake","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"asappt-intake-service@asappt-intake.iam.gserviceaccount.com",...}
```

> **Tip:** On a Mac/Linux, you can do this with:
> ```bash
> cat your-key-file.json | tr -d '\n'
> ```
> Then paste the output as the value.

### Step 6 — Set Up Google Drive

1. Open [Google Drive](https://drive.google.com)
2. Create a new folder called **"Patient Intakes"**
3. Right-click the folder → **Share**
4. Add the service account email (from the JSON: `client_email` field) with **Editor** access
5. Copy the folder ID from the URL: `https://drive.google.com/drive/folders/{THIS_IS_YOUR_FOLDER_ID}`
6. Set it in `.env.local`:

```bash
GOOGLE_DRIVE_FOLDER_ID=1AbCdEfGhIjKlMnOpQrStUvWx
```

### Step 7 — Set Project ID

```bash
GOOGLE_CLOUD_PROJECT_ID=asappt-intake
```

---

## Anthropic (Claude) API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Add to `.env.local`:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```

The chatbot uses `claude-haiku-4-5-20251001` (fast and cost-effective). Usage is approximately $0.0002/message.

---

## HIPAA Compliance Notes

This setup uses Google Drive with:
- **Encrypted storage** (Google encrypts all Drive data at rest and in transit)
- **Access restricted** to the service account and your Google Workspace account
- **Audit logging** available via Google Workspace Admin

**Important:** To be fully HIPAA compliant:
1. You must have a signed **Business Associate Agreement (BAA)** with Google
2. BAAs are available on **Google Workspace Business Starter** and above
3. Sign the BAA at: Admin Console → Account → Legal → Business Associate Agreement

---

## Logo

A placeholder logo is currently used (initials in a terracotta square). To replace it:

1. Place your logo file at `public/logo.png` (or `.svg`)
2. Edit `src/components/layout/Navbar.tsx` — replace the placeholder `<div>` with:

```tsx
import Image from 'next/image'
// ...
<Image src="/logo.png" alt="ASAP PT Logo" width={40} height={40} />
```

---

## Production Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Docker / Node.js Server

```bash
npm run build
npm start
```

---

## File Structure

```
/home/user/asappt-website/
├── src/
│   ├── app/
│   │   ├── page.tsx                   # Homepage
│   │   ├── layout.tsx                 # Root layout (Navbar + Footer + ChatWidget)
│   │   ├── globals.css                # Global styles + warm color tokens
│   │   ├── services/page.tsx          # Services page
│   │   ├── our-team/page.tsx          # Staff profiles
│   │   ├── testimonials/page.tsx      # Patient testimonials (masonry)
│   │   ├── faqs/page.tsx              # FAQ accordion
│   │   ├── insurance/page.tsx         # Insurance plans + chatbot CTA
│   │   ├── location/page.tsx          # Map, hours, directions
│   │   ├── home-pt/page.tsx           # Home physical therapy
│   │   ├── patient-intake/page.tsx    # Multi-step intake form
│   │   ├── contact/page.tsx           # Contact form + info
│   │   └── api/
│   │       ├── ocr/route.ts           # Google Cloud Vision OCR
│   │       ├── chat/route.ts          # Claude chatbot
│   │       └── submit-intake/route.ts # Google Drive upload
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx             # Sticky nav + language toggle
│   │   │   └── Footer.tsx             # Contact info + links
│   │   ├── ui/
│   │   │   ├── Button.tsx             # Reusable button (warm palette)
│   │   │   └── ScrollReveal.tsx       # Intersection observer animations
│   │   ├── chat/
│   │   │   └── ChatWidget.tsx         # Floating AI chat (bottom right)
│   │   └── intake/
│   │       ├── IntakeWizard.tsx        # 4-step form wizard
│   │       ├── ImageUploadOCR.tsx      # Drag-drop upload + OCR
│   │       ├── StepDemographics.tsx
│   │       ├── StepInsurance.tsx
│   │       ├── StepMedicalHistory.tsx
│   │       ├── StepConsent.tsx
│   │       └── SuccessScreen.tsx
│   ├── lib/
│   │   ├── translations.ts            # EN/ES text (all pages)
│   │   ├── language-context.tsx       # React context for language state
│   │   ├── chat-knowledge.ts          # Claude system prompt (insurance + FAQs)
│   │   ├── google-drive.ts            # Drive API helpers
│   │   ├── google-vision.ts           # Vision API OCR + field parsing
│   │   └── google-vision-client.ts    # Client-side text parsing helpers
│   └── types/
│       └── intake.ts                  # TypeScript types for intake form
├── public/
│   └── (logo.png goes here)
├── .env.local.example
├── SETUP.md                           # This file
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```
