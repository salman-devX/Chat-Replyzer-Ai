# Application Security & Privacy Checklist: Chat Replyzer AI

Every item in this checklist is enforced by our software architecture:

- [x] **Zero Password Interception:** We never prompt for, intercept, or store personal or social account passwords. All integrations use official OAuth dialogs.
- [x] **AES-256-GCM Token Encryption:** All external provider access tokens and refresh tokens are stored encrypted at rest with distinct IVs.
- [x] **Firebase ID Token Verification:** Every protected REST route verifies cryptographic JWT signatures on the backend via Firebase Admin SDK.
- [x] **HMAC-SHA256 Webhook Verification:** Incoming webhooks from Meta are cryptographically checked against `X-Hub-Signature-256`.
- [x] **Persistent Idempotency:** Webhook event IDs are stored with unique indices in MongoDB to prevent replay attacks and duplicate outgoing replies.
- [x] **Atomic Quota Accounting:** Daily reply counter increments use atomic MongoDB conditions (`$inc` with `$lt: 150`) to eliminate race condition bypasses.
- [x] **Prompt Injection Defense:** Incoming message strings are sanitized before being passed into the AI provider context.
- [x] **Smart Pause & Human Takeover:** Messages matching financial transfer keywords, legal threats, or hostility trigger an automated pause and notify the owner.
- [x] **Zero Model Training on DMs:** Message bodies are evaluated transiently in-memory and are never used to train external foundation models.
- [x] **Server-Managed Role Claims:** The `/admin` route strictly requires verified role claims from the backend, never frontend-supplied flags.
- [x] **Data Erasure & Token Revocation:** 1-click token revocation and account deletion permanently scrubs all associated database records.
