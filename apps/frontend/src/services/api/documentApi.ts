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
    console.log('📤 SENDING TO BACKEND:', JSON.stringify(data, null, 2));
    console.log('📤 DATA TYPES:', {
      date: data.date,
      dateType: typeof data.date,
      time: data.time,
      timeType: typeof data.time,
      photos: data.photos,
      hazards: data.hazards?.length || 0
    });
    
    // თუ time არის string ფორმატში "HH:mm", გარდაქმენი Date-ად
    let timeValue = data.time;
    if (typeof data.time === 'string' && /^\d{1,2}:\d{2}$/.test(data.time)) {
      const [hours, minutes] = (data.time as string).split(':').map(Number);
      const timeDate = new Date(data.date);
      timeDate.setHours(hours, minutes, 0, 0);
      timeValue = timeDate;
    }

    // Process hazards - photos are already base64 encoded in photos array
    const processedHazards = data.hazards.map(hazard => {
      const processedHazard = {
        ...hazard,
        reviewDate: hazard.reviewDate ? hazard.reviewDate.toISOString() : undefined,
        photos: hazard.photos || []
      };
      
      console.log('🔄 [API] Processing hazard for create:', {
        id: hazard.id,
        hazardIdentification: hazard.hazardIdentification || 'EMPTY',
        photosCount: hazard.photos?.length || 0
      });
      
      return processedHazard;
    });

    // გარდაქმენი date და time ISO string-ებად
    const createPayload = {
      evaluatorName: data.evaluatorName,
      evaluatorLastName: data.evaluatorLastName,
      objectName: data.objectName,
      workDescription: data.workDescription,
      date: data.date instanceof Date ? data.date.toISOString() : data.date,
      time: timeValue instanceof Date ? timeValue.toISOString() : timeValue,
      reviewDate: data.reviewDate instanceof Date ? data.reviewDate.toISOString() : data.reviewDate,
      hazards: processedHazards,
      photos: data.photos || []
    };
    
    console.log('📤 FINAL PAYLOAD:', JSON.stringify(createPayload, null, 2));

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
    if (data.reviewDate !== undefined) {
      updatePayload.reviewDate = data.reviewDate instanceof Date ? data.reviewDate.toISOString() : data.reviewDate;
    }

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