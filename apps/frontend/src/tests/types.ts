import { User, Document, AuthResponse, ApiError } from '@/types';

export interface TestUser extends User {
  password?: string;
}

export interface TestDocument extends Document {
  file?: File;
}

export interface TestAuthResponse extends AuthResponse {
  error?: string;
}

export interface TestApiError extends ApiError {
  details?: string;
}

export interface TestConfig {
  API_URL: string;
  AUTH_TOKEN: string;
  USER_ID: string;
  DOCUMENT_ID: string;
  FILE_NAME: string;
  FILE_SIZE: number;
  FILE_TYPE: string;
  ERROR_MESSAGE: string;
  ERROR_STATUS: number;
} 