import mongoose from 'mongoose';

const followupSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    contactName: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['call', 'email', 'demo', 'meeting', 'follow-up', 'check-in'],
      default: 'call',
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'overdue', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    outcome: {
      type: String,
      default: '',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedRepName: {
      type: String,
      default: 'Alex Rivera',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        ret.rep = ret.assignedRepName;
        ret.dateTime = ret.scheduledAt
          ? new Date(ret.scheduledAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '';
        return ret;
      },
    },
  }
);

export const Followup = mongoose.model('Followup', followupSchema);
