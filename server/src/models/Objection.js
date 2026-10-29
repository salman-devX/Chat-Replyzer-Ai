import mongoose from 'mongoose';

const objectionSchema = new mongoose.Schema(
  {
    objection: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['price', 'contract', 'timing', 'competitor', 'technical', 'trust', 'other'],
      default: 'price',
      index: true,
    },
    frequency: {
      type: Number,
      default: 1,
    },
    approvedResponse: {
      type: String,
      default: '',
    },
    effectiveness: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active',
    },
    tags: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        return ret;
      },
    },
  }
);

export const Objection = mongoose.model('Objection', objectionSchema);
