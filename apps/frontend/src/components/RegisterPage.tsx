'use client';

import React, { useState, useEffect } from 'react';
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
import { authApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

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
  const [isGoogleRegistration, setIsGoogleRegistration] = useState(false);
  const [googleUserInfo, setGoogleUserInfo] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if this is a Google registration completion
  useEffect(() => {
    const fromGoogle = searchParams.get('from') === 'google';
    const userInfo = searchParams.get('userInfo');
    
    if (fromGoogle && userInfo) {
      try {
        const parsedUserInfo = JSON.parse(decodeURIComponent(userInfo));
        setIsGoogleRegistration(true);
        setGoogleUserInfo(parsedUserInfo);
        setFormData(prev => ({
          ...prev,
          firstName: parsedUserInfo.given_name || '',
          lastName: parsedUserInfo.family_name || '',
          email: parsedUserInfo.email || ''
        }));
      } catch (error) {
        console.error('Error parsing Google user info:', error);
      }
    }
  }, [searchParams]);

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

    if (isGoogleRegistration) {
      // Google-ით რეგისტრაციის დასრულება
      try {
        if (!googleUserInfo || !googleUserInfo.id) {
          setError('Google მომხმარებლის ინფორმაცია ვერ მოიძებნა');
          setLoading(false);
          return;
        }
        // აქ შეგიძლია გამოიყენო idToken ან accessToken, თუ გაქვს შენახული
        // მაგალითად, თუ googleUserInfo-ში არის idToken:
        // const response = await authApi.googleAuth({ idToken: googleUserInfo.idToken });
        // მაგრამ შენს კოდში მხოლოდ userInfo მოდის, ამიტომ accessToken უნდა შეინახო useState-ში Google login-ის დროს
        // აქ ვამოწმებთ accessToken-ს
        if (!googleUserInfo.access_token && !googleUserInfo.idToken) {
          setError('Google accessToken/idToken ვერ მოიძებნა');
          setLoading(false);
          return;
        }
        const idToken = googleUserInfo.idToken || googleUserInfo.access_token;
        const response = await authApi.googleAuth({ idToken });
        setSuccess('Google-ით რეგისტრაცია წარმატებით დასრულდა!');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } catch (err: any) {
        setError(err.message || 'Google-ით რეგისტრაციისას დაფიქსირდა შეცდომა');
      } finally {
        setLoading(false);
      }
      return;
    }

    // ჩვეულებრივი რეგისტრაცია
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
      const response = await authApi.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        organization: formData.organization,
        position: formData.position,
      });
      setSuccess('რეგისტრაცია წარმატებით დასრულდა! გთხოვთ გადაამოწმოთ ელფოსტა და დაადასტუროთ ანგარიში.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        organization: '',
        position: ''
      });
      setAcceptTerms(false);
    } catch (err: any) {
      setError(err.message || 'რეგისტრაციისას დაფიქსირდა შეცდომა');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        // Get user info from Google
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: 'application/json'
            }
          }
        );

        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          // access_token/idToken დაამატე userInfo-ში
          userInfo.access_token = tokenResponse.access_token;
          if (tokenResponse.id_token) {
            userInfo.idToken = tokenResponse.id_token;
          }
          const userInfoParam = encodeURIComponent(JSON.stringify(userInfo));
          router.push(`/auth/register?from=google&userInfo=${userInfoParam}`);
        }
      } catch (error) {
        console.error('Google registration error:', error);
        setError('Google-ით რეგისტრაციისას დაფიქსირდა შეცდომა');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
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
              {isGoogleRegistration ? 'რეგისტრაციის დასრულება' : 'რეგისტრაცია'}
            </Typography>
            {isGoogleRegistration && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Google-ით ავტორიზაციისთვის საჭიროა დამატებითი ინფორმაცია
              </Typography>
            )}
          </Box>


          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleEmailRegister} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="სახელი"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={isGoogleRegistration}
                autoComplete="given-name"
              />
              <TextField
                fullWidth
                label="გვარი"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={isGoogleRegistration}
                autoComplete="family-name"
              />
            </Box>
            
            <TextField
              fullWidth
              label="ელ. ფოსტა"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isGoogleRegistration}
              sx={{ mb: 2 }}
              autoComplete="email"
            />
            
            <TextField
              fullWidth
              label="ორგანიზაცია"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="პოზიცია"
              name="position"
              value={formData.position}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            
            
            {!isGoogleRegistration && (
              <>
                <TextField
                  fullWidth
                  label="პაროლი"
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
                  label="პაროლის დადასტურება"
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
            )}
            
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
              {loading ? <CircularProgress size={24} /> : (isGoogleRegistration ? 'რეგისტრაციის დასრულება' : 'რეგისტრაცია')}
            </Button>
          </Box>

          {!isGoogleRegistration && (
            <>
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  ან
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<Google />}
                onClick={() => handleGoogleRegister()}
                disabled={loading}
                sx={{ mb: 3 }}
              >
                Google-ით რეგისტრაცია
              </Button>
            </>
          )}

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
