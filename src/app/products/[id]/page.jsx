"use client";

import { useEffect, useState } from "react";
import Navbar from "../../../compo/Navbar";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";

export default function ProductDetails() {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3009/api/v1/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProduct(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <Box className="bg-light min-vh-100">
      <Navbar />

      <Container className="mt-5">
        <Card
          className="shadow-sm mx-auto"
          style={{ maxWidth: "800px" }}
        >
          <CardContent className="p-4">
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>

            <Typography variant="h6" className="fw-bold mb-3">
              Price: ₹{product.price}
            </Typography>

            <Typography>
              <strong>Sizes:</strong>{" "}
              {product.size?.join(", ") || "N/A"}
            </Typography>

            <Typography>
              <strong>Colors:</strong>{" "}
              {product.color?.join(", ") || "N/A"}
            </Typography>

            <Typography>
              <strong>Brand:</strong> {product.brand}
            </Typography>

            <Typography className="text-secondary mt-3">
              {product.desc}
            </Typography>

            <Box className="mt-4 text-end">
              <Button
                component={Link}
                href="/"
                variant="contained"
                style={{ backgroundColor: "#008374" }}
              >
                &lt; BACK
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
