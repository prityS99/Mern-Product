'use client';

import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        mt: 8,
        py: 4,
        borderTop: "1px solid #E2E8F0",
        bgcolor: "#F8FAFC",
      }}
    >
      <Typography
        align="center"
        sx={{
          fontSize: "0.85rem",
          color: "#64748B",
        }}
      >
        © {new Date().getFullYear()} ProductHub. Built by Prity
      </Typography>
    </Box>
  );
}
