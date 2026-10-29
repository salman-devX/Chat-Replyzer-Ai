# Chat Replyzer AI — Multi-Platform AI Messaging Assistant

> **One AI. Every Conversation.**

Chat Replyzer AI is a production-oriented SaaS platform that enables individuals, creators, and businesses to deploy intelligent, personality-aligned AI assistants across **WhatsApp Business Platform**, **Instagram Direct**, **Facebook Messenger**, and **TikTok Business**.

Equipped with colloquial **Roman Urdu**, Urdu script, and English contextual nuance, smart quiet hours, instant human takeover, and a **guaranteed daily allowance of 150 free AI replies** for every registered user.

---

## 1. Key Features

- **Multi-Platform Harmonization:** Official Meta Graph API v21.0, WhatsApp Cloud API, and TikTok Business API integration.
- **Roman Urdu & Slang Intelligence:** Natural understanding of colloquial South Asian vocabulary and phrasing (e.g., *"Kahan ho bhai? Kal ka dinner plan scene on hai kya?"*).
- **AI Personality Studio:** Interactive sliders for Formality (0-100), Humor (0-100), Warmth, Emoji Density, and signature phrases to use or avoid.
- **Smart Pause & Human Takeover:** Automated replies instantly halt when financial transfers, legal disputes, or heated arguments are detected.
- **Server-Enforced Daily Free Quota:** 150 free AI replies every day per user, enforced atomically at 00:00 UTC with zero surprise charges.
- **Security-First Architecture:** AES-256-GCM token encryption at rest, Firebase ID token verification on every backend route, HMAC-SHA256 webhook signatures, and persistent replay defense.
- **Zero Password Collection:** Authorized exclusively through official platform OAuth dialogues; we never request or store user passwords.

---

## 2. Project Architecture & Monorepo Layout

```
.
├── packages/
│   └── shared/              # Shared TypeScript types, Zod schemas, constants (5 Modes, 4 Platforms)
├── src/                     # React 19 + TypeScript + Vite 8 Frontend
│   ├── components/brand/    # BrandLogo (custom SVG icon + wordmark)
│   ├── components/layout/   # Navbar, Footer, PublicLayout
│   ├── config/              # Firebase Client SDK configuration & fallback handler
│   ├── context/             # AuthContext (Google OAuth, Email/Pass, Password Reset)
│   ├── pages/public/        # 16 Public Website Pages (Home, Features, Pricing, Security, Contact...)
│   ├── pages/onboarding/    # 10-Step Interactive Onboarding Wizard
│   ├── pages/dashboard/     # Unified Inbox, AI Personality Studio, Conversation Lab
│   ├── pages/admin/         # Root Administration Console & Quota Manager
│   └── routes/              # AppRoutes (Public & Protected routes)
├── server/                  # Node.js + Express + Mongoose Backend
│   ├── src/                 # Controllers, Middleware, Models, Routes, Webhook Handlers
│   └── package.json
├── docs/                    # System Architecture, Integrations Setup & Security Checklist
├── .env.example             # Frontend environment variables template
└── README.md
```

---

## 3. Quick Start (Local Development)

### 3.1 Prerequisites
- Node.js v18+ (tested on Node v24.21.0)
- NPM v10+

### 3.2 Installation
```bash
# Clone and enter directory
cd "d:/Ai Agent"

# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 3.3 Running Locally
```bash
# Start frontend dev server (runs on http://localhost:5173)
npm run dev

# Start backend API (runs on http://localhost:5000)
cd server
npm run dev
```

---

## 4. Public Pages Reference (16 Routes)

1. `/` — Home (Hero, live animated dashboard preview, 4 platform cards, 5 use cases, 150 free quota section, security, pricing, FAQ)
2. `/features` — 9 core feature modules with technical safeguards
3. `/how-it-works` — 5-step operational workflow from OAuth to delivery
4. `/use-cases` — 5 assistant modes with sample dialogues
5. `/pricing` — 150 daily free replies tier + 3 Business plans
6. `/about` — Origin, ethical AI principles, Roman Urdu focus
7. `/security` — Firebase token auth, AES-256 token encryption at rest, HMAC signatures
8. `/integrations` — Official Meta & TikTok developer requirements & troubleshooting
9. `/faq` — Categorized FAQ with interactive search
10. `/contact` — Zod validated inquiry form
11. `/privacy` — Privacy policy (zero model training on private DMs)
12. `/terms` — Terms of service & anti-spam policy
13. `/login` — Sign in with Email/Password & Google OAuth
14. `/signup` — Registration with password strength meter & terms acceptance
15. `/forgot-password` — Password recovery instructions
16. `/verify-email` — Verification instructions & resend action

---

## 5. 10-Step Interactive Onboarding Wizard (`/onboarding`)

- **Step 1:** Choose Purpose (5 Assistant Modes)
- **Step 2:** Select Supported Platforms (WhatsApp, Instagram, Messenger, TikTok)
- **Step 3:** Review Platform Requirements & Eligibility
- **Step 4:** Connect Through Official Authorization Flow (OAuth & sandbox)
- **Step 5:** Select Language & Reply Style (Roman Urdu, Urdu, English, Mixed)
- **Step 6:** Customize Personality (Name, Greeting, Phrases to use & avoid)
- **Step 7:** Configure Safety Rules (Quiet hours, sensitive topic pause, AI disclosure badge)
- **Step 8:** Test with Simulated Conversations (Instant live reasoning)
- **Step 9:** Activate Supported Integrations (Safe confirmation toggle)
- **Step 10:** Completion & Dashboard Transition (Persisted to storage)

---

## 6. Security & Platform Compliance

- **Meta Graph API v21.0:** Strictly complies with WhatsApp Business Messaging and Instagram Graph API terms.
- **Encrypted Token Vault:** All provider tokens use AES-256-GCM encryption at rest with independent initialization vectors.
- **Idempotency:** Unique message IDs prevent duplicate replies and prevent webhook retries from charging quota.
- **Zero Impersonation:** Optional AI disclosure badge clearly indicates when a message is generated by Chat Replyzer AI.

---

## 7. License

Proprietary SaaS Application &bull; &copy; 2026 Chat Replyzer AI. All Rights Reserved.
