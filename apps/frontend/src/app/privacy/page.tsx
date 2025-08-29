"use client";

import React from 'react';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();
  const content = `კონფიდენციალურობის პოლიტიკა\n\nეს დოკუმენტი აღწერს როგორ ვაგროვებთ, ვიყენებთ და ვიცავთ თქვენს მონაცემებს sabapp პლატფორმაზე. დამატებითი კითხვების შემთხვევაში დაგვიკავშირდით privacy@sabapp.com მისამართზე.`;
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            კონფიდენციალურობის პოლიტიკა
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
            ბოლო განახლება: 2025 წლის 28 აგვისტო
          </Typography>
          <Typography component="div" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{content}</Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="contained" onClick={() => router.back()}>უკან დაბრუნება</Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
