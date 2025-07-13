import { create } from 'zustand';
import { User, AuthResponse } from '../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true, // Start with loading true
  error: null,
  login: (data) => {
    set({ user: data.user, token: data.accessToken, loading: false });
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  },
  logout: () => {
    set({ user: null, token: null, loading: false });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  loadFromStorage: () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        set({ token, user: JSON.parse(user), loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
      set({ loading: false });
    }
  },
})); 