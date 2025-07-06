'use client';

import { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        textAlign: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h4" color="error">
        რაღაც არასწორად წავიდა!
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {error.message || 'მოხდა გაუთვალისწინებელი შეცდომა'}
      </Typography>
      <Button
        variant="contained"
        onClick={reset}
        sx={{ mt: 2 }}
      >
        თავიდან სცადეთ
      </Button>
    </Box>
  );
}
