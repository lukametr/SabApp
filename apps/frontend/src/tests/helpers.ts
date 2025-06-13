import { mockUser, mockDocument, mockDocuments, mockAuthResponse, mockApiError } from './mocks';

export const setupAuthMock = (isAuthenticated = true) => {
  const mockLogin = jest.fn().mockResolvedValue(mockAuthResponse);
  const mockRegister = jest.fn().mockResolvedValue(mockAuthResponse);
  const mockLogout = jest.fn();

  jest.mock('@/contexts', () => ({
    useAuth: () => ({
      user: isAuthenticated ? mockUser : null,
      loading: false,
      login: mockLogin,
      register: mockRegister,
      logout: mockLogout,
    }),
  }));

  return {
    mockLogin,
    mockRegister,
    mockLogout,
  };
};

export const setupDocumentStoreMock = () => {
  const mockFetchDocuments = jest.fn().mockResolvedValue(mockDocuments);
  const mockAddDocument = jest.fn().mockResolvedValue(mockDocument);
  const mockUpdateDocument = jest.fn().mockResolvedValue(mockDocument);
  const mockDeleteDocument = jest.fn().mockResolvedValue(undefined);

  jest.mock('@/lib/store', () => ({
    useDocumentStore: () => ({
      documents: mockDocuments,
      loading: false,
      error: null,
      fetchDocuments: mockFetchDocuments,
      addDocument: mockAddDocument,
      updateDocument: mockUpdateDocument,
      deleteDocument: mockDeleteDocument,
    }),
  }));

  return {
    mockFetchDocuments,
    mockAddDocument,
    mockUpdateDocument,
    mockDeleteDocument,
  };
};

export const setupApiMock = () => {
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockPut = jest.fn();
  const mockDelete = jest.fn();

  jest.mock('@/lib/api', () => ({
    auth: {
      login: mockPost,
      register: mockPost,
      getProfile: mockGet,
    },
    documents: {
      getAll: mockGet,
      getById: mockGet,
      create: mockPost,
      update: mockPut,
      delete: mockDelete,
      download: mockGet,
    },
  }));

  return {
    mockGet,
    mockPost,
    mockPut,
    mockDelete,
  };
}; 