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

export interface Document {
  id: string;
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

export interface CreateDocumentDto {
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
  photos?: File[];
}

export interface UpdateDocumentDto {
  id: string;
  evaluatorName?: string;
  evaluatorLastName?: string;
  objectName?: string;
  workDescription?: string;
  date?: Date;
  time?: string;
  hazardIdentification?: string;
  filePath?: string;
  affectedPersons?: string[];
  injuryDescription?: string;
  existingControlMeasures?: string;
  initialRisk?: {
    probability: number;
    severity: number;
    total: number;
  };
  additionalControlMeasures?: string;
  residualRisk?: {
    probability: number;
    severity: number;
    total: number;
  };
  requiredMeasures?: string;
  responsiblePerson?: string;
  reviewDate?: Date;
} 