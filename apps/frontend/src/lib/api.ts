import axios, { AxiosResponse, AxiosError } from 'axios';

// Prefer relative URL in browser so Next.js rewrites proxy to backend.
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  // On server, still respect env for SSR/server actions
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
};

const API_URL = getApiUrl();

console.log('🔧 API Configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  API_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  isClient: typeof window !== 'undefined',
});

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Add request interceptor for JWT
api.interceptors.request.use(
  (config) => {
    // Ensure proper URL construction
    if (config.url && !config.url.startsWith('http')) {
      config.url = config.url.replace(/^\/+/, ''); // Remove leading slashes
    }

    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: config.url ? `${config.baseURL}/${config.url}`.replace(/\/+/g, '/') : config.baseURL,
    });

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config?.url
        ? `${error.config?.baseURL}/${error.config?.url}`.replace(/\/+/g, '/')
        : error.config?.baseURL,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  me: () => api.get('/auth/me'),
  login: async (credentials: { email: string; password: string }) => {
    try {
      console.log('🔄 Attempting login to:', `${API_URL}/auth/login`);

      const response = await api.post('/auth/login', credentials);
      console.log('✅ Login successful');
      return response;
    } catch (error: any) {
      console.error('❌ Login error:', error);

      if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
        throw new Error('კავშირი სერვერთან ვერ დამყარდა. შეამოწმეთ ინტერნეტ კავშირი.');
      } else if (error.response?.status === 0) {
        throw new Error('კავშირი სერვერთან ვერ დამყარდა. გთხოვთ შეამოწმოთ ინტერნეტი.');
      } else if (error.response?.status === 401) {
        throw new Error('არასწორი ელ.ფოსტა ან პაროლი');
      } else if (error.response?.status === 404) {
        throw new Error('API მისამართი ვერ მოიძებნა. დაუკავშირდით ადმინისტრატორს.');
      } else if (error.response?.status === 500) {
        throw new Error('სერვერის შეცდომა. სცადეთ მოგვიანებით.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(`შეცდომა: ${error.response?.status || error.message}`);
      }
    }
  },
  register: async (userData: any) => {
    try {
      console.log('🔄 Attempting registration to:', `${API_URL}/auth/register`);

      const response = await api.post('/auth/register', userData);
      console.log('✅ Registration successful');
      return response;
    } catch (error: any) {
      console.error('❌ Registration error:', error);

      if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
        throw new Error('სერვერთან კავშირი ვერ დამყარდა. შეამოწმეთ ინტერნეტ კავშირი.');
      } else if (error.response?.status === 0) {
        throw new Error('კავშირი სერვერთან ვერ დამყარდა. გთხოვთ შეამოწმოთ ინტერნეტი.');
      } else if (error.response?.status === 404) {
        throw new Error('API მისამართი ვერ მოიძებნა. დაუკავშირდით ადმინისტრატორს.');
      } else if (error.response?.status === 500) {
        throw new Error('სერვერის შეცდომა. სცადეთ მოგვიანებით.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(`შეცდომა: ${error.response?.status || error.message}`);
      }
    }
  },
  googleCallback: (data: { code: string; state?: string }) =>
    api.post('/auth/google/callback', data),
  updateProfile: (data: {
    name?: string;
    organization?: string | null;
    position?: string | null;
    phoneNumber?: string | null;
  }) => api.patch('/auth/profile', data),
};

export default api;
