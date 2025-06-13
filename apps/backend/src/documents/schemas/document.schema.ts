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
  time: string;

  @Prop({ required: true })
  hazardIdentification: string;

  @Prop()
  filePath: string;

  @Prop({ type: [String], required: true })
  affectedPersons: string[];

  @Prop({ required: true })
  injuryDescription: string;

  @Prop({ required: true })
  existingControlMeasures: string;

  @Prop({
    type: {
      probability: { type: Number, required: true },
      severity: { type: Number, required: true },
      total: { type: Number, required: true }
    },
    required: true
  })
  initialRisk: {
    probability: number;
    severity: number;
    total: number;
  };

  @Prop({ required: true })
  additionalControlMeasures: string;

  @Prop({
    type: {
      probability: { type: Number, required: true },
      severity: { type: Number, required: true },
      total: { type: Number, required: true }
    },
    required: true
  })
  residualRisk: {
    probability: number;
    severity: number;
    total: number;
  };

  @Prop({ required: true })
  requiredMeasures: string;

  @Prop({ required: true })
  responsiblePerson: string;

  @Prop({ required: true })
  reviewDate: Date;

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
}

export const DocumentSchema = SchemaFactory.createForClass(Document); 