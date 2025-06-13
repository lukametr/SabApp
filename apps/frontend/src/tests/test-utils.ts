import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TestUser, TestDocument, TestAuthResponse, TestApiError } from './types';
import { TEST_CONFIG } from './config';

export const createTestUser = (overrides?: Partial<TestUser>): TestUser => ({
  id: TEST_CONFIG.USER_ID,
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

export const createTestDocument = (overrides?: Partial<TestDocument>): TestDocument => ({
  id: TEST_CONFIG.DOCUMENT_ID,
  title: 'Test Document',
  description: 'Test Description',
  fileUrl: TEST_CONFIG.FILE_NAME,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  userId: TEST_CONFIG.USER_ID,
  file: new File(['test'], TEST_CONFIG.FILE_NAME, { type: TEST_CONFIG.FILE_TYPE }),
  ...overrides,
});

export const createTestAuthResponse = (overrides?: Partial<TestAuthResponse>): TestAuthResponse => ({
  token: TEST_CONFIG.AUTH_TOKEN,
  user: createTestUser(),
  ...overrides,
});

export const createTestApiError = (overrides?: Partial<TestApiError>): TestApiError => ({
  message: TEST_CONFIG.ERROR_MESSAGE,
  status: TEST_CONFIG.ERROR_STATUS,
  ...overrides,
});

export const fillForm = async (formData: Record<string, string>) => {
  for (const [name, value] of Object.entries(formData)) {
    const input = screen.getByLabelText(new RegExp(name, 'i'));
    fireEvent.change(input, { target: { value } });
  }
};

export const submitForm = async (buttonText: string) => {
  const button = screen.getByText(new RegExp(buttonText, 'i'));
  fireEvent.click(button);
  await waitFor(() => {
    expect(button).toBeDisabled();
  });
};

export const expectFormError = (errorMessage: string) => {
  expect(screen.getByText(errorMessage)).toBeInTheDocument();
};

export const expectFormSuccess = (successMessage: string) => {
  expect(screen.getByText(successMessage)).toBeInTheDocument();
}; 