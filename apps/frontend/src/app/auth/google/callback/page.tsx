'use client';

import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function RemovedGoogleCallbackPage() {
  return (
    <Box
      sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Google შესვლა გამორთულია
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          გამოიყენეთ ელფოსტა და პაროლი შესაყვანი.
        </Typography>
        <Button component={Link} href="/auth/login" variant="contained">
          შესვლა
        </Button>
      </Box>
    </Box>
  );
}
