import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import DailyUsage, { getUtcDateInfo } from '../models/DailyUsage.js';

const router = express.Router();

// GET /api/usage - Retrieve atomic daily free reply usage and history
router.get('/', requireAuth, async (req, res) => {
  try {
    const quota = await DailyUsage.getQuotaStatus(req.user._id);

    // Retrieve last 7 days of usage history
    const history = await DailyUsage.find({ userId: req.user._id })
      .sort({ dateString: -1 })
      .limit(7)
      .select('dateString repliesUsed repliesAllowed isExhausted resetAtUtc');

    res.json({
      success: true,
      quota: {
        dailyLimit: quota.limit,
        repliesUsedToday: quota.used,
        remainingReplies: quota.remaining,
        resetTimeUtc: quota.resetAtUtc,
        isExhausted: quota.isExhausted,
        tier: req.user.tier || 'free',
      },
      history,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve usage quota.' });
  }
});

export default router;
