'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  Button
} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();
  const content = `მომსახურების წესები და პირობები\n1. ზოგადი დებულებები\n1.1. სერვისის ოპერატორია ინდივიდუალური მეწარმე საბა ლოსაბერიძე, სსნ [01024074064], მისამართი: [ქ. თბილისი, იოანე პეტრიწის 1] (შემდგომში — „მეწარმე“).\n1.2. წინამდებარე მომსახურების წესები და პირობები (შემდგომში — „პირობები“) არეგულირებს მეწარმის მიერ ვებ-აპლიკაციის (შემდგომში — „პლატფორმა“ ან „სერვისი“) მიწოდებას და მომხმარებლის (შემდგომში — „მომხმარებელი“) უფლებებსა და ვალდებულებებს.\n1.3. სერვისით სარგებლობა დაშვებულია მხოლოდ ამ პირობებზე თანხმობის საფუძველზე. რეგისტრაციისა და/ან სერვისის გამოყენების ფაქტი წარმოადგენს მომხმარებლის თანხმობას წინამდებარე პირობებზე.\n\n2. ტერმინთა განმარტება\n...\n\n12. საკონტაქტო ინფორმაცია\nელ. ფოსტა: info.sabapp@gmail.com`;
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            წესები და პირობები
          </Typography>
          <Typography component="div" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
            {content}
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="contained" onClick={() => router.back()} sx={{ px: 4 }}>უკან დაბრუნება</Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
