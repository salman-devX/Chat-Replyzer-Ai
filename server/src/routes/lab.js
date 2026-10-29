import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { generateAiReply, evaluateSafetyGuardrails } from '../services/geminiService.js';
import AssistantProfile from '../models/AssistantProfile.js';

const router = express.Router();

// POST /api/lab/simulate - Run interactive AI simulation without sending real messages
router.post('/simulate', requireAuth, async (req, res) => {
  try {
    const { incomingMessage, mode, platform, styleMode, customProfile, conversationHistory } = req.body;

    if (!incomingMessage || !incomingMessage.trim()) {
      return res.status(400).json({ success: false, message: 'Incoming message prompt is required.' });
    }

    // Retrieve active profile or assemble simulated profile
    let profile = customProfile;
    if (!profile) {
      profile = await AssistantProfile.findOne({ userId: req.user._id, mode: mode || 'personal' });
      if (!profile) {
        profile = {
          name: 'Salman',
          mode: mode || 'personal',
          language: 'roman_urdu',
          formality: styleMode === 'professional' ? 85 : 20,
          humor: styleMode === 'casual' ? 80 : 30,
          emojiFrequency: 'moderate',
          replyLength: styleMode === 'concise' ? 'concise' : 'balanced',
          sampleGreeting: 'Assalam o Alaikum! Kese ho bhai?',
          sampleSignoff: 'Chalo milte hain phir!',
          sensitiveTopicsPolicy: {
            pauseOnFinancial: true,
            pauseOnThreats: true,
            pauseOnLegal: true,
            pauseOnEscalation: true,
          },
        };
      }
    }

    // Apply style mode adjustments if specified
    if (styleMode === 'casual') {
      profile.formality = 15;
      profile.humor = 85;
    } else if (styleMode === 'professional') {
      profile.formality = 85;
      profile.humor = 20;
    } else if (styleMode === 'friendly') {
      profile.formality = 40;
      profile.humor = 60;
      profile.warmth = 95;
    } else if (styleMode === 'concise') {
      profile.replyLength = 'concise';
    }

    const aiResult = await generateAiReply(incomingMessage, profile, conversationHistory || []);

    res.json({
      success: true,
      result: {
        reply: aiResult.replyText,
        safetyStatus: aiResult.safetyInterception ? 'paused' : 'passed',
        reasoning: aiResult.safety?.reason || 'Standard conversation passed all safety checks.',
        safetyScore: aiResult.safety?.confidence || 100,
        provider: aiResult.provider,
        detectedIntent: 'Conversational Inquiry',
        language: profile.language || 'roman_urdu',
        simulatedOnly: true, // Guarantees zero real message dispatch
      },
    });
  } catch (error) {
    console.error('[/api/lab/simulate] Error:', error.message);
    res.status(500).json({ success: false, message: 'Simulation failed.' });
  }
});

export default router;
