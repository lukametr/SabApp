import api from '../../lib/api';
import { Document, CreateDocumentDto, UpdateDocumentDto } from '../../types/document';

export const documentApi = {
  getAll: async (): Promise<Document[]> => {
    const response = await api.get('/documents');
    console.log('📋 Fetched documents:', response.data.map((doc: Document) => ({ id: doc.id, objectName: doc.objectName })));
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
    // Process hazards - photos are already base64 encoded in photos array
    const processedHazards = data.hazards.map(hazard => {
      const processedHazard = {
        ...hazard,
        reviewDate: hazard.reviewDate ? hazard.reviewDate.toISOString() : null, // Convert Date to ISO string or null
        photos: hazard.photos || [] as string[] // Keep base64 photos as they are
      };
      
      console.log('🔄 [API] Processing hazard for create:', {
        id: hazard.id,
        hazardIdentification: hazard.hazardIdentification || 'EMPTY',
        photosCount: hazard.photos?.length || 0
      });
      
      return processedHazard;
    });

    // Build JSON payload directly like update does
    const createPayload = {
      evaluatorName: data.evaluatorName,
      evaluatorLastName: data.evaluatorLastName,
      objectName: data.objectName,
      workDescription: data.workDescription,
      date: data.date.toISOString(),
      time: data.time.toISOString(),
      hazards: processedHazards,
      photos: data.photos || []
    };

    console.log('📋 Creating document with payload:', {
      hazardsCount: processedHazards.length,
      photosCount: createPayload.photos.length
    });

    const response = await api.post('/documents', createPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📋 Created document response:', {
      id: response.data.id,
      hazardsCount: response.data.hazards?.length || 0,
      photosCount: response.data.photos?.length || 0
    });
    
    return response.data;
  },

  update: async (data: UpdateDocumentDto): Promise<Document> => {
    // Build JSON payload directly; hazards and photos stay as arrays
    const updatePayload: any = {};
    if (data.evaluatorName) updatePayload.evaluatorName = data.evaluatorName;
    if (data.evaluatorLastName) updatePayload.evaluatorLastName = data.evaluatorLastName;
    if (data.objectName) updatePayload.objectName = data.objectName;
    if (data.workDescription) updatePayload.workDescription = data.workDescription;
    if (data.date) updatePayload.date = data.date.toISOString();
    if (data.time) updatePayload.time = data.time.toISOString();

    if (Array.isArray(data.hazards)) {
      updatePayload.hazards = data.hazards.map(hazard => ({
        ...hazard,
        reviewDate: hazard.reviewDate ? hazard.reviewDate.toISOString() : null,
        photos: hazard.photos || []
      }));
    }

    if (data.photos !== undefined) {
      updatePayload.photos = data.photos; // base64 strings or URLs
    }

    console.log('📋 Updating document with ID:', data.id, {
      hazardsCount: Array.isArray(updatePayload.hazards) ? updatePayload.hazards.length : 'UNCHANGED',
      photosCount: Array.isArray(updatePayload.photos) ? updatePayload.photos.length : 'UNCHANGED'
    });

    const response = await api.patch(`/documents/${data.id}`, updatePayload);
    
    console.log('📋 Updated document response:', {
      id: response.data.id,
      hazardsCount: response.data.hazards?.length || 0,
      photosCount: response.data.photos?.length || 0
    });
    
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    console.log('🗑️ API delete called with ID:', id);
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