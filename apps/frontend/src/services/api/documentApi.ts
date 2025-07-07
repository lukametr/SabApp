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

    // Process hazards and extract photos
    const hazardPhotos: File[] = [];
    const processedHazards = data.hazards.map(hazard => {
      const processedHazard = {
        ...hazard,
        photos: [] as string[] // Remove File objects, will be added by backend
      };
      
      // Extract photos from hazard
      if ((hazard as any).mediaFile) {
        hazardPhotos.push((hazard as any).mediaFile);
      }
      
      return processedHazard;
    });

    // Add processed hazards data
    formData.append('hazards', JSON.stringify(processedHazards));

    // Add hazard photos
    hazardPhotos.forEach((photo, index) => {
      formData.append('hazardPhotos', photo);
    });

    // Add general photos if they exist
    if (data.photos && data.photos.length > 0) {
      data.photos.forEach((photo, _index) => {
        // Universal check for File type (works in browser and Node build)
        if ((photo as any) && typeof photo === 'object' && (photo as any).constructor && (photo as any).constructor.name === 'File') {
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
        // Universal check for File type (works in browser and Node build)
        if ((photo as any) && typeof photo === 'object' && (photo as any).constructor && (photo as any).constructor.name === 'File') {
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

// Helper function no longer needed - photos are stored as base64 in database
// export const getPhotoUrl = (filename: string): string => {
//   const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
//   return `${baseUrl}/documents/files/${filename}`;
// };