import axios, { AxiosResponse, AxiosError } from 'axios';

// Use relative URL when served from backend, external URL for development
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Add request interceptor for JWT
api.interceptors.request.use(
  (config) => {
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
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
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

export default api; 