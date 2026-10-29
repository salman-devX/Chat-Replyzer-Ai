import mongoose from 'mongoose';
import { encryptToken, decryptToken } from '../utils/encryption.js';

const connectedIntegrationSchema = new mongoose.Schema(
  {
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
    status: {
      type: String,
      enum: ['connected', 'disconnected', 'pending_approval', 'error', 'not_configured'],
      default: 'not_configured',
    },
    accountName: {
      type: String,
      default: '',
    },
    accountId: {
      type: String,
      default: '',
    },
    // Tokens encrypted at rest with AES-256-GCM
    encryptedAccessToken: {
      type: String,
      default: '',
      select: false, // Never return in default query projections
    },
    encryptedRefreshToken: {
      type: String,
      default: '',
      select: false,
    },
    tokenExpiry: {
      type: Date,
      default: null,
    },
    permissions: [
      {
        type: String,
      },
    ],
    accountType: {
      type: String,
      default: '',
    },
    capabilities: [
      {
        type: String,
      },
    ],
    isPaused: {
      type: Boolean,
      default: false,
    },
    lastWebhookAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index so a user has at most one integration per platform
connectedIntegrationSchema.index({ userId: 1, platform: 1 }, { unique: true });

// Methods to set and get decrypted tokens safely on the server
connectedIntegrationSchema.methods.setAccessToken = function (rawToken) {
  this.encryptedAccessToken = encryptToken(rawToken);
};

connectedIntegrationSchema.methods.getAccessToken = function () {
  return decryptToken(this.encryptedAccessToken);
};

connectedIntegrationSchema.methods.setRefreshToken = function (rawToken) {
  this.encryptedRefreshToken = encryptToken(rawToken);
};

connectedIntegrationSchema.methods.getRefreshToken = function () {
  return decryptToken(this.encryptedRefreshToken);
};

export const ConnectedIntegration = mongoose.model('ConnectedIntegration', connectedIntegrationSchema);
export default ConnectedIntegration;
