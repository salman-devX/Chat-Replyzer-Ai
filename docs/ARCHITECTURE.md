# Architecture Blueprint: Chat Replyzer AI

**Tagline:** One AI. Every Conversation.  
**Tech Stack:** React 19 + Vite 8 + TypeScript + Tailwind CSS + Framer Motion (Frontend) | Node.js + Express + Mongoose + Firebase Admin + Gemini API (Backend).

---

## 1. System Overview

Chat Replyzer AI is a multi-platform conversational automation SaaS built on official developer APIs and webhooks. It allows individuals, creators, and business support teams to manage automated messaging across **WhatsApp Business Platform**, **Instagram Direct**, **Facebook Messenger**, and **TikTok Business**.

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|  React 19 + TypeScript + Tailwind CSS (Light Theme: #F8FAFC / #0F172A)           |
|  - 16 Public Website Routes (Home, Features, How It Works, Pricing, Security...) |
|  - 10-Step Interactive Onboarding Wizard                                         |
|  - Authenticated Dashboard: Unified Inbox, Personality Studio, Conversation Lab   |
|  - Firebase Authentication Client SDK (Google OAuth, Email/Pass, Password Reset)  |
+----------------------------------------+------------------------------------------+
                                         |  Authorization: Bearer <Firebase_ID_Token>
                                         v
+-----------------------------------------------------------------------------------+
|                                  BACKEND API                                      |
|  Express + TypeScript / Node.js                                                   |
|  - Middleware: Helmet, CORS Allowlist, Rate Limiting, Firebase Token Auth Guard    |
|  - AES-256-GCM Token Encryption Vault (Provider access tokens encrypted at rest) |
|  - Atomic Daily Usage Engine (150 free replies / UTC day with MongoDB $inc)       |
|  - Webhook Handlers: HMAC-SHA256 signature checks & persistent idempotency cache  |
+-------------------+-----------------------------------+---------------------------+
                    |                                   |
                    v                                   v
+------------------------------------+   +------------------------------------------+
|          DATABASE (MONGODB)        |   |           AI PROVIDER ABSTRACTION        |
|  Mongoose Schemas:                 |   |  Google Gemini API                       |
|  - Users, AssistantProfiles        |   |  - Roman Urdu & South Asian dialect      |
|  - ConnectedIntegrations (AES-256) |   |  - Personality prompt builder            |
|  - DailyUsage (Atomic UTC Reset)   |   |  - Smart Pause & Safety Evaluator        |
|  - WebhookEvents (Idempotency TTL) |   |  - Prompt injection sanitizer            |
+------------------------------------+   +------------------------------------------+
```

---

## 2. Authentication & Authorization

1. **Client-Side:** User authenticates via Google OAuth or Email/Password using Firebase Authentication.
2. **ID Token Generation:** The Firebase Web SDK generates a short-lived JSON Web Token (JWT) signed by Google Auth servers.
3. **Backend Middleware:** Express intercepts protected requests via the `authMiddleware`:
   ```ts
   const decodedToken = await admin.auth().verifyIdToken(bearerToken);
   req.user = { uid: decodedToken.uid, email: decodedToken.email, role: decodedToken.role };
   ```
4. **Ownership Isolation:** All queries for integrations, assistants, and messages are strictly filtered by `userId: req.user.uid`.
5. **Admin Access:** The `/admin` routes verify trusted role claims or server-enforced database roles.

---

## 3. Server-Enforced Daily Free Quota (150 Replies/Day)

- **Allowance:** 150 AI-generated outgoing replies per registered user per UTC day.
- **Atomic Operations:** Counters increment atomically via MongoDB `$inc` with a `$lt: 150` condition to prevent concurrent race conditions.
- **Retry Deduplication:** Inbound webhook event IDs are cached in the `WebhookEvent` collection. Retried webhooks from Meta do not increment quota or generate duplicate replies.
- **Graceful Pausing:** When quota reaches 150, automated replies pause safely, and an in-app alert is dispatched. No unauthorized overage charges are made.

---

## 4. Cryptographic Security & Vault

- **Access Tokens at Rest:** Meta and TikTok OAuth tokens are encrypted using **AES-256-GCM** with a dynamic 16-byte initialization vector (IV) and authentication tag.
- **Zero Password Collection:** Social account passwords are never collected, requested, or stored.
- **Signature Verification:** All Meta webhooks verify `X-Hub-Signature-256` matching `sha256(payload, app_secret)`.
