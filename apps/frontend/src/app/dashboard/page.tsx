'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import Dashboard from '../../components/Dashboard';
import { Box, CircularProgress } from '@mui/material';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, token, loading, loadFromStorage } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔐 Dashboard: Initializing authentication...');
      
      // Load from storage first
      loadFromStorage();
      
      // Give some time for auth to initialize
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log('🔐 Dashboard state:', {
        loading,
        isAuthenticated,
        hasToken: !!token,
        hasUser: !!user,
      });
      
      setIsInitialized(true);
    };

    if (!isInitialized) {
      initializeAuth();
    }
  }, [loadFromStorage, isInitialized]);

  useEffect(() => {
    if (!isInitialized || loading) {
      return; // Still initializing
    }

    console.log('🔐 Dashboard: Checking authentication after initialization');
    console.log('🔐 Auth state:', { isAuthenticated, hasToken: !!token, hasUser: !!user });

    // Check authentication
    if (!isAuthenticated || !token || !user) {
      console.log('❌ Not authenticated, redirecting to login');
      router.push('/auth/login');
      return;
    }

    // Validate token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;

      if (Date.now() >= exp) {
        console.log('❌ Token expired, redirecting to login');
        // Clear expired auth
        useAuthStore.getState().logout();
        router.push('/auth/login');
        return;
      }

      console.log('✅ Authentication valid, showing dashboard');
    } catch (error) {
      console.error('❌ Invalid token:', error);
      useAuthStore.getState().logout();
      router.push('/auth/login');
    }
  }, [isInitialized, loading, isAuthenticated, token, user, router]);

  // Show loading while initializing or if still loading
  if (!isInitialized || loading || !isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <Dashboard />;
}
