export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockDocument = {
  id: '1',
  title: 'Test Document',
  description: 'Test Description',
  fileUrl: 'test.pdf',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  userId: '1',
};

export const mockDocuments = [
  mockDocument,
  {
    ...mockDocument,
    id: '2',
    title: 'Test Document 2',
  },
];

export const mockAuthResponse = {
  token: 'test-token',
  user: mockUser,
};

export const mockApiError = {
  message: 'Test Error',
  status: 400,
}; 