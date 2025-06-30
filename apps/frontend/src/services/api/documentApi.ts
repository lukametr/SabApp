import api, { getApiPath } from '../../lib/api';
import { Document, CreateDocumentDto, UpdateDocumentDto } from '../../types/document';

export const documentApi = {
  getAll: async (): Promise<Document[]> => {
    const response = await api.get(getApiPath('/documents'));
    return response.data;
  },

  getMyDocuments: async (): Promise<Document[]> => {
    const response = await api.get(getApiPath('/documents/my'));
    return response.data;
  },

  getById: async (id: string): Promise<Document> => {
    const response = await api.get(getApiPath(`/documents/${id}`));
    return response.data;
  },

  create: async (data: CreateDocumentDto): Promise<Document> => {
    const formData = new FormData();
    
    // დავამატოთ ძირითადი ველები
    formData.append('evaluatorName', data.evaluatorName);
    formData.append('evaluatorLastName', data.evaluatorLastName);
    formData.append('objectName', data.objectName);
    formData.append('workDescription', data.workDescription);
    formData.append('date', data.date.toISOString());
    formData.append('time', data.time.toISOString());
    
    // დავამატოთ საფრთხეები
    data.hazards.forEach((hazard, hazardIndex) => {
      formData.append(`hazards[${hazardIndex}][hazardIdentification]`, hazard.hazardIdentification);
      formData.append(`hazards[${hazardIndex}][injuryDescription]`, hazard.injuryDescription);
      formData.append(`hazards[${hazardIndex}][existingControlMeasures]`, hazard.existingControlMeasures);
      formData.append(`hazards[${hazardIndex}][additionalControlMeasures]`, hazard.additionalControlMeasures);
      formData.append(`hazards[${hazardIndex}][requiredMeasures]`, hazard.requiredMeasures);
      formData.append(`hazards[${hazardIndex}][responsiblePerson]`, hazard.responsiblePerson);
      formData.append(`hazards[${hazardIndex}][reviewDate]`, hazard.reviewDate.toISOString());
      
      // დავამატოთ რისკები
      formData.append(`hazards[${hazardIndex}][initialRisk][probability]`, hazard.initialRisk.probability.toString());
      formData.append(`hazards[${hazardIndex}][initialRisk][severity]`, hazard.initialRisk.severity.toString());
      formData.append(`hazards[${hazardIndex}][initialRisk][total]`, hazard.initialRisk.total.toString());
      
      formData.append(`hazards[${hazardIndex}][residualRisk][probability]`, hazard.residualRisk.probability.toString());
      formData.append(`hazards[${hazardIndex}][residualRisk][severity]`, hazard.residualRisk.severity.toString());
      formData.append(`hazards[${hazardIndex}][residualRisk][total]`, hazard.residualRisk.total.toString());
      
      // დავამატოთ დაზარალებული პირები
      hazard.affectedPersons.forEach((person, personIndex) => {
        formData.append(`hazards[${hazardIndex}][affectedPersons][${personIndex}]`, person);
      });
      
      // დავამატოთ ფოტოები
      if (hazard.photos && Array.isArray(hazard.photos)) {
        hazard.photos.forEach((photo, _photoIndex) => {
          if (photo instanceof File) {
            formData.append(`hazardPhotos`, photo);
          }
        });
      }
    });

    const response = await api.post(getApiPath('/documents'), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (data: UpdateDocumentDto): Promise<Document> => {
    const formData = new FormData();
    
    // დავამატოთ ყველა ველი FormData-ში
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (typeof value === 'object' && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.patch(getApiPath(`/documents/${data.id}`), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(getApiPath(`/documents/${id}`));
  },

  toggleFavorite: async (id: string): Promise<Document> => {
    const response = await api.post(getApiPath(`/documents/${id}/favorite`));
    return response.data;
  },

  updateAssessment: async (
    id: string,
    assessmentA: number,
    assessmentSh: number,
    assessmentR: number,
  ): Promise<Document> => {
    const response = await api.patch(getApiPath(`/documents/${id}/assessment`), {
      assessmentA,
      assessmentSh,
      assessmentR,
    });
    return response.data;
  },

  downloadDocument: async (id: string): Promise<Blob> => {
    const response = await api.get(getApiPath(`/documents/${id}/download`), {
      responseType: 'blob',
    });
    return response.data;
  },

  downloadMultipleDocuments: async (ids: string[]): Promise<Blob> => {
    const response = await api.post(getApiPath('/documents/download-multiple'), { ids }, {
      responseType: 'blob',
    });
    return response.data;
  },
}; 