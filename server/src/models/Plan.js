import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: ['free', 'starter', 'growth', 'scale'],
    },
    monthlyPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    includedReplies: {
      type: Number,
      required: true, // e.g. 150 daily or 5000 monthly
    },
    isDailyQuota: {
      type: Boolean,
      default: false,
    },
    teamSeats: {
      type: Number,
      default: 1,
    },
    supportedIntegrations: [
      {
        type: String,
        enum: ['whatsapp', 'instagram', 'messenger', 'tiktok'],
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Plan = mongoose.model('Plan', planSchema);
export default Plan;
