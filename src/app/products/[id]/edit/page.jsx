"use client";

import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { useRouter, useParams } from "next/navigation";
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    desc: "",
    brand: "",
    size: [],
    color: [],
    image: "", // Added for consistency
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3009/api/v1/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setFormData({
            name: data.data.name || "",
            price: data.data.price || "",
            desc: data.data.desc || "",
            brand: data.data.brand || "",
            size: data.data.size || [],
            color: data.data.color || [],
            image: data.data.image || "",
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    let updated = [...formData[type]];
    if (checked) {
      updated.push(value);
    } else {
      updated = updated.filter((item) => item !== value);
    }
    setFormData({ ...formData, [type]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3009/api/v1/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Product Updated!");
        router.push("/");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit");
    }
  };

  if (loading) {
    return (
      <Box className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box className="bg-light min-vh-100 pb-5">
      <Navbar />

      <Container maxWidth="sm" className="mt-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <Typography variant="h5" align="center" gutterBottom>
              Edit Product
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
              />

              <TextField
                fullWidth
                type="number"
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                margin="normal"
              />

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                Size:
              </Typography>
              <FormGroup row sx={{ mb: 3 }}>
                {["S", "M", "L", "XL", "XXL"].map((s) => (
                  <FormControlLabel
                    key={s}
                    control={
                      <Checkbox
                        value={s}
                        checked={formData.size.includes(s)}
                        onChange={(e) => handleCheckboxChange(e, "size")}
                      />
                    }
                    label={s}
                  />
                ))}
              </FormGroup>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Color:
              </Typography>
              <FormGroup row sx={{ mb: 3 }}>
                {["white", "purple", "blue", "black"].map((c) => (
                  <FormControlLabel
                    key={c}
                    control={
                      <Checkbox
                        value={c}
                        checked={formData.color.includes(c)}
                        onChange={(e) => handleCheckboxChange(e, "color")}
                      />
                    }
                    label={c}
                  />
                ))}
              </FormGroup>

              <Select
                fullWidth
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                displayEmpty
                required
                margin="normal"
              >
                <MenuItem value="">Select Brand</MenuItem>
                <MenuItem value="Levi's">Levi's</MenuItem>
                <MenuItem value="H&M">H&M</MenuItem>
                <MenuItem value="Zara">Zara</MenuItem>
                <MenuItem value="Nike">Nike</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>

              <TextField
                fullWidth
                label="Product Description"
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                multiline
                rows={3}
                required
                margin="normal"
                sx={{ mt: 2 }}
              />

              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                helperText="Paste direct image link here"
                margin="normal"
              />

              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  style={{ backgroundColor: "#008374" }}
                >
                  UPDATE PRODUCT
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => router.push("/")}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
