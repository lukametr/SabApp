import { create } from 'zustand';
import { documents } from './api';

export interface Document {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface DocumentStore {
  documents: Document[];
  loading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  addDocument: (data: FormData) => Promise<void>;
  updateDocument: (id: string, data: FormData) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  loading: false,
  error: null,

  fetchDocuments: async () => {
    set({ loading: true, error: null });
    try {
      const data = await documents.getAll();
      set({ documents: data, loading: false });
    } catch (error) {
      set({ error: 'დოკუმენტების ჩატვირთვა ვერ მოხერხდა', loading: false });
    }
  },

  addDocument: async (data: FormData) => {
    set({ loading: true, error: null });
    try {
      const newDocument = await documents.create(data);
      set((state) => ({
        documents: [...state.documents, newDocument],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'დოკუმენტის დამატება ვერ მოხერხდა', loading: false });
    }
  },

  updateDocument: async (id: string, data: FormData) => {
    set({ loading: true, error: null });
    try {
      const updatedDocument = await documents.update(id, data);
      set((state) => ({
        documents: state.documents.map((doc) =>
          doc.id === id ? updatedDocument : doc
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'დოკუმენტის განახლება ვერ მოხერხდა', loading: false });
    }
  },

  deleteDocument: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await documents.delete(id);
      set((state) => ({
        documents: state.documents.filter((doc) => doc.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'დოკუმენტის წაშლა ვერ მოხერხდა', loading: false });
    }
  },
})); 