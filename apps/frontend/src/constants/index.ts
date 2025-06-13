export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DOCUMENTS: '/documents',
  ABOUT: '/about',
  CONTACT: '/contact',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  DOCUMENTS: {
    BASE: '/documents',
    DOWNLOAD: (id: string) => `/documents/${id}/download`,
  },
};

export const FILE_TYPES = {
  PDF: 'application/pdf',
  WORD: 'application/msword',
  EXCEL: 'application/vnd.ms-excel',
  IMAGE: 'image/*',
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'ეს ველი სავალდებულოა',
  INVALID_EMAIL: 'არასწორი ელ-ფოსტის ფორმატი',
  INVALID_PASSWORD: 'პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს',
  FILE_TOO_LARGE: 'ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს',
  INVALID_FILE_TYPE: 'არასწორი ფაილის ტიპი',
  NETWORK_ERROR: 'ქსელური შეცდომა',
  SERVER_ERROR: 'სერვერის შეცდომა',
  UNAUTHORIZED: 'ავტორიზაცია საჭიროა',
  FORBIDDEN: 'არ გაქვთ წვდომა',
  NOT_FOUND: 'ვერ მოიძებნა',
}; 