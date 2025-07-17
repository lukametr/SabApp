'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken, setUser, login } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      console.log('[Auth Callback] Processing...', { token: !!token, error });

      if (error) {
        console.error('[Auth Callback] Error:', error);
        router.push(`/login?error=${error}`);
        return;
      }

      if (token) {
        try {
          console.log('[Auth Callback] Setting token and logging in...');
          
          // Store token and set user data
          localStorage.setItem('token', token);
          setToken(token);
          
          // Fetch user data with the token
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            console.log('[Auth Callback] Login successful, redirecting to dashboard...');
            router.push('/dashboard');
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('[Auth Callback] Error processing token:', error);
          router.push('/login?error=callback_failed');
        }
      } else {
        console.error('[Auth Callback] No token received');
        router.push('/login?error=no_token');
      }
    };

    handleCallback();
  }, [searchParams, router, setToken, setUser]);

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
