import mongoose from 'mongoose';

const knowledgeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['product', 'pricing', 'compliance', 'competitor', 'process', 'faq', 'script'],
      default: 'product',
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active',
    },
    usageCount: {
      type: Number,
      default: 0,
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

knowledgeSchema.index({ title: 'text', content: 'text', summary: 'text' });

export const Knowledge = mongoose.model('Knowledge', knowledgeSchema);
