import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
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
      <Typography variant="h1" color="primary">
        404
      </Typography>
      <Typography variant="h4" color="text.primary">
        გვერდი ვერ მოიძებნა
      </Typography>
      <Typography variant="body1" color="text.secondary">
        თქვენ მიერ მოძებნული გვერდი არ არსებობს.
      </Typography>
      <Link href="/" passHref>
        <Button variant="contained" sx={{ mt: 2 }}>
          მთავარ გვერდზე დაბრუნება
        </Button>
      </Link>
    </Box>
  );
}
