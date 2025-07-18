'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import Dashboard from '../../components/Dashboard';
import { Box, CircularProgress } from '@mui/material';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated || !token) {
      console.log('❌ Not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    // Validate token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;

      if (Date.now() >= exp) {
        console.log('❌ Token expired, redirecting to login');
        router.push('/login');
        return;
      }

      console.log('✅ Authentication valid');
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Invalid token:', error);
      router.push('/login');
    }
  }, [isAuthenticated, token, router]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <Dashboard />;
}
