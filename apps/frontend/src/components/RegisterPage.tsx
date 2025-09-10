"use client";

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
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';

interface RegisterPageProps {
  onRegister?: (user: any) => void;
}

export default function RegisterPage({ onRegister }: RegisterPageProps) {
  const router = useRouter();
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
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    setError('');
    if (formData.email && formData.password && acceptTerms) {
      handleEmailRegister({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
      await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        organization: formData.organization,
        position: formData.position,
      });

      await authService.signIn(formData.email, formData.password);

      setSuccess('რეგისტრაცია და შესვლა წარმატებით დასრულდა!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'რეგისტრაციისას დაფიქსირდა შეცდომა');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <img src="/logo-3.jpg" alt="App logo" style={{ height: 40, marginBottom: 8 }} />
            <Typography variant="h6" color="text.secondary">
              რეგისტრაცია
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
                label={formData.firstName ? '' : 'სახელი'}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
              />
              <TextField
                fullWidth
                label={formData.lastName ? '' : 'გვარი'}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                autoComplete="family-name"
              />
            </Box>

            <TextField
              fullWidth
              label={formData.email ? '' : 'ელ. ფოსტა'}
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
              label={formData.organization ? '' : 'ორგანიზაცია'}
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              sx={{ mb: 2 }}
              autoComplete="organization"
            />

            <TextField
              fullWidth
              label={formData.position ? '' : 'პოზიცია'}
              name="position"
              value={formData.position}
              onChange={handleChange}
              sx={{ mb: 2 }}
              autoComplete="organization-title"
            />

            {/* Passwords */}
            <TextField
              fullWidth
              label={formData.password ? '' : 'პაროლი'}
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
              label={formData.confirmPassword ? '' : 'პაროლის დადასტურება'}
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
            <Link onClick={() => router.push('/')} sx={{ cursor: 'pointer', color: 'text.secondary' }}>
              ← დაბრუნება მთავარ გვერდზე
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
