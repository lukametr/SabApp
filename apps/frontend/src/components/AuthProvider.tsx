'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { loadFromStorage } = useAuthStore();

  useEffect(() => {
    console.log('🔐 AuthProvider: Initializing auth state from storage...');
    loadFromStorage();
  }, []); // Only on mount, once globally

  return <>{children}</>;
}
