'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { Shield, CheckCircle, Error, Refresh } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '../services/api';

function EmailVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  
  // სწორი null handling
  const token = searchParams ? searchParams.get('token') : null;

  useEffect(() => {
    if (token && token.length > 0) {
      // Token format validation
      if (token.length < 10) {
        setError('არასწორი ვერიფიკაციის კოდი');
        setLoading(false);
        return;
      }
      verifyEmail();
    } else {
      setError('ვერიფიკაციის ტოკენი არ მოიძებნა');
      setLoading(false);
    }
  }, [token, retryCount]);

  const verifyEmail = async () => {
    if (!token) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await authApi.verifyEmail(token);
      if (response.success) {
        setSuccess(true);
        // ავტომატური გადამისამართება 3 წამში
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setError(response.message || 'ვერიფიკაცია ვერ შესრულდა');
      }
    } catch (err: any) {
      console.error('Email verification error:', err);
      
      // დეტალური error handling
      if (err.response?.status === 400) {
        setError('ვერიფიკაციის კოდი არასწორია ან ვადაგასულია');
      } else if (err.response?.status === 404) {
        setError('ვერიფიკაციის კოდი ვერ მოიძებნა');
      } else if (err.response?.status === 409) {
        setError('ელ. ფოსტა უკვე დადასტურებულია');
        setSuccess(true);
      } else if (err.code === 'NETWORK_ERROR' || !navigator.onLine) {
        setError('ინტერნეტ კავშირის პრობლემა. გთხოვთ სცადოთ თავიდან');
      } else {
        setError(err.message || 'ვერიფიკაციისას დაფიქსირდა შეცდომა');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleResendEmail = async () => {
    try {
      setLoading(true);
      // თუ გაქვთ resend email API
      // await authApi.resendVerificationEmail();
      alert('ახალი ვერიფიკაციის ლინკი გაიგზავნა თქვენს ელ. ფოსტაზე');
    } catch (err) {
      console.error('Resend email error:', err);
      alert('ხელახალი გაგზავნა ვერ მოხერხდა');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Shield sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img src="/logo-3.jpg" alt="logo" style={{ height: 56, objectFit: 'contain' }} />
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            ელ. ფოსტის ვერიფიკაცია
          </Typography>

          {loading && (
            <Box>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography>მიმდინარეობს ვერიფიკაცია...</Typography>
            </Box>
          )}

          {success && !loading && (
            <Box>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Alert severity="success" sx={{ mb: 3 }}>
                ელ. ფოსტა წარმატებით დადასტურდა! 
                {error !== 'ელ. ფოსტა უკვე დადასტურებულია' && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    3 წამში გადაგამისამართებთ შესვლის გვერდზე...
                  </Typography>
                )}
              </Alert>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/auth/login')}
                sx={{ mr: 2 }}
              >
                შესვლა
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/')}
              >
                მთავარი გვერდი
              </Button>
            </Box>
          )}

          {error && !success && !loading && (
            <Box>
              <Error sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                {error.includes('ინტერნეტ') && (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Refresh />}
                    onClick={handleRetry}
                    fullWidth
                  >
                    თავიდან ცდა
                  </Button>
                )}
                
                {(error.includes('ვადაგასულია') || error.includes('ვერ მოიძებნა')) && (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleResendEmail}
                    fullWidth
                  >
                    ახალი ლინკის გაგზავნა
                  </Button>
                )}
                
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => router.push('/auth/register')}
                    fullWidth
                  >
                    რეგისტრაცია
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => router.push('/')}
                    fullWidth
                  >
                    მთავარი
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

// Main component with Suspense wrapper
export default function EmailVerification() {
  return (
    <Suspense fallback={
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <CircularProgress />
      </Box>
    }>
      <EmailVerificationContent />
    </Suspense>
  );
}
