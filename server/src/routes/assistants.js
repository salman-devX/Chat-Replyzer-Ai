import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import AssistantProfile from '../models/AssistantProfile.js';
import AuditLog from '../models/AuditLog.js';

const router = express.Router();

// GET /api/assistants - List user's assistant profiles
router.get('/', requireAuth, async (req, res) => {
  try {
    const assistants = await AssistantProfile.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, assistants });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch assistants.' });
  }
});

// POST /api/assistants - Create new assistant profile
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      name,
      mode,
      platforms,
      language,
      formality,
      humor,
      emojiFrequency,
      replyLength,
      warmth,
      sampleGreeting,
      sampleSignoff,
      phrasesToUse,
      phrasesToAvoid,
      sensitiveTopicsPolicy,
      quietHours,
      humanTakeover,
    } = req.body;

    const assistant = await AssistantProfile.create({
      userId: req.user._id,
      name: name || 'Aria',
      mode: mode || 'personal',
      platforms: platforms || ['whatsapp'],
      language: language || 'roman_urdu',
      formality: formality ?? 25,
      humor: humor ?? 75,
      emojiFrequency: emojiFrequency || 'moderate',
      replyLength: replyLength || 'balanced',
      warmth: warmth ?? 85,
      sampleGreeting,
      sampleSignoff,
      phrasesToUse,
      phrasesToAvoid,
      sensitiveTopicsPolicy,
      quietHours,
      humanTakeover,
    });

    // Make this assistant active if none was set
    if (!req.user.activeAssistantId) {
      req.user.activeAssistantId = assistant._id;
      await req.user.save();
    }

    await AuditLog.create({
      userId: req.user._id,
      action: 'assistant_created',
      details: { assistantId: assistant._id, name: assistant.name, mode: assistant.mode },
    });

    res.status(201).json({ success: true, assistant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create assistant profile.' });
  }
});

// PATCH /api/assistants/:id - Update assistant profile
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const assistant = await AssistantProfile.findOne({ _id: req.params.id, userId: req.user._id });
    if (!assistant) {
      return res.status(404).json({ success: false, message: 'Assistant profile not found.' });
    }

    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      if (key !== '_id' && key !== 'userId') {
        assistant[key] = updates[key];
      }
    });

    await assistant.save();
    res.json({ success: true, assistant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update assistant profile.' });
  }
});

// POST /api/assistants/:id/pause - Pause assistant
router.post('/:id/pause', requireAuth, async (req, res) => {
  try {
    const assistant = await AssistantProfile.findOne({ _id: req.params.id, userId: req.user._id });
    if (!assistant) {
      return res.status(404).json({ success: false, message: 'Assistant profile not found.' });
    }
    assistant.isPaused = true;
    await assistant.save();
    res.json({ success: true, isPaused: true, message: 'Assistant paused successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to pause assistant.' });
  }
});

// POST /api/assistants/:id/resume - Resume assistant
router.post('/:id/resume', requireAuth, async (req, res) => {
  try {
    const assistant = await AssistantProfile.findOne({ _id: req.params.id, userId: req.user._id });
    if (!assistant) {
      return res.status(404).json({ success: false, message: 'Assistant profile not found.' });
    }
    assistant.isPaused = false;
    await assistant.save();
    res.json({ success: true, isPaused: false, message: 'Assistant resumed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to resume assistant.' });
  }
});

export default router;
