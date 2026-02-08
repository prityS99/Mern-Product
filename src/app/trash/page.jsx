"use client";
import { useEffect, useState } from "react";
import {
  getDeletedProducts,
  restoreProduct,
} from "@/services/productServices";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  Chip,
} from "@mui/material";
import RestoreFromTrashOutlined from "@mui/icons-material/RestoreFromTrashOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

export default function Trash() {
  const [trash, setTrash] = useState([]);

  useEffect(() => {
    getDeletedProducts().then((res) =>
      setTrash(res.data.data || [])
    );
  }, []);

  const handleRestore = async (id) => {
    await restoreProduct(id);
    setTrash((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F4F7F9", py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800}>
            Trash
          </Typography>
          <Typography color="text.secondary">
            Deleted products are kept here until restored
          </Typography>
        </Box>

        {/* Empty State */}
        {trash.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              color: "text.secondary",
            }}
          >
            <DeleteOutline sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h6">Trash is empty</Typography>
            <Typography variant="body2">
              Deleted products will appear here
            </Typography>
          </Box>
        )}

        {/* Trash Grid */}
        <Grid container spacing={3}>
          {trash.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  opacity: 0.85,
                }}
              >
                {/* Image (optional) */}
                {item.image && (
                  <CardMedia
                    component="img"
                    height={220}
                    image={item.image}
                    sx={{
                      objectFit: "cover",
                      filter: "grayscale(100%)",
                    }}
                  />
                )}

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography fontWeight={600} gutterBottom>
                    {item.name}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    {item.brand && (
                      <Chip
                        size="small"
                        label={item.brand}
                        variant="outlined"
                      />
                    )}
                    {item.size && (
                      <Chip
                        size="small"
                        label={item.size}
                        variant="outlined"
                      />
                    )}
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                  >
                    Deleted on{" "}
                    {item.deletedAt
                      ? new Date(item.deletedAt).toLocaleDateString()
                      : "—"}
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<RestoreFromTrashOutlined />}
                    onClick={() => handleRestore(item._id)}
                  >
                    Restore
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
