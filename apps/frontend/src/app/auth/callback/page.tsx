'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken, setUser, fetchUserData } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      if (!searchParams) {
        console.error('[Auth Callback] No search params available');
        router.push('/login?error=invalid_callback');
        return;
      }

      const token = searchParams.get('token');
      const errorParam = searchParams.get('error');

      console.log('[Auth Callback] Processing...', { token: !!token, error: errorParam });

      if (errorParam) {
        console.error('[Auth Callback] Error from backend:', errorParam);
        router.push(`/login?error=${errorParam}`);
        return;
      }

      if (!token) {
        console.error('[Auth Callback] No token received');
        router.push('/login?error=no_token');
        return;
      }

      try {
        // Store token first
        setToken(token);
        localStorage.setItem('token', token);
        console.log('[Auth Callback] Token stored');

        // Try to fetch user data using the new authStore method
        const success = await fetchUserData();
        
        if (success) {
          console.log('[Auth Callback] User data fetched successfully');
        } else {
          console.warn('[Auth Callback] fetchUserData failed, but continuing');
        }
        
        // Always redirect to dashboard - the app will handle auth validation there
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);

      } catch (error) {
        console.error('[Auth Callback] Error:', error);
        // Don't fail completely, try to proceed
        router.push('/dashboard');
      }
    };

    handleCallback();
  }, [searchParams, router, setToken, setUser, fetchUserData]);

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        შესვლა...
      </Typography>
    </Box>
  );
}
