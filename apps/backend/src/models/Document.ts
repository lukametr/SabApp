import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocument extends MongooseDocument {
  authorId: string;
  evaluatorName: string;
  evaluatorLastName: string;
  objectName: string;
  workDescription: string;
  date: Date;
  time: string;
  hazardIdentification: string;
  filePath?: string;
  affectedPersons: string[];
  injuryDescription: string;
  existingControlMeasures: string;
  initialRisk: {
    probability: number;
    severity: number;
    total: number;
  };
  additionalControlMeasures: string;
  residualRisk: {
    probability: number;
    severity: number;
    total: number;
  };
  requiredMeasures: string;
  responsiblePerson: string;
  reviewDate: Date;
  isFavorite: boolean;
  assessmentA: number;
  assessmentSh: number;
  assessmentR: number;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema({
  authorId: { type: String, required: true },
  evaluatorName: { type: String, required: true },
  evaluatorLastName: { type: String, required: true },
  objectName: { type: String, required: true },
  workDescription: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  hazardIdentification: { type: String, required: true },
  filePath: { type: String },
  affectedPersons: [{ type: String }],
  injuryDescription: { type: String, required: true },
  existingControlMeasures: { type: String, required: true },
  initialRisk: {
    probability: { type: Number, required: true },
    severity: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  additionalControlMeasures: { type: String, required: true },
  residualRisk: {
    probability: { type: Number, required: true },
    severity: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  requiredMeasures: { type: String, required: true },
  responsiblePerson: { type: String, required: true },
  reviewDate: { type: Date, required: true },
  isFavorite: { type: Boolean, default: false },
  assessmentA: { type: Number, default: 0 },
  assessmentSh: { type: Number, default: 0 },
  assessmentR: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Document = mongoose.model<IDocument>('Document', DocumentSchema); 