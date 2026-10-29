import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { generateAiReply } from './geminiService.js';

/**
 * Single WhatsApp Session Instance
 */
class WhatsAppSession {
  constructor(sessionId, io, baseSessionsPath) {
    this.sessionId = sessionId;
    this.io = io;
    this.sock = null;
    this.currentQr = null;
    this.status = 'disconnected'; // 'disconnected' | 'connecting' | 'scan_needed' | 'connected'
    this.connectedUser = null;
    this.autoReplyEnabled = true;
    this.activePersonality = {
      mode: 'personal',
      name: 'Aria',
      language: 'roman_urdu',
      formality: 20,
      humor: 75,
      sampleGreeting: 'Assalam o Alaikum! Kese ho bhai?',
      sampleSignoff: 'Chalo phir milte hain!',
      phrasesToUse: ['Scene on hai', 'Zabardast', 'Bas nikal raha hoon'],
      phrasesToAvoid: ['I am an AI bot', 'System error'],
      sensitiveTopicsPolicy: {
        pauseOnFinancial: true,
        pauseOnThreats: true,
      },
    };
    this.chatHistories = new Map(); // remoteJid -> Array<{ role, text, timestamp }>
    this.humanTakeoverCooldowns = new Map(); // remoteJid -> timestamp until AI should pause
    this.messages = [];
    this.authPath = sessionId === 'default'
      ? path.join(process.cwd(), 'wa_auth')
      : path.join(baseSessionsPath, sessionId);
    this.reconnectAttempts = 0;
    this.isStarting = false;
  }

  getStatus() {
    return {
      sessionId: this.sessionId,
      status: this.status,
      qr: this.currentQr,
      user: this.connectedUser,
      autoReplyEnabled: this.autoReplyEnabled,
      activePersonality: this.activePersonality,
      messages: this.messages.slice(0, 50),
    };
  }

  updateConfig({ autoReplyEnabled, personality }) {
    if (typeof autoReplyEnabled === 'boolean') {
      this.autoReplyEnabled = autoReplyEnabled;
    }
    if (personality) {
      this.activePersonality = { ...this.activePersonality, ...personality };
    }
    this.broadcastState();
    return this.getStatus();
  }

  broadcastState() {
    if (this.io) {
      const state = this.getStatus();
      // Emit to user room and globally for default
      this.io.to(`session:${this.sessionId}`).emit('whatsapp:state', state);
      if (this.sessionId === 'default') {
        this.io.emit('whatsapp:state', state);
      }
    }
  }

