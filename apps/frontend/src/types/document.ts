export enum DocumentFormat {
  PDF = 'pdf',
  DOC = 'doc',
  DOCX = 'docx',
  TXT = 'txt',
}

export enum PersonCategory {
  INDIVIDUAL = 'individual',
  LEGAL = 'legal',
}

export interface Risk {
  probability: number;
  severity: number;
  total: number;
}

export interface Hazard {
  id: string;
  hazardIdentification: string;
  affectedPersons: string[];
  injuryDescription: string;
  existingControlMeasures: string;
  initialRisk: Risk;
  additionalControlMeasures: string;
  residualRisk: Risk;
  requiredMeasures: string;
  responsiblePerson: string;
  reviewDate: Date | null; // Allow null for DatePicker compatibility
  photos: string[]; // Base64 data URLs
}

export interface Document {
  id: string;
  authorId: string;
  evaluatorName: string;
  evaluatorLastName: string;
  objectName: string;
  workDescription: string;
  date: Date;
  time: Date;
  hazards: Hazard[];
  filePath?: string;
  isFavorite: boolean;
  assessmentA: number;
  assessmentSh: number;
  assessmentR: number;
  photos: string[]; // Base64 data URLs
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentDto {
  evaluatorName: string;
  evaluatorLastName: string;
  objectName: string;
  workDescription: string;
  date: Date;
  time: Date;
  hazards: Hazard[];
  photos?: File[];
}

export interface UpdateDocumentDto {
  id: string;
  evaluatorName?: string;
  evaluatorLastName?: string;
  objectName?: string;
  workDescription?: string;
  date?: Date;
  time?: Date;
  hazards?: Hazard[];
  photos?: string[]; // Base64 data URLs
} 