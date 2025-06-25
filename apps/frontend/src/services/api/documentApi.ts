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

    const response = await api.post('/documents', formData, {
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
    assessmentR: number,
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
    const response = await api.post('/documents/download-multiple', { ids }, {
      responseType: 'blob',
    });
    return response.data;
  },
}; 