'use client';

import { Box, Typography, Container } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: '#f5f5f5', py: 3, mt: 6 }}>
      <Container>
        <Typography align="center" variant="body2" color="text.secondary">
          © {new Date().getFullYear()} MyStore. Built the right way.
        </Typography>
      </Container>
    </Box>
  );
}
