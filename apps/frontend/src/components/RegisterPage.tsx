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
  Checkbox
} from '@mui/material';
import { Google, Shield } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';

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
    personalNumber: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isGoogleRegistration, setIsGoogleRegistration] = useState(false);
  const [googleUserInfo, setGoogleUserInfo] = useState(null);

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

    // For Google registration, password is not required
    if (!isGoogleRegistration) {
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
    }

    if (!acceptTerms) {
      setError('საჭიროა წესებისა და პირობების მიღება');
      setLoading(false);
      return;
    }

    if (!formData.personalNumber) {
      setError('პირადი ნომერი აუცილებელია');
      setLoading(false);
      return;
    }

    if (!formData.phoneNumber) {
      setError('ტელეფონის ნომერი აუცილებელია');
      setLoading(false);
      return;
    }

    // Basic validation for personal number (11 digits)
    if (!/^\d{11}$/.test(formData.personalNumber)) {
      setError('პირადი ნომერი უნდა შეიცავდეს 11 ციფრს');
      setLoading(false);
      return;
    }

    // Basic validation for phone number
    if (!/^\d{9,15}$/.test(formData.phoneNumber)) {
      setError('ტელეფონის ნომერი უნდა შეიცავდეს 9-15 ციფრს');
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
        id: isGoogleRegistration ? (googleUserInfo as any)?.id : '1',
        organization: formData.organization,
        position: formData.position,
        personalNumber: formData.personalNumber,
        phoneNumber: formData.phoneNumber,
        picture: isGoogleRegistration ? (googleUserInfo as any)?.picture : undefined
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
          
          // Redirect to registration form with Google user info
          // User must complete registration with personal number and phone
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
              />
              <TextField
                fullWidth
                label="გვარი"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={isGoogleRegistration}
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
              label="პირადი ნომერი"
              name="personalNumber"
              value={formData.personalNumber}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              helperText="11 ციფრი"
              inputProps={{ maxLength: 11, pattern: '[0-9]*' }}
            />
            
            <TextField
              fullWidth
              label="ტელეფონის ნომერი"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              helperText="მაგ: 555123456"
              inputProps={{ maxLength: 15 }}
            />
            
            {!isGoogleRegistration && (
              <>
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
