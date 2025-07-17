'use client';
// minor: trigger redeploy

import React, { useState, useEffect } from 'react';
// ინტერფეისი GoogleUserInfo
interface GoogleUserInfo {
  id?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  // No access_token or idToken, only code
  code?: string;
  [key: string]: any;
}
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
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Google, Shield, Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '../services/auth.service';
import { authApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

// Get Google Client ID from env (runtime check)
const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
console.log('[Google OAuth] NEXT_PUBLIC_GOOGLE_CLIENT_ID:', clientId);

interface RegisterPageProps {
  onRegister?: (user: any) => void;
}


export default function RegisterPage({ onRegister }: RegisterPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    position: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // No Google registration completion logic needed with NextAuth

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!acceptTerms) {
      setError('საჭიროა წესებისა და პირობების მიღება');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('პაროლები არ ემთხვევა');
      setLoading(false);
      return;
    }
    if (!formData.password) {
      setError('პაროლი აუცილებელია');
      setLoading(false);
      return;
    }
    try {
      // რეგისტრაცია backend-ზე (ახლა არ იცემს JWT token)
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        organization: formData.organization,
        position: formData.position,
      });

      // თუ requiresEmailVerification არის true, მაშინ email verification საჭიროა
      if (response.requiresEmailVerification) {
        setSuccess('რეგისტრაცია წარმატებით დასრულდა! გთხოვთ, შეამოწმოთ ელ. ფოსტა ანგარიშის დასადასტურებლად.');
        // არ ვასვლით სისტემაში, მომხმარებელმა email უნდა დაადასტუროს
      } else {
        // თუ email verification არ არის საჭირო (Google users), მაშინ შევდივართ
        await authService.signIn(formData.email, formData.password);
        setSuccess('რეგისტრაცია და შესვლა წარმატებით დასრულდა!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'რეგისტრაციისას დაფიქსირდა შეცდომა');
    } finally {
      setLoading(false);
    }
  };

  // Google რეგისტრაცია useGoogleLogin hook-ით
  const handleGoogleRegister = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        setLoading(true);
        console.log('🔧 Google Register - Auth code received:', !!codeResponse.code);
        
        // Send the authorization code to our backend
        const response = await authApi.googleCallback({
          code: codeResponse.code,
          state: 'register'
        });
        
        console.log('🔧 Google Register - Backend auth successful');
        
        // Store in auth store and redirect to dashboard
        login(response);
        
        if (onRegister) {
          onRegister(response.user);
        }
        
        setSuccess('Google-ით რეგისტრაცია წარმატებით დასრულდა!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } catch (error: any) {
        console.error('Google register error:', error);
        setError('Google-ით რეგისტრაციისას დაფიქსირდა შეცდომა');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      setError('Google-ით რეგისტრაციისას დაფიქსირდა შეცდომა');
    }
  });

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
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Shield sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              SabApp
            </Typography>
            <Typography variant="h6" color="text.secondary">
              რეგისტრაცია
            </Typography>
          </Box>


          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {!clientId && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Google რეგისტრაცია მიუწვდომელია: NEXT_PUBLIC_GOOGLE_CLIENT_ID არ არის ხელმისაწვდომი გარემოში!<br />
              გთხოვ შეამოწმე გარემოს ცვლადი deployment settings-ში.
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {/* Google Registration Button - moved to top */}
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<Google />}
            onClick={() => handleGoogleRegister()}
            disabled={loading || !clientId}
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
            Google-ით რეგისტრაცია
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              ან ელ. ფოსტით
            </Typography>
          </Divider>

          <Box component="form" onSubmit={handleEmailRegister} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label={formData.firstName ? "" : "სახელი"}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
              />
              <TextField
                fullWidth
                label={formData.lastName ? "" : "გვარი"}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                autoComplete="family-name"
              />
            </Box>
            
            <TextField
              fullWidth
              label={formData.email ? "" : "ელ. ფოსტა"}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              autoComplete="email"
            />
            
            <TextField
              fullWidth
              label={formData.organization ? "" : "ორგანიზაცია"}
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              sx={{ mb: 2 }}
              autoComplete="organization"
            />
            
            <TextField
              fullWidth
              label={formData.position ? "" : "პოზიცია"}
              name="position"
              value={formData.position}
              onChange={handleChange}
              sx={{ mb: 2 }}
              autoComplete="organization-title"
            />
            
            {/* Password fields - always shown for credentials registration */}
            <>
              <TextField
                  fullWidth
                  label={formData.password ? "" : "პაროლი"}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  fullWidth
                  label={formData.confirmPassword ? "" : "პაროლის დადასტურება"}
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  ვეთანხმები{' '}
                  <Link href="/terms" sx={{ textDecoration: 'none' }}>
                    წესებსა და პირობებს
                  </Link>
                </Typography>
              }
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'რეგისტრაცია'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              უკვე გაქვთ ანგარიში?{' '}
              <Link href="/auth/login" sx={{ cursor: 'pointer' }}>
                შესვლა
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
