import mongoose from 'mongoose';
import { config } from '../config/env.js';

const dailyUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    dateString: {
      type: String, // YYYY-MM-DD in UTC
      required: true,
      index: true,
    },
    repliesUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    repliesAllowed: {
      type: Number,
      default: config.dailyFreeReplyLimit || 150,
    },
    isExhausted: {
      type: Boolean,
      default: false,
    },
    resetAtUtc: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring one record per user per UTC day
dailyUsageSchema.index({ userId: 1, dateString: 1 }, { unique: true });

/**
 * Get current UTC date string YYYY-MM-DD and next reset time
 */
export const getUtcDateInfo = () => {
  const now = new Date();
  const dateString = now.toISOString().split('T')[0];
  const resetAtUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
  return { dateString, resetAtUtc };
};

/**
 * Atomically attempt to consume 1 reply from user's daily quota
 * Returns { allowed: boolean, remaining: number, used: number, limit: number }
 */
dailyUsageSchema.statics.consumeReplyQuota = async function (userId, limit = config.dailyFreeReplyLimit || 150) {
  const { dateString, resetAtUtc } = getUtcDateInfo();

  // Atomically find or create the record and increment if repliesUsed < repliesAllowed
  const result = await this.findOneAndUpdate(
    {
      userId,
      dateString,
      repliesUsed: { $lt: limit },
    },
    {
      $inc: { repliesUsed: 1 },
      $setOnInsert: {
        repliesAllowed: limit,
        resetAtUtc,
        isExhausted: false,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  if (result) {
    const remaining = Math.max(0, result.repliesAllowed - result.repliesUsed);
    if (remaining === 0 && !result.isExhausted) {
      result.isExhausted = true;
      await result.save();
    }
    return {
      allowed: true,
      remaining,
      used: result.repliesUsed,
      limit: result.repliesAllowed,
    };
  }

  // If not matched, quota has been exhausted
  const current = await this.findOne({ userId, dateString });
  return {
    allowed: false,
    remaining: 0,
    used: current ? current.repliesUsed : limit,
    limit: current ? current.repliesAllowed : limit,
  };
};

/**
 * Get current quota status for user without consuming
 */
dailyUsageSchema.statics.getQuotaStatus = async function (userId, limit = config.dailyFreeReplyLimit || 150) {
  const { dateString, resetAtUtc } = getUtcDateInfo();
  let record = await this.findOne({ userId, dateString });

  if (!record) {
    record = await this.create({
      userId,
      dateString,
      repliesUsed: 0,
      repliesAllowed: limit,
      resetAtUtc,
      isExhausted: false,
    });
  }

  return {
    limit: record.repliesAllowed,
    used: record.repliesUsed,
    remaining: Math.max(0, record.repliesAllowed - record.repliesUsed),
    resetAtUtc: record.resetAtUtc,
    isExhausted: record.isExhausted || record.repliesUsed >= record.repliesAllowed,
  };
};

export const DailyUsage = mongoose.model('DailyUsage', dailyUsageSchema);
export default DailyUsage;
