import mongoose, { Document as MongooseDocument, Schema } from 'mongoose';

export interface IDocument extends MongooseDocument {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  isFavorite: boolean;
  riskAssessment: {
    probability: number;
    severity: number;
    total: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  riskAssessment: {
    probability: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    severity: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    total: {
      type: Number,
      required: true,
      min: 1,
      max: 25
    }
  }
}, {
  timestamps: true
});

export const Document = mongoose.model<IDocument>('Document', documentSchema); 