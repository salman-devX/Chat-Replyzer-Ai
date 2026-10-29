import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const router = express.Router();

// GET /api/conversations - Unified inbox list
router.get('/', requireAuth, async (req, res) => {
  try {
    const { platform, mode, search } = req.query;
    const filter = { userId: req.user._id };

    if (platform && platform !== 'all') {
      filter.platform = platform;
    }
    if (mode && mode !== 'all') {
      filter.mode = mode;
    }
    if (search) {
      filter.$or = [
        { contactName: { $regex: search, $options: 'i' } },
        { contactIdentifier: { $regex: search, $options: 'i' } },
        { lastMessage: { $regex: search, $options: 'i' } },
      ];
    }

    let conversations = await Conversation.find(filter).sort({ lastMessageAt: -1 }).limit(50);

    // If new user has no conversations yet, populate seed demo items for immediate testing
    if (conversations.length === 0 && !search && (!platform || platform === 'all')) {
      const demoItems = [
        {
          userId: req.user._id,
          platform: 'whatsapp',
          externalConversationId: 'demo_conv_1',
          contactIdentifier: '+92 301 8877665',
          contactName: 'Hamza Malik (+92 301 8877665)',
          mode: 'personal',
          isAiPaused: false,
          isStarred: true,
          lastMessage: 'Scene on hai bhai, 8:30 PM tak pohanchta hoon!',
          lastMessageAt: new Date(Date.now() - 12 * 60 * 1000),
        },
        {
          userId: req.user._id,
          platform: 'instagram',
          externalConversationId: 'demo_conv_2',
          contactIdentifier: '@techreview_pakistan',
          contactName: '@techreview_pakistan',
          mode: 'creator',
          isAiPaused: false,
          isStarred: false,
          lastMessage: 'Hey! Thanks for reaching out. Media kit sent to collabs@...',
          lastTime: '45 mins ago',
          lastMessageAt: new Date(Date.now() - 45 * 60 * 1000),
        },
        {
          userId: req.user._id,
          platform: 'messenger',
          externalConversationId: 'demo_conv_3',
          contactIdentifier: 'tariq.mehmood.12',
          contactName: 'Tariq Mehmood',
          mode: 'business',
          isAiPaused: true,
          isStarred: false,
          lastMessage: 'Hello Tariq! Yes, our Enterprise tier includes 24/7 SLA.',
          lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
      ];

      for (const item of demoItems) {
        const conv = await Conversation.create(item);
        if (item.externalConversationId === 'demo_conv_1') {
          await Message.create({
            conversationId: conv._id,
            userId: req.user._id,
            platform: 'whatsapp',
            sender: 'contact',
            text: 'Kahan ho yar? Kal ka dinner plan scene on hai kya?',
            direction: 'inbound',
            status: 'delivered',
          });
          await Message.create({
            conversationId: conv._id,
            userId: req.user._id,
            platform: 'whatsapp',
            sender: 'ai',
            text: 'Scene on hai bhai, 8:30 PM tak pohanchta hoon! Table book karli?',
            direction: 'outbound',
            isAiGenerated: true,
            status: 'delivered',
            quotaCost: 1,
          });
        }
      }
      conversations = await Conversation.find(filter).sort({ lastMessageAt: -1 });
    }

    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch conversations.' });
  }
});

// GET /api/conversations/:id - Retrieve conversation messages
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user._id });
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
    res.json({ success: true, conversation, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch conversation details.' });
  }
});

// POST /api/conversations/:id/pause - Pause AI for this conversation (Human Takeover)
router.post('/:id/pause', requireAuth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user._id });
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }
    conversation.isAiPaused = true;
    await conversation.save();
    res.json({ success: true, isAiPaused: true, message: 'AI paused for this conversation (Human Takeover Active).' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to pause AI.' });
  }
});

// POST /api/conversations/:id/resume - Resume AI for this conversation
router.post('/:id/resume', requireAuth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user._id });
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }
    conversation.isAiPaused = false;
    await conversation.save();
    res.json({ success: true, isAiPaused: false, message: 'AI resumed for this conversation.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to resume AI.' });
  }
});

// POST /api/conversations/:id/reply - Manual human takeover reply
router.post('/:id/reply', requireAuth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required.' });
    }

    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user._id });
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    // Creating human reply automatically pauses AI for this conversation
    conversation.isAiPaused = true;
    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const message = await Message.create({
      conversationId: conversation._id,
      userId: req.user._id,
      platform: conversation.platform,
      sender: 'human',
      text: text.trim(),
      direction: 'outbound',
      isAiGenerated: false,
      status: 'delivered',
      quotaCost: 0, // Human replies do not consume AI quota
    });

    res.status(201).json({ success: true, message, isAiPaused: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send manual reply.' });
  }
});

// DELETE /api/conversations/:id - Purge stored conversation data
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user._id });
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    await Message.deleteMany({ conversationId: conversation._id });
    await Conversation.deleteOne({ _id: conversation._id });

    res.json({ success: true, message: 'Conversation data permanently deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete conversation.' });
  }
});

export default router;
