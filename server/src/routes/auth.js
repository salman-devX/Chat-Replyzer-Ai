import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import UserPreferences from '../models/UserPreferences.js';
import AssistantProfile from '../models/AssistantProfile.js';
import DailyUsage from '../models/DailyUsage.js';

const router = express.Router();

// GET /api/me - Retrieve authenticated user profile, preferences, active assistant, and quota
router.get('/me', requireAuth, async (req, res) => {
  try {
    let preferences = await UserPreferences.findOne({ userId: req.user._id });
    if (!preferences) {
      preferences = await UserPreferences.create({ userId: req.user._id });
    }

    let assistant = null;
    if (req.user.activeAssistantId) {
      assistant = await AssistantProfile.findById(req.user.activeAssistantId);
    }
    if (!assistant) {
      assistant = await AssistantProfile.findOne({ userId: req.user._id });
      if (!assistant) {
        // Auto-provision initial profile if none exists
        assistant = await AssistantProfile.create({
          userId: req.user._id,
          name: 'Aria',
          mode: 'personal',
          platforms: ['whatsapp', 'instagram'],
          language: 'roman_urdu',
          formality: 25,
          humor: 75,
        });
        req.user.activeAssistantId = assistant._id;
        await req.user.save();
      }
    }

    const quota = await DailyUsage.getQuotaStatus(req.user._id);

    res.json({
      success: true,
      user: {
        id: req.user._id,
        firebaseUid: req.user.firebaseUid,
        email: req.user.email,
        displayName: req.user.displayName,
        photoURL: req.user.photoURL,
        role: req.user.role,
        emailVerified: req.user.emailVerified,
        tier: req.user.tier,
      },
      preferences,
      assistant,
      quota,
    });
  } catch (error) {
    console.error('[/api/me] Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to retrieve profile data.' });
  }
});

// PATCH /api/me/preferences - Update user preferences
router.patch('/me/preferences', requireAuth, async (req, res) => {
  try {
    const { theme, timezone, language, notificationEmail, notificationInApp, defaultQuietHours } = req.body;
    let preferences = await UserPreferences.findOne({ userId: req.user._id });
    if (!preferences) {
      preferences = new UserPreferences({ userId: req.user._id });
    }

    if (theme) preferences.theme = theme;
    if (timezone) preferences.timezone = timezone;
    if (language) preferences.language = language;
    if (notificationEmail !== undefined) preferences.notificationEmail = notificationEmail;
    if (notificationInApp !== undefined) preferences.notificationInApp = notificationInApp;
    if (defaultQuietHours) preferences.defaultQuietHours = { ...preferences.defaultQuietHours, ...defaultQuietHours };

    await preferences.save();
    res.json({ success: true, preferences });
  } catch (error) {
    console.error('[/api/me/preferences] Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update preferences.' });
  }
});

export default router;
