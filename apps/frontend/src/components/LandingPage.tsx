'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Stack,
  Chip,
  useTheme
} from '@mui/material';
import { 
  Security, 
  Assignment, 
  GetApp, 
  Shield, 
  Speed, 
  Phone, 
  ArrowForward
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const theme = useTheme();
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  const steps = [
    {
      icon: <Security sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'დარეგისტრირდი',
      description: 'შექმენი ანგარიში უსაფრთხოების პლატფორმაზე'
    },
    {
      icon: <Assignment sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'შეავსე ფორმა',
      description: 'დეტალურად შეაფასე ობიექტი და საფრთხეები'
    },
    {
      icon: <GetApp sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'გადმოწერე',
      description: 'ფორმები PDF/Excel ფორმატში'
    }
  ];

  const features = [
    {
      icon: <Speed sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'დროის ეკონომია',
      description: 'სწრაფი ფორმების შევსება და გადმოწერა'
    },
    {
      icon: <Phone sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'მობილური წვდომა',
      description: 'მუშაობს ყველა მოწყობილობაზე'
    },
    {
      icon: <Shield sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'უსაფრთხო შენახვა',
      description: 'თქვენი მონაცემები დაცულია'
    },
    {
      icon: <Assignment sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'ავტომატური ფორმატირება',
      description: 'პროფესიონალური PDF დოკუმენტები'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Hero Section */}
      <Box sx={{ 
        backgroundColor: 'white', 
        py: 8,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                შეაფასე უსაფრთხოება ციფრულად
              </Typography>
              <Typography variant="h6" component="p" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
                შეავსე, შეინახე და გააზიარე შენივე შემოწმების ფორმები ონლაინ რეჟიმში
              </Typography>
              <Button 
                variant="contained" 
                size="large" 
                onClick={handleGetStarted}
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' },
                  py: 2,
                  px: 4
                }}
                endIcon={<ArrowForward />}
              >
                დაიწყე ახლავე
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                borderRadius: 2, 
                p: 4,
                textAlign: 'center'
              }}>
                <Security sx={{ fontSize: 120, opacity: 0.8 }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  უსაფრთხოების შეფასება
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Steps Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            როგორ მუშაობს სისტემა
          </Typography>
          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card elevation={2} sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={index + 1} 
                        color="primary" 
                        sx={{ mb: 2, fontSize: 18, fontWeight: 'bold' }} 
                      />
                      {step.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom>
                      {step.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            რატომ ჩვენ?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card elevation={1} sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Demo Section */}
      <Box sx={{ py: 8, backgroundColor: '#f9f9f9' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            ნიმუშის ხილვა
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card elevation={3}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    ფორმის ავსების მაგალითი
                  </Typography>
                  <Box sx={{ 
                    backgroundColor: '#f5f5f5', 
                    p: 3, 
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">შემფასებელი:</Typography>
                      <Typography variant="body2">გიორგი ბერიძე</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">ობიექტი:</Typography>
                      <Typography variant="body2">ოფისი №1</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">საფრთხეები:</Typography>
                      <Typography variant="body2">5 გამოვლენილი</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card elevation={3}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    გადმოწერილი დოკუმენტი
                  </Typography>
                  <Box sx={{ 
                    backgroundColor: '#e3f2fd', 
                    p: 3, 
                    borderRadius: 1,
                    textAlign: 'center'
                  }}>
                    <GetApp sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      უსაფრთხოების_შეფასება.pdf
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      პროფესიონალური ფორმატირება
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        py: 8, 
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom>
            დარეგისტრირდი ახლავე
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
             შეავსე ფორმები სწრაფად და მარტივად
          </Typography>
          <Button 
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
              py: 2,
              px: 6
            }}
          >
            რეგისტრაცია
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#333', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Shield sx={{ mr: 1 }} />
                <Typography variant="h6">SabApp</Typography>
              </Box>
              <Typography variant="body2" color="grey.400">
                უსაფრთხოების შეფასების ციფრული პლატფორმა
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                სერვისები
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="grey.400">შეფასების ფორმები</Typography>
                <Typography variant="body2" color="grey.400">PDF რეპორტები</Typography>
                <Typography variant="body2" color="grey.400">Excel ექსპორტი</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                კავშირი
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="grey.400">მხარდაჭერა</Typography>
                <Typography variant="body2" color="grey.400">წესები და პირობები</Typography>
                <Typography variant="body2" color="grey.400">კონფიდენციალურობა</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
