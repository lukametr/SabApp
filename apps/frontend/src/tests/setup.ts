import '@testing-library/jest-dom';
import { setupAuthMock, setupDocumentStoreMock, setupApiMock } from './helpers';

beforeEach(() => {
  setupAuthMock();
  setupDocumentStoreMock();
  setupApiMock();
});

afterEach(() => {
  jest.clearAllMocks();
}); 