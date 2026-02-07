'use client';

import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Container,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Stack,
  Link as MuiLink,
} from "@mui/material";
import { DeleteOutline, Edit, FilterAltOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product } from "@/types/product";

// Filter Constants
const SIZES = ["S", "M", "L", "XL", "XXL"];
const BRANDS = ["Mufti", "Adidas", "Rayman", "Levis"];
const COLORS = ["Black", "White", "Blue", "Red", "Grey"];

export default function Page() {
  const router = useRouter();

  /* STATE */
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    size: [] as string[],
    color: [] as string[],
    brand: [] as string[],
    maxPrice: "",
  });
  const [toast, setToast] = useState({
    open: false,
    msg: "",
    type: "success" as "success" | "error" | "info"
  });

  /* FETCH PRODUCTS */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3009/api/v1/products");
        const json = await res.json();
        setProducts(json.data || []);
      } catch {
        setToast({ open: true, msg: "Failed to load products", type: "error" });
      }
    };
    fetchProducts();
  }, []);

  /* DELETE */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:3009/api/v1/products/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setToast({ open: true, msg: "Product removed", type: "info" });
      }
    } catch {
      setToast({ open: true, msg: "Delete failed", type: "error" });
    }
  };

  const handleToggleFilter = (stateKey: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[stateKey] as string[];
      const isExist = currentValues.includes(value);

      return {
        ...prev,
        [stateKey]: isExist
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };
    });
  };

  /* FILTER LOGIC */
  const filteredProducts = products.filter((item) => {
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchesSize = filters.size.length === 0 || filters.size.some(s => s.toLowerCase() === item.size?.toLowerCase());
    const matchesBrand = filters.brand.length === 0 || filters.brand.some(b => b.toLowerCase() === item.brand?.toLowerCase());
    const matchesColor = filters.color.length === 0 || filters.color.some(c => c.toLowerCase() === item.color?.toLowerCase());
    const matchesPrice = !filters.maxPrice || Number(item.price) <= Number(filters.maxPrice);

    return matchesSearch && matchesSize && matchesBrand && matchesColor && matchesPrice;
  });

  const FilterGroup = ({ title, options, stateKey }: {
    title: string,
    options: string[],
    stateKey: "size" | "color" | "brand"
  }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight={700} sx={{
        mb: 1,
        textTransform: 'uppercase',
        fontSize: '0.75rem',
        color: 'text.secondary'
      }}>
        {title}
      </Typography>
      <FormGroup sx={{
        maxHeight: title === "Brand" ? "180px" : "none",
        overflowY: "auto"
      }}>
        {options.map((opt) => (
          <FormControlLabel
            key={opt}
            label={<Typography variant="body2">{opt}</Typography>}
            control={
              <Checkbox
                size="small"
                checked={filters[stateKey].includes(opt)}
                onChange={() => handleToggleFilter(stateKey, opt)}
              />
            }
          />
        ))}
      </FormGroup>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: "#FBFBFE", minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ mt: 5, mb: 10 }}>
        <Grid container spacing={4}>
          {/* 🧭 LEFT SIDEBAR - FILTERS */}
          <Grid item xs={12} md={3} lg={2.5}>
            <Box sx={{
              p: 3,
              bgcolor: "white",
              borderRadius: "16px",
              border: "1px solid #EAEAEA",
              position: { xs: "relative", md: "sticky" },
              top: { md: 100 },
              mb: { xs: 3, md: 0 },
              height: "fit-content"
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FilterAltOutlined fontSize="small" />
                <Typography variant="h6" fontWeight={800}>Filters</Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <FilterGroup title="Size" options={SIZES} stateKey="size" />
              <FilterGroup title="Brand" options={BRANDS} stateKey="brand" />
              <FilterGroup title="Color" options={COLORS} stateKey="color" />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{
                  mb: 1.5,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  color: 'text.secondary'
                }}>
                  Price Range (Max)
                </Typography>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #DDD",
                    outline: "none"
                  }}
                />
              </Box>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => setFilters({
                  size: [],
                  color: [],
                  brand: [],
                  maxPrice: ""
                })}
                sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 700 }}
              >
                Reset Filters
              </Button>
            </Box>
          </Grid>

          {/* 🛍 RIGHT SECTION - PRODUCTS */}
          <Grid item xs={12} md={9} lg={9.5}>
            {/* Search + Add Product */}
            <Box sx={{
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2
            }}>
              <input
                placeholder="Search products by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  maxWidth: "500px",
                  padding: "14px 20px",
                  borderRadius: "30px",
                  border: "1px solid #E0E0E0",
                  outline: "none",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
                }}
              />

              <Button
                component={Link}
                href="/products/add"
                variant="contained"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "30px",
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: "#2874F0",
                  "&:hover": { bgcolor: "#1e5bb8" }
                }}
              >
                + Add Product
              </Button>
            </Box>

            {/* Products count */}
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: "text.primary" }}>
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
            </Typography>

            {/* Products grid */}
            <Grid container spacing={4}>
              {filteredProducts.length === 0 ? (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      No products found
                    </Typography>
                    <Button
                      href="create/products"
                      variant="contained"
                      component={Link}
                    >
                      Add your first product
                    </Button>
                  </Box>
                </Grid>
              ) : (
                filteredProducts.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                    <Card
                      elevation={0}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        borderRadius: "12px",
                        borderBottom: "1px solid #F0F0F0",
                        p: 2,
                        transition: "0.2s",
                        "&:hover": { bgcolor: "#F9F9F9" },
                      }}
                    >
                      {/* 🖼 PRODUCT IMAGE */}
                      <Box sx={{ width: "100%", height: 140, position: "relative", mb: 2 }}>
                        <CardMedia
                          component="img"
                          image={item.image}
                          alt={item.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            borderRadius: "10px",
                          }}
                        />
                      </Box>

                      {/* 📝 PRODUCT DETAILS */}
                      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        {/* NAME */}
                        <Typography variant="subtitle1" fontWeight={600} sx={{
                          color: "#212121",
                          lineHeight: 1.2,
                          mb: 1.5
                        }}>
                          {item.name}
                        </Typography>

                        {/* ATTRIBUTES */}
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ minWidth: 45 }}>
                              Size:
                            </Typography>
                            <Chip label={item.size} size="small" sx={{
                              bgcolor: "#E8F5E8",
                              color: "#388E3C",
                              fontWeight: 700,
                              fontSize: "0.75rem"
                            }} />
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ minWidth: 45 }}>
                              Color:
                            </Typography>
                            <Chip label={item.color} size="small" sx={{
                              fontSize: "0.75rem",
                              bgcolor: "#E8F5E8",
                              color: "#388E3C",
                              fontWeight: 700,
                              textTransform: "capitalize"
                            }} />
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ minWidth: 45 }}>
                              Brand:
                            </Typography>

                            <Chip label={item.brand} size="small" sx={{
                              fontSize: "0.75rem",
                              bgcolor: "#E8F5E8",
                              color: "#388E3C",
                              fontWeight: 700,
                              textTransform: "capitalize"
                            }} />
                          </Box>
                        </Box>

                        {/* PRICE */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h6" fontWeight={800} color="#212121">
                            ₹{item.price}/-
                          </Typography>
                        </Box>

                        {/* ACTIONS */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<Edit sx={{ fontSize: 16 }} />}
                            component={Link}
                            href={`/products/edit/${item._id}`}
                            sx={{
                              textTransform: "none",
                              fontSize: "0.75rem",
                              color: "#2874F0",
                              minWidth: "auto",
                              px: 1.5
                            }}
                          >
                            Edit
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(item._id)}
                            sx={{ color: "#ff4343" }}
                          >
                            <DeleteOutline sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Footer />

      {/* TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.type} sx={{ width: '100%' }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
