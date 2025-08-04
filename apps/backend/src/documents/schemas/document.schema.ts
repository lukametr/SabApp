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

  @Prop({ required: true })
  hazardIdentification: string;

  @Prop({ type: [String], required: true })
  affectedPersons: string[];

  @Prop({ required: true })
  injuryDescription: string;

  @Prop({ required: true })
  existingControlMeasures: string;

  @Prop({ type: Risk, required: true })
  initialRisk: Risk;

  @Prop({ required: true })
  additionalControlMeasures: string;

  @Prop({ type: Risk, required: true })
  residualRisk: Risk;

  @Prop({ required: true })
  requiredMeasures: string;

  @Prop({ required: true })
  responsiblePerson: string;

  @Prop({ required: true })
  reviewDate: Date;

  @Prop({ type: [String], default: [] })
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

  @Prop({ type: [Hazard], required: true })
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

  @Prop({ type: [String], default: [] })
  photos: string[];

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