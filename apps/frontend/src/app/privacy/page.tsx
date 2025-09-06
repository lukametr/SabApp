"use client";

import React from 'react';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();
  const content = `კონფიდენციალურობის პოლიტიკა

ეს დოკუმენტი აღწერს როგორ ვაგროვებთ, ვიყენებთ და ვიცავთ თქვენს მონაცემებს SABA პლატფორმაზე.

1. მონაცემების აღება
   • იუზერის მონაცემები: სახელი, ელ. ფოსტა, კომპანიის ინფორმაცია
   • დოკუმენტის მონაცემები: ლოკაცია, რისკების შეფასება, ფოტო მასალები
   • ტექნიკური მონაცემები: IP მისამართი, ბრაუზერის ინფორმაცია

2. მონაცემების გამოყენება
   • რისკების შეფასების დოკუმენტების შექმნა
   • სტატისტიკის წარმოება
   • სისტემის უსაფრთხოება

3. მონაცემების დაცვა
   • ყველა მონაცემი დაცული არის TLS შიფრაციით
   • მდებარეობს უსაფრთხო სერვერებზე
   • წვდომა მხოლოდ ავტორიზებულ პერსონალს

4. მონაცემების გაზიარება
   • მონაცემები არ ვუზიარებთ მესამე მხარეს
   • გამონაკლისი: იურიდიული მოთხოვნილება

5. თქვენი უფლებები
   • წვდომა შენს მონაცემებზე
   • წაშლის მოთხოვნა
   • განახლების მოთხოვნა

დამატებითი კითხვების შემთხვევაში დაგვიკავშირდით: support@sabapp.com`;
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            კონფიდენციალურობის პოლიტიკა
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
            ბოლო განახლება: 2025 წლის 6 სექტემბერი
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
