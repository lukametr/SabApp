'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { loadFromStorage, fetchUserData, token, user } = useAuthStore();

  useEffect(() => {
    console.log('🔐 AuthProvider: Initializing auth state...');
    
    // First load from localStorage for immediate UI
    loadFromStorage();
    
    // Then fetch fresh data from database if we have a token
    const initializeAuth = async () => {
      // Wait a bit for loadFromStorage to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        console.log('🔐 AuthProvider: Found token, fetching fresh user data from DB...');
        try {
          const success = await fetchUserData();
          console.log('🔐 AuthProvider: Fresh data fetch result:', success);
        } catch (error) {
          console.error('🔐 AuthProvider: Failed to fetch fresh data:', error);
        }
      } else {
        console.log('🔐 AuthProvider: No token found, skipping DB fetch');
      }
    };
    
    initializeAuth();
  }, []); // Only on mount, once globally

  return <>{children}</>;
}
