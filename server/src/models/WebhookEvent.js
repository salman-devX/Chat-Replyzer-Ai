import mongoose from 'mongoose';

const webhookEventSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ['whatsapp', 'instagram', 'messenger', 'tiktok'],
      required: true,
      index: true,
    },
    eventId: {
      type: String,
      required: true,
      unique: true, // Prevents duplicate webhook event processing and replay attacks
      index: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ['processed', 'ignored', 'failed'],
      default: 'processed',
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically prune processed webhook event IDs after 14 days
webhookEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 14 * 24 * 60 * 60 });

export const WebhookEvent = mongoose.model('WebhookEvent', webhookEventSchema);
export default WebhookEvent;
