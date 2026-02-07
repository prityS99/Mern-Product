'use client';

import { useEffect } from "react";
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
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";  // ✅ Fixed import
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product } from "@/types/product";

// Validation schema
const schema = yup.object({
  name: yup.string().required("Product name is required"),
  brand: yup.string().required("Brand is required").oneOf(["Mufti", "Adidas", "Rayman", "Levis"]),
  color: yup.string().required("Color is required").oneOf(["Black", "White", "Blue", "Red", "Grey"]),
  size: yup.string().required("Size is required").oneOf(["S", "M", "L", "XL", "XXL"]),
  price: yup.number().required("Price is required").positive("Price must be positive").integer("Price must be whole number"),
  image: yup.string().required("Image URL is required").url("Must be a valid URL"),

});

type FormData = yup.InferType<typeof schema>;

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();  // ✅ Can be null
  
  // ✅ FIXED: Safe ID extraction
  const id = params?.id as string;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // ✅ FIXED: Safe product fetching with loading state
  useEffect(() => {
    const fetchProduct = async () => {
      // Guard clause - no ID
      if (!id) {
        router.push("/products");
        return;
      }

      try {
        const res = await fetch(`http://localhost:3009/api/v1/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        
        const json = await res.json();
        const product = json.data;
        
        // Populate form with existing data
        Object.entries(product).forEach(([key, value]) => {
          setValue(key as keyof FormData, value as any);
        });
      } catch (error) {
        console.error("Failed to fetch product:", error);
        router.push("/products");
      }
    };

    fetchProduct();
  }, [id, setValue, router]);

  const onSubmit = async (data: FormData) => {
    if (!id) return; // Guard clause

    try {
      const res = await fetch(`http://localhost:3009/api/v1/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/products");
      } else {
        console.error("Update failed");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // ✅ Loading state while fetching
  if (!id) {
    return (
      <Box sx={{ bgcolor: "#FBFBFE", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

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
              Edit Product
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
                    inputProps={{ min: 0, step: "1" }}
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
                    {errors.brand && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.brand.message}
                      </Typography>
                    )}
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
                    {errors.size && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.size.message}
                      </Typography>
                    )}
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
                    {errors.color && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.color.message}
                      </Typography>
                    )}
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
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isSubmitting ? "Updating..." : "Update Product"}
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
