'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  Link,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Google, Shield, Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { authApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

interface LoginPageProps {
  onLogin?: (user: any) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError('');
    // Retry the last action
    if (email && password) {
      handleEmailLogin({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setIsGoogleAccount(false);

    try {
      console.log('🔐 Login attempt:', { email, passwordLength: password.length });
      console.log('🔐 API URL:', process.env.NEXT_PUBLIC_API_URL);
      
      // Call the real backend API
      const response = await authApi.login({
        email: email,
        password: password,
      });
      
      if (response?.user && response.user.isEmailVerified === false) {
        setError('გთხოვთ, დაადასტურეთ ელფოსტა ანგარიშის გასააქტიურებლად');
        setLoading(false);
        return;
      }

      console.log('🔐 Login response received:', { 
        hasUser: !!response?.user, 
        hasToken: !!response?.accessToken,
        userEmail: response?.user?.email 
      });
      
      // Store in auth store
      login(response);
      console.log('🔐 Auth store updated');
      
      if (onLogin) {
        onLogin(response.user);
      }
      
      console.log('🔐 Navigating to dashboard...');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('🔐 Login error:', err);
      console.error('🔐 Error details:', { 
        message: err.message,
        stack: err.stack,
        response: err.response 
      });
      
      // უფრო დეტალური error messages
      if (err.message) {
        setError(err.message);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.code === 'GOOGLE_ACCOUNT_ONLY') {
        setIsGoogleAccount(true);
        setError('ეს ანგარიში შექმნილია Google-ით. გთხოვთ, გამოიყენოთ "Google-ით შესვლა" ღილაკი.');
      } else {
        setError('შესვლა ვერ მოხერხდა. სცადეთ მოგვიანებით.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      console.log('🔧 Google Login - Starting redirect flow...');
      
      // Use same redirect flow as RegisterPage
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const googleOAuthUrl = `${baseUrl}/auth/google`;
      
      console.log('🔧 Google Login - Redirecting to:', googleOAuthUrl);
      window.location.href = googleOAuthUrl;
    } catch (error) {
      console.error('Google login redirect error:', error);
      setError('Google-ით შესვლისას დაფიქსირდა შეცდომა');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <img src="/logo-3.jpg" alt="App logo" style={{ height: 40, marginBottom: 8 }} />
            <Typography variant="h6" color="text.secondary">
              შესვლა სისტემაში
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={handleRetry}>
                  თავიდან ცდა
                </Button>
              }
            >
              {error}
              {retryCount > 2 && (
                <Typography variant="caption" display="block" mt={1}>
                  თუ პრობლემა გრძელდება, დაუკავშირდით: info.sabapp@gmail.com
                </Typography>
              )}
              {isGoogleAccount && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Google />}
                    onClick={handleGoogleLogin}
                    sx={{
                      color: '#4285f4',
                      borderColor: '#4285f4',
                      '&:hover': {
                        backgroundColor: 'rgba(66, 133, 244, 0.1)',
                        borderColor: '#4285f4',
                      },
                    }}
                  >
                    Google-ით შესვლა
                  </Button>
                </Box>
              )}
            </Alert>
          )}

          {/* Google Login Button - moved to top */}
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<Google />}
            onClick={() => handleGoogleLogin()}
            disabled={loading}
            sx={{ 
              mb: 3,
              color: '#4285f4',
              borderColor: '#4285f4',
              '&:hover': {
                backgroundColor: 'rgba(66, 133, 244, 0.1)',
                borderColor: '#4285f4',
              },
            }}
          >
            Google-ით შესვლა
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              ან ელ. ფოსტით
            </Typography>
          </Divider>

          <Box component="form" onSubmit={handleEmailLogin} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label={email ? "" : "ელ. ფოსტა"}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={password ? "" : "პაროლი"}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'შესვლა'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              არ გაქვთ ანგარიში?{' '}
              <Link href="/auth/register" sx={{ cursor: 'pointer' }}>
                რეგისტრაცია
              </Link>
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Link 
              onClick={() => router.push('/')}
              sx={{ cursor: 'pointer', color: 'text.secondary' }}
            >
              ← დაბრუნება მთავარ გვერდზე
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
