'use client';

import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: "1.2rem",
            color: "#0F172A",
            cursor: "pointer",
          }}
          onClick={() => router.push("/")}
        >
          Product<span style={{ color: "#6366F1" }}>Hub</span>
        </Typography>

        <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
          <Button
            variant="text"
            onClick={() => router.push("AddProduct")}
            sx={{ fontWeight: 700 }}
          >
            Recently Deleted Items
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
