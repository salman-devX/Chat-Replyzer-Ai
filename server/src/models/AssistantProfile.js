import mongoose from 'mongoose';

const assistantProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'Aria',
    },
    mode: {
      type: String,
      enum: ['personal', 'business', 'creator', 'sales', 'community'],
      default: 'personal',
      required: true,
    },
    platforms: [
      {
        type: String,
        enum: ['whatsapp', 'instagram', 'messenger', 'tiktok'],
      },
    ],
    language: {
      type: String,
      enum: ['en', 'roman_urdu', 'urdu', 'mixed'],
      default: 'roman_urdu',
    },
    formality: {
      type: Number,
      min: 0,
      max: 100,
      default: 25,
    },
    humor: {
      type: Number,
      min: 0,
      max: 100,
      default: 75,
    },
    emojiFrequency: {
      type: String,
      enum: ['none', 'low', 'moderate', 'high'],
      default: 'moderate',
    },
    replyLength: {
      type: String,
      enum: ['concise', 'balanced', 'detailed'],
      default: 'balanced',
    },
    warmth: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    sampleGreeting: {
      type: String,
      default: 'Assalam o Alaikum! Kese ho bhai?',
    },
    sampleSignoff: {
      type: String,
      default: 'Chalo milte hain phir!',
    },
    phrasesToUse: [
      {
        type: String,
      },
    ],
    phrasesToAvoid: [
      {
        type: String,
      },
    ],
    sensitiveTopicsPolicy: {
      pauseOnFinancial: { type: Boolean, default: true },
      pauseOnThreats: { type: Boolean, default: true },
      pauseOnLegal: { type: Boolean, default: true },
      pauseOnEscalation: { type: Boolean, default: true },
      pauseOnUrgent: { type: Boolean, default: false },
    },
    quietHours: {
      enabled: { type: Boolean, default: true },
      start: { type: String, default: '23:00' },
      end: { type: String, default: '08:00' },
      timezone: { type: String, default: 'UTC' },
    },
    maxResponseFrequency: {
      type: Number,
      default: 10, // Max replies per contact per hour
    },
    humanTakeover: {
      enabled: { type: Boolean, default: true },
      notifyEmail: { type: Boolean, default: true },
      notifyInApp: { type: Boolean, default: true },
      disclosureNotice: { type: Boolean, default: false },
    },
    isPaused: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const AssistantProfile = mongoose.model('AssistantProfile', assistantProfileSchema);
export default AssistantProfile;
