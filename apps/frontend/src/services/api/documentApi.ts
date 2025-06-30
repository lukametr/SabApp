import api from '../../lib/api';
import { Document, CreateDocumentDto, UpdateDocumentDto } from '../../types/document';

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

  create: async (data: CreateDocumentDto): Promise<Document> => {
    const formData = new FormData();
    
    // Add text fields
    formData.append('evaluatorName', data.evaluatorName);
    formData.append('evaluatorLastName', data.evaluatorLastName);
    formData.append('objectName', data.objectName);
    formData.append('workDescription', data.workDescription);
    formData.append('date', data.date.toISOString());
    formData.append('time', data.time.toISOString());

    // Add hazards data
    if (data.hazards && data.hazards.length > 0) {
      data.hazards.forEach((hazard, _index) => {
        formData.append('hazards', JSON.stringify(hazard));
      });
    }

    // Add photos if they exist
    if (data.photos && data.photos.length > 0) {
      data.photos.forEach((photo, _index) => {
        if (photo instanceof File) {
          formData.append('photos', photo);
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

  update: async (data: UpdateDocumentDto): Promise<Document> => {
    const formData = new FormData();
    
    // Add text fields
    if (data.evaluatorName) formData.append('evaluatorName', data.evaluatorName);
    if (data.evaluatorLastName) formData.append('evaluatorLastName', data.evaluatorLastName);
    if (data.objectName) formData.append('objectName', data.objectName);
    if (data.workDescription) formData.append('workDescription', data.workDescription);
    if (data.date) formData.append('date', data.date.toISOString());
    if (data.time) formData.append('time', data.time.toISOString());

    // Add hazards data
    if (data.hazards && data.hazards.length > 0) {
      data.hazards.forEach((hazard, _index) => {
        formData.append('hazards', JSON.stringify(hazard));
      });
    }

    // Add photos if they exist
    if (data.photos && data.photos.length > 0) {
      data.photos.forEach((photo, _index) => {
        if (photo instanceof File) {
          formData.append('photos', photo);
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

  downloadDocument: async (id: string): Promise<Blob> => {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  downloadMultipleDocuments: async (ids: string[]): Promise<Blob> => {
    const response = await api.post('/documents/download', { ids }, {
      responseType: 'blob',
    });
    return response.data;
  },
}; 