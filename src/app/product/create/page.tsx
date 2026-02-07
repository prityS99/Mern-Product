'use client';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  Container,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Alert,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product } from "@/types/product";

// Validation Schema
const schema = yup.object({
  name: yup.string().required("Product name is required"),
  brand: yup.string().required("Brand is required").oneOf(["Mufti", "Adidas", "Rayman", "Levis"]),
  color: yup.string().required("Color is required").oneOf(["Black", "White", "Blue", "Red", "Grey"]),
  size: yup.string().required("Size is required").oneOf(["S", "M", "L", "XL", "XXL"]),
  price: yup.number().required("Price is required").positive("Price must be positive").integer("Price must be whole number"),
  image: yup.string().required("Image URL is required").url("Must be a valid URL"),
  description: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

export default function AddProduct() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("http://localhost:3009/api/v1/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/products");
        reset();
      }
    } catch (error) {
      console.error("Add product failed:", error);
    }
  };

  return (
    <Box sx={{ bgcolor: "#FBFBFE", minHeight: "100vh" }}>
      <Navbar />
      
      <Container maxWidth="md" sx={{ mt: 8, mb: 12 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{ mb: 4, color: "text.secondary" }}
        >
          Back to Products
        </Button>

        <Card elevation={0} sx={{ border: "1px solid #EAEAEA", borderRadius: "16px" }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Typography variant="h5" fontWeight={800} mb={3}>
              Add New Product
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Price (₹)"
                    type="number"
                    inputProps={{ min: 0, step: 1 }}
                    {...register("price", { valueAsNumber: true })}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth error={!!errors.brand}>
                    <InputLabel>Brand</InputLabel>
                    <Select label="Brand" {...register("brand")}>
                      {["Mufti", "Adidas", "Rayman", "Levis"].map((brand) => (
                        <MenuItem key={brand} value={brand}>
                          {brand}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.brand && <Typography variant="caption" color="error">{errors.brand.message}</Typography>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth error={!!errors.size}>
                    <InputLabel>Size</InputLabel>
                    <Select label="Size" {...register("size")}>
                      {["S", "M", "L", "XL", "XXL"].map((size) => (
                        <MenuItem key={size} value={size}>
                          {size}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.size && <Typography variant="caption" color="error">{errors.size.message}</Typography>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth error={!!errors.color}>
                    <InputLabel>Color</InputLabel>
                    <Select label="Color" {...register("color")}>
                      {["Black", "White", "Blue", "Red", "Grey"].map((color) => (
                        <MenuItem key={color} value={color}>
                          {color}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.color && <Typography variant="caption" color="error">{errors.color.message}</Typography>}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Image URL"
                    {...register("image")}
                    error={!!errors.image}
                    helperText={errors.image?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description (Optional)"
                    multiline
                    rows={3}
                    {...register("description")}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => router.push("/products")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ px: 4 }}
                >
                  {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </Box>
  );
}
