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
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Google, Shield } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';

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
    position: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

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

    if (formData.password !== formData.confirmPassword) {
      setError('პაროლები არ ემთხვევა');
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('საჭიროა წესებისა და პირობების მიღება');
      setLoading(false);
      return;
    }

    try {
      // TODO: Implement email/password registration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      
      // Mock user data
      const user = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        id: '1',
        organization: formData.organization,
        position: formData.position
      };
      
      if (onRegister) {
        onRegister(user);
      }
      
      router.push('/dashboard');
    } catch (err) {
      setError('რეგისტრაციისას დაფიქსირდა შეცდომა');
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
          const user = {
            name: userInfo.name,
            email: userInfo.email,
            id: userInfo.id,
            picture: userInfo.picture
          };
          
          if (onRegister) {
            onRegister(user);
          }
          
          router.push('/dashboard');
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
              SafetyApp
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

          <Box component="form" onSubmit={handleEmailRegister} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="სახელი"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="გვარი"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
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
            
            <TextField
              fullWidth
              label="პაროლი"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="პაროლის დადასტურება"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
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
                  <Link href="#" sx={{ textDecoration: 'none' }}>
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
            onClick={() => handleGoogleRegister()}
            disabled={loading}
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
