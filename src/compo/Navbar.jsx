'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

export default function Navbar() {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={700}>
          MyStore
        </Typography>

        <Box>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Products</Button>
          <Button color="inherit">Contact</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