  async startSession() {
    if (this.isStarting) {
      console.log(`⏳ [WhatsApp Session: ${this.sessionId}] Init already in progress. Skipping duplicate.`);
      return;
    }
    this.isStarting = true;

    try {
      if (this.sock) {
        try {
          this.sock.ev.removeAllListeners();
          this.sock.end(undefined);
        } catch (e) {}
        this.sock = null;
      }

      console.log(`🚀 [WhatsApp Session: ${this.sessionId}] Initializing Baileys session...`);
      this.status = 'connecting';
      this.broadcastState();

      if (!fs.existsSync(this.authPath)) {
        fs.mkdirSync(this.authPath, { recursive: true });
      }

      const { state, saveCreds } = await useMultiFileAuthState(this.authPath);
      const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 1015901307] }));

      this.sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: this.sessionId === 'default',
        browser: ['Chat Replyzer AI', 'Chrome', '1.0.0'],
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
        keepAliveIntervalMs: 10000,
      });

      this.sock.ev.on('creds.update', saveCreds);

      this.sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          console.log(`📱 [WhatsApp Session: ${this.sessionId}] Raw QR generated. Waiting for scan...`);
          this.currentQr = qr;
          this.status = 'scan_needed';
          this.broadcastState();
          if (this.io) {
            this.io.to(`session:${this.sessionId}`).emit('whatsapp:qr', { qr, timestamp: Date.now() });
            if (this.sessionId === 'default') {
              this.io.emit('whatsapp:qr', { qr, timestamp: Date.now() });
            }
          }
        }

        if (connection === 'close') {
          const statusCode = lastDisconnect?.error?.output?.statusCode;
          const isConnectionReplaced = statusCode === DisconnectReason.connectionReplaced || statusCode === 440;
          const isLoggedOut = statusCode === DisconnectReason.loggedOut || statusCode === 401;
          const shouldReconnect = !isConnectionReplaced && !isLoggedOut;

          console.log(`⚠️ [WhatsApp Session: ${this.sessionId}] Connection closed (code: ${statusCode}). Reconnecting: ${shouldReconnect}`);

          this.status = 'disconnected';
          this.currentQr = null;

          if (isLoggedOut) {
            this.connectedUser = null;
            this.cleanupAuth();
          }

          this.broadcastState();

          if (shouldReconnect && this.reconnectAttempts < 3) {
            this.reconnectAttempts++;
            setTimeout(() => {
              this.isStarting = false;
              this.startSession();
            }, 5000);
          } else {
            this.reconnectAttempts = 0;
            this.isStarting = false;
          }
        } else if (connection === 'open') {
          console.log(`✅ [WhatsApp Session: ${this.sessionId}] Real WhatsApp Linked Successfully!`);
          this.status = 'connected';
          this.currentQr = null;
          this.reconnectAttempts = 0;
          this.isStarting = false;

          const rawId = this.sock.user?.id || '';
          const phone = rawId.split(':')[0] || rawId.split('@')[0] || 'Unknown';
          const name = this.sock.user?.name || `+${phone}`;

          this.connectedUser = {
            id: rawId,
            phone: phone.startsWith('+') ? phone : `+${phone}`,
            name,
            platform: 'whatsapp',
            connectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };

          this.broadcastState();
          if (this.io) {
            this.io.to(`session:${this.sessionId}`).emit('whatsapp:connected', { user: this.connectedUser });
            if (this.sessionId === 'default') {
              this.io.emit('whatsapp:connected', { user: this.connectedUser });
            }
          }
        }
      });

      // Inbound Messages Listener
      this.sock.ev.on('messages.upsert', async (m) => {
        if (!m.messages || m.messages.length === 0) return;
        const msg = m.messages[0];
        const remoteJid = msg.key.remoteJid || '';

        // Skip broadcasts / status updates
        if (remoteJid.includes('broadcast')) return;

        // Ignore messages sent by ourselves so we don't reply to our own messages
        if (msg.key.fromMe) return;

        // Extract message text or identify media
        let incomingText =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          msg.message?.imageMessage?.caption ||
          '';

        if (!incomingText) {
          if (msg.message?.audioMessage) {
            incomingText = '[Voice Note / Audio Message]';
          } else if (msg.message?.imageMessage) {
            incomingText = '[Image Message]';
          } else if (msg.message?.videoMessage) {
            incomingText = '[Video Message]';
          } else if (msg.message?.documentMessage) {
            incomingText = '[Document Attached]';
          }
        }

        if (!incomingText || !incomingText.trim()) return;

        const senderName = msg.pushName || remoteJid.split('@')[0] || 'Contact';
        const senderPhone = remoteJid.split('@')[0];

        console.log(`\n📩 [WhatsApp Inbound (${this.sessionId})] From: ${senderName} (+${senderPhone}): "${incomingText}"`);

        // Check if Auto-Reply is active
        if (!this.autoReplyEnabled) {
          console.log('⏸️ [WhatsApp Auto-Reply] Auto-reply is paused. Logging incoming only.');
          const entry = {
            id: `msg_${Date.now()}`,
            platform: 'whatsapp',
            contactName: senderName,
            contactIdentifier: `+${senderPhone}`,
            incomingText,
            replyText: '[Auto-Reply Paused by Owner]',
            roleUsed: this.activePersonality.mode,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'manual_takeover',
          };
          this.messages.unshift(entry);
          this.broadcastState();
          return;
        }

        // Retrieve continuous chat history for this specific contact
        const history = this.chatHistories.get(remoteJid) || [];

        // Simulate human WhatsApp presence: send 'composing' (typing indicator)
        try {
          await this.sock.sendPresenceUpdate('composing', remoteJid).catch(() => {});
        } catch (presErr) {}

        // Generate Real AI Reply with Roman Urdu / Multi-Turn Context
        try {
          const aiResult = await generateAiReply(incomingText, this.activePersonality, history, remoteJid);

          if (aiResult.safetyInterception) {
            console.log(`🚨 [WhatsApp Safety Alert] Smart Pause initiated: ${aiResult.reason}`);
            await this.sock.sendPresenceUpdate('paused', remoteJid).catch(() => {});
            const entry = {
              id: `msg_${Date.now()}`,
              platform: 'whatsapp',
              contactName: senderName,
              contactIdentifier: `+${senderPhone}`,
              incomingText,
              replyText: '⚠️ [SMART PAUSE ACTIVATED] Financial/Sensitive transfer request detected. Reply held for manual response.',
              roleUsed: this.activePersonality.mode,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'paused_safety',
              safetyFlag: aiResult.reason,
            };
            this.messages.unshift(entry);
            this.broadcastState();
            return;
          }

          const replyText = aiResult.replyText;
          if (replyText) {
            // Snappy human typing delay: 1200ms to 2800ms
            const typingDelay = Math.min(Math.max(replyText.length * 20, 1200), 2800);
            await new Promise((resolve) => setTimeout(resolve, typingDelay));

            console.log(`🤖 [WhatsApp Auto-Reply (${this.sessionId})] Sending reply: "${replyText}"`);

            // SEND ACTUAL REAL WHATSAPP MESSAGE VIA BAILEYS
            await this.sock.sendMessage(remoteJid, { text: replyText });
            await this.sock.sendPresenceUpdate('paused', remoteJid).catch(() => {});
            console.log(`✅ [WhatsApp Auto-Reply] Real reply delivered to +${senderPhone}!`);

            // Record conversation history turns for continuous context
            history.push({ role: 'user', text: incomingText, timestamp: Date.now() });
            history.push({ role: 'model', text: replyText, timestamp: Date.now() });
            if (history.length > 20) {
              history.splice(0, history.length - 20);
            }
            this.chatHistories.set(remoteJid, history);

            const entry = {
              id: `msg_${Date.now()}`,
              platform: 'whatsapp',
              contactName: senderName,
              contactIdentifier: `+${senderPhone}`,
              incomingText,
              replyText,
              roleUsed: this.activePersonality.mode,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'replied',
              language: this.activePersonality.language,
            };
            this.messages.unshift(entry);
            this.broadcastState();
          }
        } catch (replyErr) {
          console.error(`❌ [WhatsApp Auto-Reply Error (${this.sessionId})]:`, replyErr.message);
          await this.sock.sendPresenceUpdate('paused', remoteJid).catch(() => {});
        }
      });
    } catch (err) {
      console.error(`❌ [WhatsApp Session: ${this.sessionId}] Init failed:`, err.message);
      this.status = 'disconnected';
      this.broadcastState();
    }
  }

  async logout() {
    try {
      if (this.sock) {
        await this.sock.logout().catch(() => {});
      }
    } finally {
      this.sock = null;
      this.currentQr = null;
      this.status = 'disconnected';
      this.connectedUser = null;
      this.cleanupAuth();
      this.broadcastState();
    }
  }

  cleanupAuth() {
    try {
      if (fs.existsSync(this.authPath)) {
        fs.rmSync(this.authPath, { recursive: true, force: true });
      }
    } catch (e) {
      console.warn(`Could not remove auth directory for ${this.sessionId}:`, e.message);
    }
  }

  async sendTestMessage(targetJid, text) {
    if (!this.sock || this.status !== 'connected') {
      throw new Error('WhatsApp is not connected.');
    }
    const jid = targetJid.includes('@s.whatsapp.net') ? targetJid : `${targetJid.replace(/\+/g, '')}@s.whatsapp.net`;
    return await this.sock.sendMessage(jid, { text });
  }
}

