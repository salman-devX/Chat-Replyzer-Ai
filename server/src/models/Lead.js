import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Lead contact name is required'],
      trim: true,
      index: true,
    },
    title: {
      type: String,
      default: 'Fleet Manager',
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
      index: true,
    },
    fleetSize: {
      type: Number,
      default: 24,
      min: 1,
      index: true,
    },
    truckType: {
      type: String,
      default: 'Dry Van',
    },
    location: {
      type: String,
      default: 'Dallas, TX',
      index: true,
    },
    service: {
      type: String,
      default: 'ELD & Fuel Card Program',
    },
    source: {
      type: String,
      default: 'Outbound AI Telephony',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Interested', 'Negotiation', 'Won', 'Lost', 'Follow-up'],
      default: 'New',
      index: true,
    },
    leadScore: {
      type: Number,
      default: 75,
      min: 0,
      max: 100,
      index: true,
    },
    temperature: {
      type: String,
      enum: ['HOT', 'WARM', 'COLD'],
      default: 'WARM',
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    assignedRepName: {
      type: String,
      default: 'Alex Rivera',
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    currentProvider: {
      type: String,
      default: 'Motive',
    },
    annualEstimate: {
      type: String,
      default: '$35,000',
    },
    serviceInterest: {
      type: String,
      default: 'ELD & Fuel Card Program',
    },
    intent: {
      type: String,
      default: 'Pricing comparison & contract buyout feasibility',
    },
    objections: {
      type: [String],
      default: [],
    },
    notesCount: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: ['Dry Van', 'High-Mileage'],
    },
    lastContactAt: {
      type: Date,
      default: Date.now,
    },
    nextFollowUpAt: {
      type: Date,
      default: null,
    },
    nextFollowupString: {
      type: String,
      default: 'Pending schedule',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        ret.score = ret.leadScore;
        ret.assignedTo = ret.assignedRepName;
        ret.nextFollowup = ret.nextFollowupString || (ret.nextFollowUpAt ? new Date(ret.nextFollowUpAt).toLocaleDateString() : 'Pending review');
        ret.lastContact = ret.lastContactAt ? 'Recently' : 'Never';
        return ret;
      },
    },
  }
);

leadSchema.index({ company: 'text', name: 'text', location: 'text', service: 'text' });

export const Lead = mongoose.model('Lead', leadSchema);
