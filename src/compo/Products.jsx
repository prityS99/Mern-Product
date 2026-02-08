'use client';

import { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import ProductActions from './ProductActions';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`
      );
      const data = await res.json();
      setProducts(data.products || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Stack alignItems="center" py={6}>
        <CircularProgress />
      </Stack>
    );
  }

   const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Products
      </Typography>

      <Grid container spacing={4}>
        {filteredProducts.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p._id}>
            <Card sx={{ borderRadius: 3 }}>
              <CardMedia component="img" height="220" image={p.image} />
              <CardContent>
                <Typography variant="h6">{p.name}</Typography>
                <Typography color="text.secondary">{p.brand}</Typography>
                <Typography fontWeight={600} mt={1}>
                  ₹ {p.price}
                </Typography>

                <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                  {p.size?.map((s, i) => (
                    <Chip key={i} label={s} size="small" />
                  ))}
                  {p.color?.map((c, i) => (
                    <Chip key={i} label={c} size="small" variant="outlined" />
                  ))}
                </Stack>

                <ProductActions id={p._id} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
