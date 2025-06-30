import api from '../../lib/api';
import { Document, CreateDocumentData, UpdateDocumentData } from '../../types/document';

export const documentApi = {
  getAll: async (): Promise<Document[]> => {
    const response = await api.get('/documents');
    return response.data;
  },

  getMyDocuments: async (): Promise<Document[]> => {
    const response = await api.get('/documents/my');
    return response.data;
  },

  getById: async (id: string): Promise<Document> => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  create: async (data: CreateDocumentData): Promise<Document> => {
    const formData = new FormData();
    
    // Add text fields
    formData.append('evaluatorName', data.evaluatorName);
    formData.append('evaluatorLastName', data.evaluatorLastName);
    formData.append('objectName', data.objectName);
    formData.append('workDescription', data.workDescription);
    formData.append('date', data.date.toISOString());
    formData.append('location', data.location);
    formData.append('clientName', data.clientName);
    formData.append('clientPhone', data.clientPhone);
    formData.append('clientEmail', data.clientEmail);
    formData.append('contractorName', data.contractorName);
    formData.append('contractorPhone', data.contractorPhone);
    formData.append('contractorEmail', data.contractorEmail);
    formData.append('projectManager', data.projectManager);
    formData.append('projectManagerPhone', data.projectManagerPhone);
    formData.append('projectManagerEmail', data.projectManagerEmail);
    formData.append('safetyOfficer', data.safetyOfficer);
    formData.append('safetyOfficerPhone', data.safetyOfficerPhone);
    formData.append('safetyOfficerEmail', data.safetyOfficerEmail);
    formData.append('weatherConditions', data.weatherConditions);
    formData.append('temperature', data.temperature.toString());
    formData.append('humidity', data.humidity.toString());
    formData.append('windSpeed', data.windSpeed.toString());
    formData.append('visibility', data.visibility);
    formData.append('workType', data.workType);
    formData.append('workPhase', data.workPhase);
    formData.append('numberOfWorkers', data.numberOfWorkers.toString());
    formData.append('workDuration', data.workDuration);
    formData.append('equipmentUsed', data.equipmentUsed);
    formData.append('materialsUsed', data.materialsUsed);
    formData.append('ppeRequired', data.ppeRequired);
    formData.append('ppeProvided', data.ppeProvided);
    formData.append('ppeUsed', data.ppeUsed);
    formData.append('safetyMeasures', data.safetyMeasures);
    formData.append('emergencyProcedures', data.emergencyProcedures);
    formData.append('incidentReporting', data.incidentReporting);
    formData.append('communicationMethods', data.communicationMethods);
    formData.append('supervisionLevel', data.supervisionLevel);
    formData.append('trainingProvided', data.trainingProvided);
    formData.append('certificationsRequired', data.certificationsRequired);
    formData.append('permitsRequired', data.permitsRequired);
    formData.append('permitsObtained', data.permitsObtained);
    formData.append('inspectionsConducted', data.inspectionsConducted);
    formData.append('violationsFound', data.violationsFound);
    formData.append('correctiveActions', data.correctiveActions);
    formData.append('followUpRequired', data.followUpRequired);
    formData.append('nextInspectionDate', data.nextInspectionDate);
    formData.append('notes', data.notes);
    formData.append('recommendations', data.recommendations);
    formData.append('signature', data.signature);
    formData.append('signatureDate', data.signatureDate.toISOString());

    // Add photos if they exist
    if (data.photos && data.photos.length > 0) {
      data.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          formData.append('photos', photo);
        }
      });
    }

    // Add hazard photos if they exist
    if (data.hazardPhotos && data.hazardPhotos.length > 0) {
      data.hazardPhotos.forEach((photo, index) => {
        if (photo instanceof File) {
          formData.append('hazardPhotos', photo);
        }
      });
    }

    const response = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (data: UpdateDocumentData): Promise<Document> => {
    const formData = new FormData();
    
    // Add all the same fields as create
    formData.append('evaluatorName', data.evaluatorName);
    formData.append('evaluatorLastName', data.evaluatorLastName);
    formData.append('objectName', data.objectName);
    formData.append('workDescription', data.workDescription);
    formData.append('date', data.date.toISOString());
    formData.append('location', data.location);
    formData.append('clientName', data.clientName);
    formData.append('clientPhone', data.clientPhone);
    formData.append('clientEmail', data.clientEmail);
    formData.append('contractorName', data.contractorName);
    formData.append('contractorPhone', data.contractorPhone);
    formData.append('contractorEmail', data.contractorEmail);
    formData.append('projectManager', data.projectManager);
    formData.append('projectManagerPhone', data.projectManagerPhone);
    formData.append('projectManagerEmail', data.projectManagerEmail);
    formData.append('safetyOfficer', data.safetyOfficer);
    formData.append('safetyOfficerPhone', data.safetyOfficerPhone);
    formData.append('safetyOfficerEmail', data.safetyOfficerEmail);
    formData.append('weatherConditions', data.weatherConditions);
    formData.append('temperature', data.temperature.toString());
    formData.append('humidity', data.humidity.toString());
    formData.append('windSpeed', data.windSpeed.toString());
    formData.append('visibility', data.visibility);
    formData.append('workType', data.workType);
    formData.append('workPhase', data.workPhase);
    formData.append('numberOfWorkers', data.numberOfWorkers.toString());
    formData.append('workDuration', data.workDuration);
    formData.append('equipmentUsed', data.equipmentUsed);
    formData.append('materialsUsed', data.materialsUsed);
    formData.append('ppeRequired', data.ppeRequired);
    formData.append('ppeProvided', data.ppeProvided);
    formData.append('ppeUsed', data.ppeUsed);
    formData.append('safetyMeasures', data.safetyMeasures);
    formData.append('emergencyProcedures', data.emergencyProcedures);
    formData.append('incidentReporting', data.incidentReporting);
    formData.append('communicationMethods', data.communicationMethods);
    formData.append('supervisionLevel', data.supervisionLevel);
    formData.append('trainingProvided', data.trainingProvided);
    formData.append('certificationsRequired', data.certificationsRequired);
    formData.append('permitsRequired', data.permitsRequired);
    formData.append('permitsObtained', data.permitsObtained);
    formData.append('inspectionsConducted', data.inspectionsConducted);
    formData.append('violationsFound', data.violationsFound);
    formData.append('correctiveActions', data.correctiveActions);
    formData.append('followUpRequired', data.followUpRequired);
    formData.append('nextInspectionDate', data.nextInspectionDate);
    formData.append('notes', data.notes);
    formData.append('recommendations', data.recommendations);
    formData.append('signature', data.signature);
    formData.append('signatureDate', data.signatureDate.toISOString());

    // Add photos if they exist
    if (data.photos && data.photos.length > 0) {
      data.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          formData.append('photos', photo);
        }
      });
    }

    // Add hazard photos if they exist
    if (data.hazardPhotos && data.hazardPhotos.length > 0) {
      data.hazardPhotos.forEach((photo, index) => {
        if (photo instanceof File) {
          formData.append('hazardPhotos', photo);
        }
      });
    }

    const response = await api.patch(`/documents/${data.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },

  toggleFavorite: async (id: string): Promise<Document> => {
    const response = await api.post(`/documents/${id}/favorite`);
    return response.data;
  },

  updateAssessment: async (
    id: string,
    assessmentA: number,
    assessmentSh: number,
    assessmentR: number
  ): Promise<Document> => {
    const response = await api.patch(`/documents/${id}/assessment`, {
      assessmentA,
      assessmentSh,
      assessmentR,
    });
    return response.data;
  },

  download: async (id: string): Promise<Blob> => {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  downloadMultiple: async (ids: string[]): Promise<Blob> => {
    const response = await api.post('/documents/download', { ids }, {
      responseType: 'blob',
    });
    return response.data;
  },
}; 