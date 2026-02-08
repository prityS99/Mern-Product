import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
  MenuItem,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  CloseRounded,
  CloudUploadOutlined,
  SaveRounded,
} from "@mui/icons-material";
import { useState, useEffect } from "react";

const categories = [
  "Electronics",
  "Apparel",
  "Home & Kitchen",
  "Accessories",
  "Gadgets",
];

const ProductForm = ({ open, onClose, onSubmit, editData }) => {
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    color: "",
    category: "",
    image: "",
    // price: "",
    desc: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        name: "",
        desc: "",
        price: "",
        category: "",
        size: "",
        color: "",
        image: "",
      });
    }
  }, [editData, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventaDefault();
    onSubmit(formData);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: "100%", sm: 450 }, border: "none", p: 0 },
      }}
    >
      <Box
        component="form"
        onSubmit={handleFormSubmit}
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#F8FAFC",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1E293B" }}>
              {editData ? "Edit Product" : "New Product"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Fill in the details to update your warehouse stock.
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ bgcolor: "white", border: "1px solid #E5EAF2" }}
          >
            <CloseRounded />
          </IconButton>
        </Box>

        <Divider />

        {/* Form Body */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              fullWidth
              label="Description"
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              multiline
              rows={3}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                select
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              >
                {categories.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Size"
                name="size"
                placeholder="e.g. XL, 42"
                value={formData.size}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Color"
                name="color"
                placeholder="e.g. Blue"
                value={formData.color}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Stack>

            <TextField
              fullWidth
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.com/product.jpg"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CloudUploadOutlined />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Stack>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ p: 3, borderTop: "1px solid #E5EAF2", bgcolor: "#F8FAFC" }}>
          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                color: "#64748B",
                borderColor: "#CBD5E1",
              }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              startIcon={<SaveRounded />}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "#6366F1",
                "&:hover": { bgcolor: "#4F46E5" },
              }}
            >
              {editData ? "Update Item" : "Save Product"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ProductForm;
