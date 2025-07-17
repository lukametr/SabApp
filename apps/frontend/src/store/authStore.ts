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
    console.log('🗃️ AuthStore login:', { 
      hasUser: !!data?.user, 
      hasToken: !!data?.accessToken,
      userEmail: data?.user?.email 
    });
    
    set({ user: data.user, token: data.accessToken, loading: false });
    
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      console.log('🗃️ Saving to localStorage:', { 
        token: data.accessToken?.substring(0, 20) + '...',
        user: data.user?.email 
      });
      
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    console.log('🗃️ AuthStore state updated');
  },
  logout: () => {
    console.log('🗃️ AuthStore logout - clearing data');
    set({ user: null, token: null, loading: false });
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('🗃️ localStorage cleared');
    }
  },
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  loadFromStorage: () => {
    console.log('🗃️ Loading from localStorage...');
    
    // Prevent multiple simultaneous calls
    if (typeof window === 'undefined') {
      console.log('🗃️ Server-side rendering, skipping localStorage');
      set({ loading: false });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('🗃️ Storage data found:', { 
        hasToken: !!token, 
        hasUser: !!user,
        tokenPrefix: token?.substring(0, 20) + '...' || 'none'
      });
      
      if (token && user) {
        const parsedUser = JSON.parse(user);
        console.log('🗃️ Restored user from storage:', parsedUser.email);
        
        // Validate that the token is not expired (basic check)
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const isExpired = tokenPayload.exp * 1000 < Date.now();
          
          if (isExpired) {
            console.log('🗃️ Token expired, clearing storage');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ user: null, token: null, loading: false });
            return;
          }
        } catch (tokenError) {
          console.error('🗃️ Error parsing token:', tokenError);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          set({ user: null, token: null, loading: false });
          return;
        }
        
        set({ token, user: parsedUser, loading: false });
      } else {
        console.log('🗃️ No valid storage data found');
        set({ loading: false });
      }
    } catch (error) {
      console.error('🗃️ Error loading from storage:', error);
      // Clear potentially corrupted data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, loading: false });
    }
  },
}));