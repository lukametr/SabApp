import axios from 'axios';
import { Document, CreateDocumentDto, UpdateDocumentDto } from '../types/document';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://saba-api.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

  create: async (data: CreateDocumentDto, file?: File): Promise<Document> => {
    console.log('გაგზავნილი მონაცემები:', data, file);
    const processedData = {
      ...data,
      initialRisk: {
        probability: Number(data.initialRisk.probability),
        severity: Number(data.initialRisk.severity),
        total: Number(data.initialRisk.total)
      },
      residualRisk: {
        probability: Number(data.residualRisk.probability),
        severity: Number(data.residualRisk.severity),
        total: Number(data.residualRisk.total)
      },
      time: new Date(data.time).toLocaleTimeString(),
      date: new Date(data.date).toISOString(),
      reviewDate: new Date(data.reviewDate).toISOString(),
      authorId: '000000000000000000000000' // დროებითი ID
    };
    console.log('ფორმატირებული მონაცემები:', processedData);
    const response = await api.post<Document>('/documents', processedData);
    const document = response.data;
    return {
      ...document,
      id: document.id,
      date: new Date(document.date),
      reviewDate: new Date(document.reviewDate), 
      createdAt: new Date(document.createdAt),
      updatedAt: new Date(document.updatedAt)
    };
  },

  update: async (data: UpdateDocumentDto): Promise<Document> => {
    const response = await api.put(`/documents/${data.id}`, data);
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