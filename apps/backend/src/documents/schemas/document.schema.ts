import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongoDocument } from 'mongoose';

export enum DocumentFormat {
  PDF = 'pdf',
  DOC = 'doc',
  DOCX = 'docx',
  TXT = 'txt',
  JPG = 'jpg',
  PNG = 'png',
  JPEG = 'jpeg'
}

export enum PersonCategory {
  INDIVIDUAL = 'individual',
  LEGAL = 'legal',
}

@Schema({ _id: false })
class Risk {
  @Prop({ required: true })
  probability: number;

  @Prop({ required: true })
  severity: number;

  @Prop({ required: true })
  total: number;
}

@Schema({ _id: false })
class Hazard {
  @Prop({ required: false })
  id?: string;

  // Allow partial hazard drafts during edits; default empty string
  @Prop({ required: false, default: '' })
  hazardIdentification: string;

  @Prop({ type: [String], required: false, default: [] })
  affectedPersons: string[];

  @Prop({ required: false, default: '' })
  injuryDescription: string;

  @Prop({ required: false, default: '' })
  existingControlMeasures: string;

  @Prop({ type: Risk, required: true, default: () => ({ probability: 0, severity: 0, total: 0 }) })
  initialRisk: Risk;

  @Prop({ required: false, default: '' })
  additionalControlMeasures: string;

  @Prop({ type: Risk, required: true, default: () => ({ probability: 0, severity: 0, total: 0 }) })
  residualRisk: Risk;

  @Prop({ required: false, default: '' })
  requiredMeasures: string;

  @Prop({ required: false, default: '' })
  responsiblePerson: string;

  @Prop({ required: false, default: null })
  reviewDate: Date;

  @Prop({ 
    type: [String], 
    default: [],
    validate: {
      validator: function(photos: string[]) {
        if (!Array.isArray(photos)) return false;
        const max = 5 * 1024 * 1024; // 5MB per photo (approx by string length)
        return photos.every(p => typeof p === 'string' && p.length < max);
      },
      message: 'Photo size exceeds 5MB limit'
    }
  })
  photos: string[];
}

// Define interface for timestamp fields added by mongoose
export interface DocumentWithTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class Document extends MongoDocument {
  @Prop({ required: true })
  authorId: string;

  @Prop({ required: true })
  evaluatorName: string;

  @Prop({ required: true })
  evaluatorLastName: string;

  @Prop({ required: true })
  objectName: string;

  @Prop({ required: true })
  workDescription: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: Date;

  // Document-level review date (earliest expected review time)
  @Prop({ required: false, default: null })
  reviewDate: Date | null;

  // Ensure hazards always exists; default empty array prevents validator errors on legacy docs
  @Prop({ type: [Hazard], required: true, default: [] })
  hazards: Hazard[];

  @Prop()
  filePath: string;

  @Prop({ default: false })
  isFavorite: boolean;

  @Prop({ default: 0 })
  assessmentA: number;

  @Prop({ default: 0 })
  assessmentSh: number;

  @Prop({ default: 0 })
  assessmentR: number;

  @Prop({ 
    type: [String], 
    default: [],
    validate: {
      validator: function(photos: string[]) {
        if (!Array.isArray(photos)) return false;
        const max = 5 * 1024 * 1024; // 5MB per photo (approx by string length)
        return photos.every(p => typeof p === 'string' && p.length < max);
      },
      message: 'Photo size exceeds 5MB limit'
    }
  })
  photos: string[];

  // Download counters
  @Prop({ default: 0 })
  downloadZipCount: number;

  @Prop({ default: 0 })
  downloadExcelCount: number;

  @Prop({ default: 0 })
  downloadPdfCount: number;

  // TypeScript types for timestamp fields
  createdAt: Date;
  updatedAt: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);

// Transform _id to id for frontend compatibility
DocumentSchema.set('toJSON', {
  transform: function(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
}); 