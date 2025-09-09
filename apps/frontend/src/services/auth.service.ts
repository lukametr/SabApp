import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sabapp.com/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  async signIn(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'შესვლა ვერ მოხერხდა');
    }
  },

  async signUp(data: any) {
    try {
      const response = await api.post('/auth/register', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'რეგისტრაცია ვერ მოხერხდა');
    }
  },

  async googleAuth(tokenResponse: any) {
    try {
      const response = await api.post('/auth/google', {
        token: tokenResponse.access_token,
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Google ავტორიზაცია ვერ მოხერხდა');
    }
  },

  async logout() {
    localStorage.removeItem('token');
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'პროფილის ჩატვირთვა ვერ მოხერხდა');
    }
  },
};

export default api;
