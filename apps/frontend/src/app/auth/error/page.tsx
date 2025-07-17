'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
} from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'ავტენტიფიკაციის კონფიგურაციის შეცდომა. გთხოვ, მიმართეთ ადმინისტრაციას.';
      case 'AccessDenied':
        return 'წვდომა უარყოფილია. შესაძლოა არ გაქვთ საკმარისი უფლებები.';
      case 'Verification':
        return 'ვერიფიკაციის შეცდომა. გთხოვ, სცადეთ ხელახლა.';
      case 'Default':
        return 'ავტენტიფიკაციის შეცდომა. გთხოვ, სცადეთ ხელახლა.';
      case 'OAuthSignin':
        return 'Google-ით შესვლის შეცდომა. შეამოწმეთ თქვენი Google ანგარიში.';
      case 'OAuthCallback':
        return 'Google ავტენტიფიკაციის callback შეცდომა.';
      case 'OAuthCreateAccount':
        return 'Google ანგარიშის შექმნის შეცდომა.';
      case 'EmailCreateAccount':
        return 'ელ. ფოსტით ანგარიშის შექმნის შეცდომა.';
      case 'Callback':
        return 'ავტენტიფიკაციის callback შეცდომა.';
      case 'OAuthAccountNotLinked':
        return 'ეს Google ანგარიში უკვე დაკავშირებულია სხვა ანგარიშთან.';
      case 'EmailSignin':
        return 'ელ. ფოსტით შესვლის შეცდომა.';
      case 'CredentialsSignin':
        return 'არასწორი მეილი ან პაროლი.';
      case 'SessionRequired':
        return 'ავტორიზაცია საჭიროა ამ გვერდთან წვდომისთვის.';
      default:
        return error || 'უცნობი ავტენტიფიკაციის შეცდომა.';
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
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              ავტენტიფიკაციის შეცდომა
            </Typography>
          </Box>

          <Alert severity="error" sx={{ mb: 3 }}>
            {getErrorMessage(error)}
          </Alert>

          {error && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                შეცდომის კოდი: {error}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => router.push('/auth/login')}
            >
              შესვლის გვერდზე დაბრუნება
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push('/')}
            >
              მთავარ გვერდზე
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
