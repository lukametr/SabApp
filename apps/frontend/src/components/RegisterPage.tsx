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

// Get Google Client ID from env (runtime check)
const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
console.log('[Google OAuth] NEXT_PUBLIC_GOOGLE_CLIENT_ID:', clientId);
import { signIn } from 'next-auth/react';

interface RegisterPageProps {
  onRegister?: (user: any) => void;
}


export default function RegisterPage({ onRegister }: RegisterPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      // For NextAuth credentials, we need to register with the backend first, then sign in
      const registrationResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          organization: formData.organization,
          position: formData.position,
        }),
      });

      if (!registrationResponse.ok) {
        const errorData = await registrationResponse.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // Now use NextAuth credentials provider to sign in
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess('რეგისტრაცია და შესვლა წარმატებით დასრულდა!');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'რეგისტრაციისას დაფიქსირდა შეცდომა');
    } finally {
      setLoading(false);
    }
  };

  // Google რეგისტრაცია/შესვლა NextAuth-ით
  const handleGoogleRegister = () => {
    signIn('google', { callbackUrl: '/' });
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

          <Box component="form" onSubmit={handleEmailRegister} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="სახელი"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
              />
              <TextField
                fullWidth
                label="გვარი"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
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
              autoComplete="organization"
            />
            
            <TextField
              fullWidth
              label="პოზიცია"
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
            onClick={handleGoogleRegister}
            disabled={loading || !clientId}
            sx={{ mb: 3 }}
          >
            Google-ით რეგისტრაცია
          </Button>

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
