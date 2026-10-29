import express from 'express';
import crypto from 'crypto';
import axios from 'axios';
import { config } from '../config/env.js';
import WebhookEvent from '../models/WebhookEvent.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import DailyUsage from '../models/DailyUsage.js';
import AssistantProfile from '../models/AssistantProfile.js';
import ConnectedIntegration from '../models/ConnectedIntegration.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { generateAiReply, evaluateSafetyGuardrails } from '../services/geminiService.js';
import { io } from '../server.js';

const router = express.Router();

/**
 * Verifies Meta HMAC-SHA256 signature (X-Hub-Signature-256)
 */
const verifyMetaSignature = (req) => {
  if (!config.metaAppSecret) return true; // If secret not set in development, bypass
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', config.metaAppSecret);
  const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
};

// ==============================================================================
// 1. WHATSAPP CLOUD API WEBHOOKS
// ==============================================================================

// Verification challenge handshake (GET)
router.get('/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.metaWebhookVerifyToken) {
    console.log('✅ [WhatsApp Webhook] Challenge handshake verified successfully.');
    return res.status(200).send(challenge);
  }
  return res.status(403).json({ success: false, message: 'Invalid verification token.' });
});

// Inbound WhatsApp message processor (POST)
router.post('/whatsapp', async (req, res) => {
  // Always respond with 200 OK immediately to satisfy Meta's strict timeout SLA
  res.status(200).send('EVENT_RECEIVED');

  try {
    if (!verifyMetaSignature(req)) {
      console.warn('⚠️ [WhatsApp Webhook] Invalid HMAC-SHA256 signature.');
      return;
    }

    const value = req.body?.entry?.[0]?.changes?.[0]?.value;
    const incomingMessage = value?.messages?.[0];
    if (!incomingMessage || incomingMessage.type !== 'text') {
      return; // Ignore delivery receipts or non-text messages
    }

    const messageId = incomingMessage.id;
    const fromPhone = incomingMessage.from;
    const messageText = incomingMessage.text?.body;
    const contactName = value?.contacts?.[0]?.profile?.name || `+${fromPhone}`;

    // 1. Persistent Idempotency Check: prevent duplicate replies from webhook retries
    const existingEvent = await WebhookEvent.findOne({ eventId: messageId });
    if (existingEvent) {
      console.log(`ℹ️ [WhatsApp Webhook] Duplicate event ${messageId} ignored.`);
      return;
    }

    await WebhookEvent.create({
      platform: 'whatsapp',
      eventId: messageId,
      payload: req.body,
      status: 'processed',
    });

    // 2. Find associated user or default to system administrator
    let integration = await ConnectedIntegration.findOne({ platform: 'whatsapp', status: 'connected' });
    let userId = integration?.userId;
    if (!userId) {
      const defaultUser = await User.findOne({ role: 'admin' }) || await User.findOne({});
      userId = defaultUser?._id;
    }
    if (!userId) return;

    // 3. Find or create conversation
    let conversation = await Conversation.findOne({
      userId,
      platform: 'whatsapp',
      externalConversationId: fromPhone,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        userId,
        platform: 'whatsapp',
        externalConversationId: fromPhone,
        contactIdentifier: fromPhone,
        contactName,
        mode: 'personal',
        lastMessage: messageText,
        lastMessageAt: new Date(),
      });
    } else {
      conversation.lastMessage = messageText;
      conversation.lastMessageAt = new Date();
      await conversation.save();
    }

    // Record incoming message in DB
    await Message.create({
      conversationId: conversation._id,
      userId,
      platform: 'whatsapp',
      sender: 'contact',
      text: messageText,
      direction: 'inbound',
      externalMessageId: messageId,
      status: 'delivered',
    });

    // Notify connected frontend clients via Socket.IO
    if (io) {
      io.emit('message:inbound', {
        platform: 'whatsapp',
        conversationId: conversation._id,
        sender: contactName,
        text: messageText,
      });
    }

    // 4. Check if conversation is in Human Takeover mode (AI Paused)
    if (conversation.isAiPaused) {
      console.log(`ℹ️ [WhatsApp Webhook] Conversation ${conversation._id} is paused for human takeover. Skipping AI.`);
      return;
    }

    // 5. Retrieve active assistant profile
    const profile = await AssistantProfile.findOne({ userId }) || {
      name: 'Aria',
      mode: 'personal',
      language: 'roman_urdu',
      formality: 25,
      humor: 75,
      sensitiveTopicsPolicy: { pauseOnFinancial: true, pauseOnThreats: true },
    };

    if (profile.isPaused) {
      console.log(`ℹ️ [WhatsApp Webhook] Assistant ${profile.name} is globally paused.`);
      return;
    }

    // 6. Safety Guardrails evaluation (Smart Pause trigger)
    const safety = evaluateSafetyGuardrails(messageText, profile);
    if (safety.triggered) {
      conversation.isAiPaused = true;
      await conversation.save();

      await Notification.create({
        userId,
        title: 'Smart Pause Activated',
        message: `${safety.reason} in conversation with ${contactName}.`,
        type: 'takeover',
        actionUrl: `/dashboard/conversations`,
      });

      console.log(`🚨 [WhatsApp Webhook] Smart Pause triggered: ${safety.reason}`);
      return;
    }

    // 7. Atomic Quota Consumption (Enforces 150 daily free replies)
    const quotaResult = await DailyUsage.consumeReplyQuota(userId, config.dailyFreeReplyLimit);
    if (!quotaResult.allowed) {
      await Notification.create({
        userId,
        title: 'Daily Free Quota Exhausted',
        message: 'Your 150 daily free AI replies allowance has been reached for today. Automated replies paused until 00:00 UTC.',
        type: 'quota',
        actionUrl: '/dashboard',
      });
      console.log(`⚠️ [WhatsApp Webhook] Quota exhausted for user ${userId}.`);
      return;
    }

    // 8. Generate AI Reply with Roman Urdu / Gemini Nuance
    const aiResult = await generateAiReply(messageText, profile);
    const replyText = aiResult.replyText;

    // 9. Dispatch Outbound Message to WhatsApp Cloud API
    const phoneNumberId = config.whatsappPhoneNumberId;
    const accessToken = integration ? integration.getAccessToken() : config.whatsappAccessToken;

    if (phoneNumberId && accessToken) {
      try {
        await axios.post(
          `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
          {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: fromPhone,
            type: 'text',
            text: { preview_url: false, body: replyText },
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            timeout: 5000,
          }
        );
        console.log(`✅ [WhatsApp Webhook] Outbound AI reply sent to ${fromPhone}`);
      } catch (sendErr) {
        console.error('❌ [WhatsApp Cloud API Error]:', sendErr.response?.data?.error?.message || sendErr.message);
      }
    } else {
      console.log(`💬 [WhatsApp Sandbox Mock] Reply dispatched: "${replyText}"`);
    }

    // Record outbound AI reply in DB
    const outboundMsg = await Message.create({
      conversationId: conversation._id,
      userId,
      platform: 'whatsapp',
      sender: 'ai',
      text: replyText,
      direction: 'outbound',
      isAiGenerated: true,
      status: 'delivered',
      quotaCost: 1,
    });

    conversation.lastMessage = replyText;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    if (io) {
      io.emit('message:outbound', {
        platform: 'whatsapp',
        conversationId: conversation._id,
        text: replyText,
        quotaRemaining: quotaResult.remaining,
      });
    }
  } catch (error) {
    console.error('[WhatsApp Webhook Handler Error]:', error.message);
  }
});

// ==============================================================================
// 2. INSTAGRAM DIRECT MESSAGING WEBHOOKS
// ==============================================================================
router.get('/instagram', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === config.metaWebhookVerifyToken) {
    return res.status(200).send(challenge);
  }
  return res.status(403).json({ success: false });
});

router.post('/instagram', (req, res) => {
  res.status(200).send('EVENT_RECEIVED');
});

// ==============================================================================
// 3. FACEBOOK MESSENGER WEBHOOKS
// ==============================================================================
router.get('/messenger', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === config.metaWebhookVerifyToken) {
    return res.status(200).send(challenge);
  }
  return res.status(403).json({ success: false });
});

router.post('/messenger', (req, res) => {
  res.status(200).send('EVENT_RECEIVED');
});

// ==============================================================================
// 4. TIKTOK BUSINESS WEBHOOKS
// ==============================================================================
router.post('/tiktok', (req, res) => {
  res.status(200).json({ code: 0, message: 'success' });
});

export default router;
