'use client';

import React, { useState, useEffect } from 'react';
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
import { Shield, CheckCircle, Error } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '../services/api';

export default function EmailVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setError('ვერიფიკაციის ტოკენი არ მოიძებნა');
      setLoading(false);
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await authApi.verifyEmail(token!);
      if (response.success) {
        setSuccess(true);
      } else {
        setError('ვერიფიკაცია ვერ შესრულდა');
      }
    } catch (err: any) {
      console.error('Email verification error:', err);
      setError(err.message || 'ვერიფიკაციისას დაფიქსირდა შეცდომა');
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
          <Typography variant="h4" gutterBottom>
            SabApp
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            ელ. ფოსტის ვერიფიკაცია
          </Typography>

          {loading && (
            <Box>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography>მიმდინარეობს ვერიფიკაცია...</Typography>
            </Box>
          )}

          {success && (
            <Box>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Alert severity="success" sx={{ mb: 3 }}>
                ელ. ფოსტა წარმატებით დადასტურდა! ახლა შეგიძლიათ შეხვიდეთ სისტემაში.
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

          {error && (
            <Box>
              <Error sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/auth/register')}
                sx={{ mr: 2 }}
              >
                რეგისტრაცია
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
        </Paper>
      </Container>
    </Box>
  );
}
