import mongoose from 'mongoose';

const callSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: true,
      default: 'Marcus Vance',
      index: true,
    },
    company: {
      type: String,
      required: true,
      default: 'ABC Logistics',
      index: true,
    },
    leadId: {
      type: String,
      default: '',
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    agentType: {
      type: String,
      enum: ['ai', 'human'],
      default: 'ai',
    },
    agent: {
      type: String,
      default: 'TruckPilot AI v2.4',
    },
    direction: {
      type: String,
      enum: ['outbound', 'inbound'],
      default: 'outbound',
    },
    providerCallId: {
      type: String,
      default: () => `sip_call_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      index: true,
    },
    status: {
      type: String,
      enum: ['Calling', 'Connected', 'Completed', 'Handoff', 'No Answer', 'Failed', 'scheduled', 'cancelled'],
      default: 'Completed',
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    duration: {
      type: String,
      default: '3m 38s',
    },
    durationSec: {
      type: Number,
      default: 218,
    },
    outcome: {
      type: String,
      default: 'Qualified & Follow-up Scheduled',
    },
    intent: {
      type: String,
      default: 'Contract Switch & Pricing Comparison',
    },
    leadScore: {
      type: Number,
      default: 82,
    },
    leadTemp: {
      type: String,
      enum: ['HOT', 'WARM', 'COLD'],
      default: 'HOT',
    },
    sentiment: {
      type: String,
      default: 'Positive (84%)',
    },
    summary: {
      type: String,
      default: '',
    },
    nextAction: {
      type: String,
      default: 'Follow-up consultation call',
    },
    objectionsDetected: {
      type: [String],
      default: [],
    },
    approvedResponseUsed: {
      type: String,
      default: 'Zero-Downtime Hot-Swap Guarantee',
    },
    handoffTriggered: {
      type: Boolean,
      default: false,
    },
    handoffReason: {
      type: String,
      default: '',
    },
    transferredTo: {
      type: String,
      default: 'Alex Rivera',
    },
    recordingUrl: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        ret.date = ret.createdAt ? new Date(ret.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today';
        return ret;
      },
    },
  }
);

export const Call = mongoose.model('Call', callSchema);
