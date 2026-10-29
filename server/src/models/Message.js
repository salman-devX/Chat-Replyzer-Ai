import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ['whatsapp', 'instagram', 'messenger', 'tiktok'],
      required: true,
    },
    sender: {
      type: String,
      enum: ['contact', 'ai', 'human'],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    direction: {
      type: String,
      enum: ['inbound', 'outbound'],
      required: true,
    },
    isAiGenerated: {
      type: Boolean,
      default: false,
    },
    safetyFlags: {
      triggered: { type: Boolean, default: false },
      reason: { type: String, default: '' },
      confidence: { type: Number, default: 0 },
    },
    externalMessageId: {
      type: String,
      default: '',
      index: true,
    },
    status: {
      type: String,
      enum: ['received', 'queued', 'sent', 'delivered', 'failed'],
      default: 'received',
    },
    quotaCost: {
      type: Number,
      default: 0, // 1 only for AI-generated outgoing reply
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model('Message', messageSchema);
export default Message;
