'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../../store/authStore';
import { authApi } from '../../../../lib/api';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      if (!searchParams) {
        setError('URL პარამეტრები არ მოიძებნა');
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }

      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      console.log('🔄 Google Callback received:', {
        hasCode: !!code,
        hasError: !!errorParam,
        codePrefix: code?.substring(0, 20) + '...',
      });

      if (errorParam) {
        console.error('❌ Google OAuth error:', errorParam);
        setError('Google ავტორიზაცია გაუქმდა');
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }

      if (!code) {
        console.error('❌ No authorization code received');
        setError('ავტორიზაციის კოდი არ მოიძებნა');
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }

      try {
        console.log('� Exchanging code for token...');

        // გაგზავნე authorization code backend-ზე token-ის მისაღებად
        const response = await authApi.googleCallback({ code });

        console.log('✅ Token exchange successful:', {
          hasUser: !!response.data.user,
          hasToken: !!response.data.accessToken,
          email: response.data.user?.email,
        });

        // შეინახე auth მონაცემები store-ში
        await login(response.data);

        console.log('🎉 Login successful, redirecting to dashboard...');
        router.push('/dashboard');
      } catch (error: any) {
        console.error('❌ Token exchange failed:', error);
        setError(error.message || 'ავტორიზაცია ვერ მოხერხდა');
        setTimeout(() => router.push('/auth/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, login, router]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      {error ? (
        <>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Typography variant="body2">გადამისამართება შესვლის გვერდზე...</Typography>
        </>
      ) : (
        <>
          <CircularProgress />
          <Typography variant="h6">Google ავტორიზაცია...</Typography>
          <Typography variant="body2">გთხოვთ დაელოდოთ</Typography>
        </>
      )}
    </Box>
  );
}
