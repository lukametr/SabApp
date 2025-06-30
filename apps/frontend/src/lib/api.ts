import axios, { AxiosResponse, AxiosError } from 'axios';

// Use relative URL when served from backend, external URL for development
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use relative URL for production, external for development
    if (process.env.NODE_ENV === 'production') {
      return '/api'; // Relative URL when served from same domain
    } else {
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    }
  } else {
    // Server-side: use environment variable
    return process.env.NEXT_PUBLIC_API_URL || 'https://saba-app-production.up.railway.app/api';
  }
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
    'Accept': 'application/json',
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
      fullURL: error.config?.url ? `${error.config?.baseURL}/${error.config?.url}`.replace(/\/+/g, '/') : error.config?.baseURL,
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