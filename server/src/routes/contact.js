import express from 'express';
import SupportTicket from '../models/SupportTicket.js';

const router = express.Router();

// POST /api/contact - Validated contact submission
router.post('/', async (req, res) => {
  try {
    const { name, email, category, message } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email address is required.' });
    }
    if (!message || message.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters.' });
    }

    const ticket = await SupportTicket.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category: category || 'general',
      message: message.trim(),
      status: 'open',
      priority: category === 'security' ? 'high' : 'medium',
      ipAddress: req.ip || '',
    });

    console.log(`📩 [Contact Form] Inquiry submitted from ${email} (${category})`);

    res.status(201).json({
      success: true,
      message: 'Inquiry received successfully. Our engineering and support team will respond shortly.',
      ticketId: ticket._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit inquiry.' });
  }
});

export default router;