/**
 * Multi-Tenant WhatsApp Session Manager
 */
class WhatsAppSessionManager {
  constructor() {
    this.sessions = new Map();
    this.io = null;
    this.baseSessionsPath = path.join(process.cwd(), 'wa_sessions');
    if (!fs.existsSync(this.baseSessionsPath)) {
      fs.mkdirSync(this.baseSessionsPath, { recursive: true });
    }
    // Always initialize default session for single-tenant / local development compatibility
    this.defaultSession = this.getOrCreateSession('default');
  }

  setIo(io) {
    this.io = io;
    for (const session of this.sessions.values()) {
      session.io = io;
    }
  }

  getOrCreateSession(sessionId = 'default') {
    if (!this.sessions.has(sessionId)) {
      const session = new WhatsAppSession(sessionId, this.io, this.baseSessionsPath);
      this.sessions.set(sessionId, session);
    }
    return this.sessions.get(sessionId);
  }

  // ─── Default Session Proxy Methods for backward compatibility ──────────────
  get currentQr() {
    return this.defaultSession.currentQr;
  }

  get status() {
    return this.defaultSession.status;
  }

  get connectedUser() {
    return this.defaultSession.connectedUser;
  }

  get autoReplyEnabled() {
    return this.defaultSession.autoReplyEnabled;
  }

  get activePersonality() {
    return this.defaultSession.activePersonality;
  }

  get messages() {
    return this.defaultSession.messages;
  }

  getStatus(sessionId = 'default') {
    return this.getOrCreateSession(sessionId).getStatus();
  }

  updateConfig(config, sessionId = 'default') {
    return this.getOrCreateSession(sessionId).updateConfig(config);
  }

  broadcastState(sessionId = 'default') {
    return this.getOrCreateSession(sessionId).broadcastState();
  }

  startSession(sessionId = 'default') {
    return this.getOrCreateSession(sessionId).startSession();
  }

  logout(sessionId = 'default') {
    return this.getOrCreateSession(sessionId).logout();
  }

  sendTestMessage(targetJid, text, sessionId = 'default') {
    return this.getOrCreateSession(sessionId).sendTestMessage(targetJid, text);
  }
}

export const whatsappWebService = new WhatsAppSessionManager();
