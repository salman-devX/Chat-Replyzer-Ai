import mongoose from 'mongoose';

const knowledgeSourceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assistantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssistantProfile',
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    contentType: {
      type: String,
      enum: ['faq', 'document', 'url', 'text'],
      default: 'faq',
    },
    content: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const KnowledgeSource = mongoose.model('KnowledgeSource', knowledgeSourceSchema);
export default KnowledgeSource;
