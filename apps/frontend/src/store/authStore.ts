import { create } from 'zustand';
import { User, AuthResponse } from '../types/user';
import { authApi } from '../lib/api';

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
  fetchUserData: () => Promise<boolean>;
  isAuthenticated: boolean;
}

// Initialize auth state from localStorage
const initializeAuth = () => {
  if (typeof window === 'undefined') {
    return { token: null, user: null, isAuthenticated: false };
  }

  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      // Validate token expiration
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Convert to milliseconds

        if (Date.now() < exp) {
          console.log('🗃️ Valid token found in storage');
          return {
            token,
            user: JSON.parse(userStr),
            isAuthenticated: true,
          };
        } else {
          console.log('🗃️ Token expired, clearing storage');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (e) {
        console.error('🗃️ Error validating stored token:', e);
      }
    }
  } catch (error) {
    console.error('🗃️ Error initializing auth:', error);
  }

  return { token: null, user: null, isAuthenticated: false };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initializeAuth(),
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
    console.log('� Logging out...');
    
    // Clear all auth data
    set({ 
      user: null, 
      token: null, 
      loading: false,
      error: null
    });
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('🗃️ localStorage cleared');
      
      // Clear any Google session
      if (window.google?.accounts?.id) {
        try {
          (window.google.accounts.id as any).disableAutoSelect();
        } catch (e) {
          console.log('🔧 Could not disable Google auto-select:', e);
        }
      }
    }
    
    console.log('✅ Logout complete');
  },
  setUser: (user) => set({ user, isAuthenticated: !!user }),
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
  fetchUserData: async () => {
    console.log('🔄 Fetching user data from /auth/me...');
    
    // Only run on client side
    if (typeof window === 'undefined') {
      console.log('🔄 Server-side, skipping fetchUserData');
      return false;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('🔄 No token found, cannot fetch user data');
      return false;
    }

    try {
      const response = await authApi.me();
      console.log('✅ User data fetched successfully:', response.data);
      
      set({ 
        user: response.data, 
        loading: false,
        error: null 
      });
      
      // Update localStorage with fresh user data
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return true;
    } catch (error: any) {
      console.error('❌ Failed to fetch user data:', error);
      
      // If token is invalid, clear auth state
      if (error.response?.status === 401) {
        console.log('🔄 Token invalid, clearing auth state');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ 
          user: null, 
          token: null, 
          loading: false,
          error: 'Session expired' 
        });
      }
      
      return false;
    }
  },
}));