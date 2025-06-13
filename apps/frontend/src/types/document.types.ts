export interface Document {
  id: string;
  objectName: string;
  evaluatorName: string;
  evaluatorLastName: string;
  date: Date;
  time: string;
  workDescription: string;
  hazardIdentification: string;
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
}

export type CreateDocumentDto = Omit<Document, 'id'>; 