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
  Divider
} from '@mui/material';
import { Google, Shield } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';

interface LoginPageProps {
  onLogin?: (user: any) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Implement email/password login
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      
      // Mock user data
      const user = {
        name: 'გიორგი ბერიძე',
        email: email,
        id: '1'
      };
      
      if (onLogin) {
        onLogin(user);
      }
      
      router.push('/dashboard');
    } catch (err) {
      setError('შესვლისას დაფიქსირდა შეცდომა');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
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
          
          if (onLogin) {
            onLogin(user);
          }
          
          router.push('/dashboard');
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
              SafetyApp
            </Typography>
            <Typography variant="h6" color="text.secondary">
              შესვლა სისტემაში
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleEmailLogin} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="ელ. ფოსტა"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="პაროლი"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
              {loading ? <CircularProgress size={24} /> : 'შესვლა'}
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
            onClick={() => handleGoogleLogin()}
            disabled={loading}
            sx={{ mb: 3 }}
          >
            Google-ით შესვლა
          </Button>

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
