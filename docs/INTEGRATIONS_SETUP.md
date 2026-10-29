# Official Integrations Setup Guide: Chat Replyzer AI

Chat Replyzer AI operates strictly through official public developer APIs and webhooks provided by Meta Platforms, Inc. and TikTok Inc.

---

## 1. WhatsApp Business Platform / Cloud API (v21.0)

### Prerequisites:
- A Meta Business Manager account.
- A dedicated or unlinked phone number for your WhatsApp Business profile.

### Step-by-Step Configuration:
1. Navigate to [developers.facebook.com](https://developers.facebook.com) and click **My Apps > Create App**.
2. Select **Business** as the application type.
3. In the App Dashboard, click **Set Up** on the **WhatsApp** product.
4. Copy your **Phone Number ID** and **WhatsApp Business Account ID (WABA ID)**.
5. In **Configuration > Webhook**, set the Callback URL:
   ```
   https://api.yourdomain.com/api/webhooks/whatsapp
   ```
6. Set the **Verify Token** to the value configured in your backend `.env` (`META_WEBHOOK_VERIFY_TOKEN`).
7. Under Webhook fields, click **Subscribe** to `messages`.
8. Generate a permanent **System User Access Token** in Meta Business Settings under **Users > System Users** with permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
9. Input the System User Token into Chat Replyzer AI. The token is immediately encrypted with AES-256-GCM.

### Coexistence Guidance:
If the number is currently registered to the consumer WhatsApp mobile app, you must delete the consumer WhatsApp account on that number or use a supported Business Solution Provider coexistence flow to prevent registration conflicts.

---

## 2. Meta Instagram Direct Messaging API

### Prerequisites:
- An Instagram account switched to **Professional** or **Creator** mode.
- A Facebook Page connected to your Instagram account.

### Step-by-Step Configuration:
1. Open the Instagram mobile app and navigate to **Settings and Privacy > Messages and Story Replies > Connected Tools**.
2. Enable **Allow Access to Messages** (This allows Meta Graph API to read incoming DMs).
3. In Meta App Dashboard, add the **Instagram** product.
4. In Webhooks, subscribe to the `messages` and `messaging_postbacks` fields for the Instagram object.
5. In Chat Replyzer AI, click **Authenticate with Meta Login** to grant scoped permissions:
   - `instagram_basic`
   - `instagram_manage_messages`
   - `pages_manage_metadata`

---

## 3. Facebook Messenger Pages Platform

### Prerequisites:
- A published Facebook Business Page with Admin access.

### Step-by-Step Configuration:
1. In Meta App Dashboard, add the **Messenger** product.
2. In **Access Tokens**, link your Facebook Page and generate a Page Access Token.
3. Subscribe your Page to the Webhook URL:
   ```
   https://api.yourdomain.com/api/webhooks/messenger
   ```
4. Subscribe to the `messages` and `messaging_postbacks` fields.
5. Save the encrypted Page Access Token into Chat Replyzer AI.

---

## 4. TikTok Business Messaging

### Prerequisites:
- A verified TikTok Business Account.
- An approved developer account on [business-api.tiktok.com](https://business-api.tiktok.com).

### Step-by-Step Configuration:
1. Register your TikTok Business App in the TikTok Developer Portal.
2. Request the **Direct Message Management** scope (`business.message.read`, `business.message.write`).
3. Note: TikTok requires an explicit manual app review before direct messaging scopes can be used in production.
4. Once approved, complete the OAuth dialogue in Chat Replyzer AI.
