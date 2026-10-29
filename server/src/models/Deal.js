import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Deal title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    contact: {
      type: String,
      default: '',
    },
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    stage: {
      type: String,
      enum: ['Discovery', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'],
      default: 'Discovery',
      index: true,
    },
    probability: {
      type: Number,
      default: 20,
      min: 0,
      max: 100,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    closeDate: {
      type: Date,
      default: null,
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
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
    services: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    truckCount: {
      type: Number,
      default: 0,
    },
    fleetSize: {
      type: Number,
      default: 0,
    },
    lastActivity: {
      type: String,
      default: 'New deal created',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        ret.rep = ret.assignedRepName;
        ret.daysInStage = ret.updatedAt
          ? Math.floor((Date.now() - new Date(ret.updatedAt)) / (1000 * 60 * 60 * 24))
          : 0;
        return ret;
      },
    },
  }
);

export const Deal = mongoose.model('Deal', dealSchema);
