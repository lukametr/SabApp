import { create } from 'zustand';
import { Document, CreateDocumentDto, UpdateDocumentDto } from '../types/document';
import { documentApi } from '../services/api/documentApi';

interface DocumentStore {
  documents: Document[];
  selectedDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  fetchMyDocuments: () => Promise<void>;
  getDocument: (id: string) => Promise<void>;
  createDocument: (data: CreateDocumentDto, file?: File) => Promise<void>;
  updateDocument: (data: UpdateDocumentDto) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  updateAssessment: (id: string, assessmentA: number, assessmentSh: number, assessmentR: number) => Promise<void>;
  downloadDocument: (id: string) => Promise<Blob>;
  downloadMultipleDocuments: (ids: string[]) => Promise<Blob>;
  setSelectedDocument: (document: Document | null) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  selectedDocument: null,
  isLoading: false,
  error: null,

  fetchDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      const documents = await documentApi.getAll();
      set({ documents, isLoading: false });
    } catch (error) {
      set({ error: 'დოკუმენტების ჩატვირთვა ვერ მოხერხდა', isLoading: false });
    }
  },

  fetchMyDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      const documents = await documentApi.getMyDocuments();
      set({ documents, isLoading: false });
    } catch (error) {
      set({ error: 'დოკუმენტების ჩატვირთვა ვერ მოხერხდა', isLoading: false });
    }
  },

  getDocument: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const document = await documentApi.getById(id);
      set({ selectedDocument: document, isLoading: false });
    } catch (error) {
      set({ error: 'დოკუმენტის ჩატვირთვა ვერ მოხერხდა', isLoading: false });
    }
  },

  createDocument: async (data: CreateDocumentDto, file?: File) => {
    try {
      set({ isLoading: true, error: null });
      console.log('დოკუმენტის შექმნა:', data, file);
      const response = await documentApi.create(data);
      console.log('პასუხი:', response);
      set((state) => ({
        documents: [...state.documents, response],
        isLoading: false
      }));
    } catch (error) {
      console.error('დოკუმენტის შექმნის შეცდომა:', error);
      set({ isLoading: false, error: 'დოკუმენტის შექმნა ვერ მოხერხდა' });
    }
  },

  updateDocument: async (data: UpdateDocumentDto) => {
    set({ isLoading: true, error: null });
    try {
      console.log('📋 Store updating document:', data.id);
      const updatedDocument = await documentApi.update(data);
      console.log('✅ Store received updated document:', {
        id: updatedDocument.id,
        objectName: updatedDocument.objectName,
        hazardsCount: updatedDocument.hazards?.length || 0
      });
      
      set(state => ({
        documents: state.documents.map(doc =>
          doc.id === data.id ? updatedDocument : doc
        ),
        selectedDocument: state.selectedDocument?.id === data.id ? updatedDocument : state.selectedDocument,
        isLoading: false
      }));
    } catch (error) {
      console.error('❌ Store document update failed:', error);
      set({ error: 'დოკუმენტის განახლება ვერ მოხერხდა', isLoading: false });
    }
  },

  deleteDocument: async (id: string) => {
    console.log('🗑️ Document store delete called with ID:', id);
    set({ isLoading: true, error: null });
    try {
      await documentApi.delete(id);
      set(state => ({
        documents: state.documents.filter(doc => doc.id !== id),
        selectedDocument: state.selectedDocument?.id === id ? null : state.selectedDocument,
        isLoading: false
      }));
    } catch (error) {
      console.error('❌ Delete error:', error);
      set({ error: 'დოკუმენტის წაშლა ვერ მოხერხდა', isLoading: false });
    }
  },

  toggleFavorite: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedDocument = await documentApi.toggleFavorite(id);
      set(state => ({
        documents: state.documents.map(doc =>
          doc.id === id ? updatedDocument : doc
        ),
        selectedDocument: state.selectedDocument?.id === id ? updatedDocument : state.selectedDocument,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'დოკუმენტის სტატუსის განახლება ვერ მოხერხდა', isLoading: false });
    }
  },

  updateAssessment: async (id: string, assessmentA: number, assessmentSh: number, assessmentR: number) => {
    set({ isLoading: true, error: null });
    try {
      const updatedDocument = await documentApi.updateAssessment(id, assessmentA, assessmentSh, assessmentR);
      set(state => ({
        documents: state.documents.map(doc =>
          doc.id === id ? updatedDocument : doc
        ),
        selectedDocument: state.selectedDocument?.id === id ? updatedDocument : state.selectedDocument,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'შეფასების განახლება ვერ მოხერხდა', isLoading: false });
    }
  },

  downloadDocument: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const blob = await documentApi.downloadDocument(id);
      set({ isLoading: false });
      return blob;
    } catch (error) {
      set({ error: 'დოკუმენტის ჩამოტვირთვა ვერ მოხერხდა', isLoading: false });
      throw error;
    }
  },

  downloadMultipleDocuments: async (ids: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const blob = await documentApi.downloadMultipleDocuments(ids);
      set({ isLoading: false });
      return blob;
    } catch (error) {
      set({ error: 'დოკუმენტების ჩამოტვირთვა ვერ მოხერხდა', isLoading: false });
      throw error;
    }
  },

  setSelectedDocument: (document: Document | null) => {
    set({ selectedDocument: document });
  },
})); 