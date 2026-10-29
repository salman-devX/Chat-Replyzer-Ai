import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light', // Light theme by default as required
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    language: {
      type: String,
      enum: ['en', 'roman_urdu', 'urdu', 'mixed'],
      default: 'roman_urdu',
    },
    notificationEmail: {
      type: Boolean,
      default: true,
    },
    notificationInApp: {
      type: Boolean,
      default: true,
    },
    defaultQuietHours: {
      enabled: { type: Boolean, default: true },
      start: { type: String, default: '23:00' },
      end: { type: String, default: '08:00' },
    },
  },
  {
    timestamps: true,
  }
);

export const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);
export default UserPreferences;
