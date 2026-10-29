import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person is required'],
      trim: true,
      index: true,
    },
    role: {
      type: String,
      default: 'Fleet Operations Director',
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    location: {
      type: String,
      default: 'Dallas, TX',
    },
    fleetSize: {
      type: Number,
      required: true,
      default: 24,
      min: 1,
      index: true,
    },
    truckTypes: {
      type: String,
      default: 'Dry Van & Reefer',
    },
    currentProvider: {
      type: String,
      default: 'Motive (KeepTruckin)',
    },
    interestedServices: {
      type: [String],
      default: ['ELD Compliance', 'Fuel Card Program'],
    },
    relationshipStatus: {
      type: String,
      default: 'Enterprise Contract Review',
    },
    accountValue: {
      type: String,
      default: '$38,500/yr',
    },
    healthScore: {
      type: Number,
      default: 85,
      min: 0,
      max: 100,
    },
    activeTrucks: {
      type: Number,
      default: 24,
    },
    satisfaction: {
      type: String,
      default: 'High Interest',
    },
    leadStatus: {
      type: String,
      default: 'Qualified',
    },
    leadScore: {
      type: Number,
      default: 80,
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
    notes: {
      type: String,
      default: '',
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
    tags: {
      type: [String],
      default: ['Freight', 'High-Mileage'],
    },
    joinedDate: {
      type: String,
      default: 'Jan 2026',
    },
    lastContactAt: {
      type: Date,
      default: Date.now,
    },
    nextFollowUpAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        ret.company = ret.companyName;
        ret.truckType = ret.truckTypes;
        ret.services = ret.interestedServices;
        ret.assignedRep = ret.assignedRepName;
        ret.lastInteraction = ret.lastContactAt ? new Date(ret.lastContactAt).toLocaleDateString() : 'Never';
        return ret;
      },
    },
  }
);

customerSchema.index({ companyName: 'text', contactPerson: 'text', location: 'text' });

export const Customer = mongoose.model('Customer', customerSchema);
