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

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            წესები და პირობები
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            1. ზოგადი დებულებები
          </Typography>
          <Typography variant="body1" paragraph>
            SabApp პლატფორმის გამოყენებით თქვენ ეთანხმებით ქვემოთ მოცემულ წესებსა და პირობებს. 
            ეს პლატფორმა შექმნილია უსაფრთხოების ოფიცრებისთვის დოკუმენტების მართვისა და შეფასების ფორმების შესავსებად.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            2. მომხმარებლის უფლებები და მოვალეობები
          </Typography>
          <Typography variant="body1" paragraph>
            • თქვენ ვალდებული ხართ მიაწოდოთ ზუსტი და სწორი ინფორმაცია რეგისტრაციისას
          </Typography>
          <Typography variant="body1" paragraph>
            • პლატფორმის გამოყენება მხოლოდ კანონიერი მიზნებისთვის
          </Typography>
          <Typography variant="body1" paragraph>
            • სხვისი ანგარიშის გამოყენება აკრძალულია
          </Typography>
          <Typography variant="body1" paragraph>
            • თქვენი ანგარიშის უსაფრთხოება თქვენი პასუხისმგებლობაა
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            3. მონაცემთა დაცვა
          </Typography>
          <Typography variant="body1" paragraph>
            ჩვენ ვიცავთ თქვენს პირად მონაცემებს საქართველოს კანონმდებლობის შესაბამისად. 
            თქვენი მონაცემები გამოიყენება მხოლოდ სერვისის გაუმჯობესების მიზნით.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            4. დოკუმენტების მართვა
          </Typography>
          <Typography variant="body1" paragraph>
            • შექმნილი დოკუმენტები მიეკუთვნება მომხმარებელს
          </Typography>
          <Typography variant="body1" paragraph>
            • თითოეული მომხმარებელი წვდომას იღებს მხოლოდ საკუთარ დოკუმენტებზე
          </Typography>
          <Typography variant="body1" paragraph>
            • პლატფორმა არ არის პასუხისმგებელი დოკუმენტების შინაარსზე
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            5. სერვისის ხელმისაწვდომობა
          </Typography>
          <Typography variant="body1" paragraph>
            ჩვენ ვცდილობთ უზრუნველვყოთ სერვისის 24/7 ხელმისაწვდომობა, მაგრამ ვერ გავრანტებთ 
            100% ხელმისაწვდომობას ტექნიკური სამუშაოების ან სხვა გაუთვალისწინებელი გარემოებების გამო.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            6. პასუხისმგებლობის შეზღუდვა
          </Typography>
          <Typography variant="body1" paragraph>
            SabApp არ არის პასუხისმგებელი პირდაპირ ან არაპირდაპირ ზიანზე, რომელიც შეიძლება 
            წარმოიშვას პლატფორმის გამოყენების შედეგად.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            7. ცვლილებები
          </Typography>
          <Typography variant="body1" paragraph>
            ჩვენ ვიტოვებთ უფლებას შევცვალოთ ეს წესები და პირობები ნებისმიერ დროს. 
            მნიშვნელოვანი ცვლილებების შემთხვევაში მომხმარებლები იქნებიან გაფრთხილებული.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            8. კონტაქტი
          </Typography>
          <Typography variant="body1" paragraph>
            კითხვების შემთხვევაში დაგვიკავშირდით: info@sabap.ge
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
            ბოლო განახლება: 2025 წლის 7 იანვარი
          </Typography>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              onClick={() => router.back()}
              sx={{ px: 4 }}
            >
              უკან დაბრუნება
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
