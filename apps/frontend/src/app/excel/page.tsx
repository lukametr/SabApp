'use client';

import { Box, Container } from '@mui/material';
import ExcelAnalyzer from '../../components/ExcelAnalyzer';

export default function ExcelPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <ExcelAnalyzer />
      </Box>
    </Container>
  );
}
