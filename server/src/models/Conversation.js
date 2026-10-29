import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    integrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ConnectedIntegration',
      default: null,
    },
    platform: {
      type: String,
      enum: ['whatsapp', 'instagram', 'messenger', 'tiktok'],
      required: true,
      index: true,
    },
    externalConversationId: {
      type: String,
      required: true,
      index: true,
    },
    contactIdentifier: {
      type: String,
      required: true, // phone number or @handle
      index: true,
    },
    contactName: {
      type: String,
      default: 'Contact',
    },
    mode: {
      type: String,
      enum: ['personal', 'business', 'creator', 'sales', 'community'],
      default: 'personal',
    },
    isAiPaused: {
      type: Boolean,
      default: false, // Set to true when human takeover is active
      index: true,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ userId: 1, platform: 1, externalConversationId: 1 }, { unique: true });

export const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
