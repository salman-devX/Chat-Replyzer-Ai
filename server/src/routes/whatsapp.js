import express from 'express';
import { whatsappWebService } from '../services/whatsappWebService.js';

const router = express.Router();

const getSessionId = (req) => {
  return req.query?.sessionId || req.body?.sessionId || req.headers?.['x-session-id'] || 'default';
};

// GET /api/whatsapp/status - Check real connection and get latest QR code
router.get('/status', (req, res) => {
  const sessionId = getSessionId(req);
  res.json({
    success: true,
    ...whatsappWebService.getStatus(sessionId),
  });
});

// GET /api/whatsapp/qr - Get current raw QR code string
router.get('/qr', (req, res) => {
  const sessionId = getSessionId(req);
  const status = whatsappWebService.getStatus(sessionId);
  res.json({
    success: true,
    qr: status.qr,
    status: status.status,
    sessionId,
  });
});

// POST /api/whatsapp/start - Start or restart real WhatsApp multi-device session
router.post('/start', async (req, res) => {
  const sessionId = getSessionId(req);
  try {
    await whatsappWebService.startSession(sessionId);
    res.json({
      success: true,
      message: `WhatsApp Web session (${sessionId}) started. Generating QR code...`,
      ...whatsappWebService.getStatus(sessionId),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/whatsapp/disconnect - Disconnect and log out
router.post('/disconnect', async (req, res) => {
  const sessionId = getSessionId(req);
  try {
    await whatsappWebService.logout(sessionId);
    res.json({
      success: true,
      message: `WhatsApp session (${sessionId}) logged out and cleared.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/whatsapp/config - Update role and auto-reply toggle
router.post('/config', (req, res) => {
  const sessionId = getSessionId(req);
  const { autoReplyEnabled, personality } = req.body;
  const updated = whatsappWebService.updateConfig({ autoReplyEnabled, personality }, sessionId);
  res.json({
    success: true,
    message: 'WhatsApp Auto-Reply configuration updated.',
    ...updated,
  });
});

// POST /api/whatsapp/send-message - Test outbound message
router.post('/send-message', async (req, res) => {
  const sessionId = getSessionId(req);
  try {
    const { to, text } = req.body;
    if (!to || !text) {
      return res.status(400).json({ success: false, message: 'Missing "to" phone number or "text" content.' });
    }
    const result = await whatsappWebService.sendTestMessage(to, text, sessionId);
    res.json({ success: true, message: 'Message sent successfully!', result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
