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
import { useGoogleLogin } from '@react-oauth/google';
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
      
      // Check if this is a Google-only account
      if (err.response?.data?.code === 'GOOGLE_ACCOUNT_ONLY') {
        setIsGoogleAccount(true);
        setError('ეს ანგარიში შექმნილია Google-ით. გთხოვთ, გამოიყენოთ "Google-ით შესვლა" ღილაკი.');
      } else {
        setIsGoogleAccount(false);
        setError(err.message || 'შესვლისას დაფიქსირდა შეცდომა');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        setLoading(true);
        console.log('🔧 Google Login - Auth code received:', !!codeResponse.code);
        
        // Send the authorization code to our backend
        try {
          const response = await authApi.googleCallback({
            code: codeResponse.code,
            state: 'login'
          });
          
          console.log('🔧 Google Login - Backend auth successful');
          
          if (onLogin) {
            onLogin(response.user);
          }
          
          router.push('/dashboard');
        } catch (backendError: any) {
          console.error('🔧 Google Login - Backend error:', backendError);
          if (backendError.response?.data?.code === 'REGISTRATION_REQUIRED') {
            // User needs to complete registration
            setError('Google ანგარიშით რეგისტრაცია საჭიროებს დამატებით ინფორმაციას. გთხოვთ, გადახვიდეთ რეგისტრაციის გვერდზე.');
          } else {
            setError('Google-ით შესვლისას დაფიქსირდა შეცდომა');
          }
        }
      } catch (error) {
        console.error('Google login error:', error);
        setError('Google-ით შესვლისას დაფიქსირდა შეცდომა');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google-ით შესვლისას დაფიქსირდა შეცდომა');
    }
  });

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
            <Shield sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              SabApp
            </Typography>
            <Typography variant="h6" color="text.secondary">
              შესვლა სისტემაში
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
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
