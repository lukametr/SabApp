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
      // ნორმალიზება: ჩამოტვირთვების მრიცხველები ყოველთვის იყოს რიცხვი (ნაგულისხმევი 0)
      const normalized = documents.map((d: any) => ({
        ...d,
        downloadZipCount: Number(d?.downloadZipCount ?? 0) || 0,
        downloadExcelCount: Number(d?.downloadExcelCount ?? 0) || 0,
        downloadPdfCount: Number(d?.downloadPdfCount ?? 0) || 0,
      }));
      set({ documents: normalized as any, isLoading: false });
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
      const normalized = {
        ...document,
        downloadZipCount: Number((document as any)?.downloadZipCount ?? 0) || 0,
        downloadExcelCount: Number((document as any)?.downloadExcelCount ?? 0) || 0,
        downloadPdfCount: Number((document as any)?.downloadPdfCount ?? 0) || 0,
      } as any;
      set({ selectedDocument: normalized, isLoading: false });
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
      // ნორმალიზება ახალ დოკუმენტზე
      const normalized = {
        ...response,
        downloadZipCount: Number((response as any)?.downloadZipCount ?? 0) || 0,
        downloadExcelCount: Number((response as any)?.downloadExcelCount ?? 0) || 0,
        downloadPdfCount: Number((response as any)?.downloadPdfCount ?? 0) || 0,
      } as any;
      set((state) => ({
        documents: [...state.documents, normalized],
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
      const normalized = {
        ...updatedDocument,
        downloadZipCount: Number((updatedDocument as any)?.downloadZipCount ?? 0) || 0,
        downloadExcelCount: Number((updatedDocument as any)?.downloadExcelCount ?? 0) || 0,
        downloadPdfCount: Number((updatedDocument as any)?.downloadPdfCount ?? 0) || 0,
      } as any;
      console.log('✅ Store received updated document:', {
        id: updatedDocument.id,
        objectName: updatedDocument.objectName,
        hazardsCount: updatedDocument.hazards?.length || 0
      });
      
      set(state => ({
        documents: state.documents.map(doc =>
          doc.id === data.id ? normalized : doc
        ),
        selectedDocument: state.selectedDocument?.id === data.id ? normalized : state.selectedDocument,
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