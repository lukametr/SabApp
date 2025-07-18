'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken, setUser } = useAuthStore();
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
        // Store token
        console.log('[Auth Callback] Storing token...');
        setToken(token);
        localStorage.setItem('token', token);

        // Decode JWT to get user info without an API call
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('[Auth Callback] Decoded token payload:', payload);

          // Create user object from JWT payload
          const userData = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            googleId: payload.googleId,
            name: payload.name || payload.email?.split('@')[0] || 'User',
            picture: payload.picture || null,
          };

          console.log('[Auth Callback] Setting user data:', userData);
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));

          // Redirect to dashboard
          console.log('[Auth Callback] Redirecting to dashboard...');
          router.push('/dashboard');
        } catch (decodeError) {
          console.error('[Auth Callback] Error decoding token:', decodeError);
          // Still try to redirect - the auth guard will handle validation
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('[Auth Callback] Unexpected error:', error);
        router.push('/login?error=callback_failed');
      }
    };

    handleCallback();
  }, [searchParams, router, setToken, setUser]);

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
