"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Divider,
  Button,
} from "@mui/material";

const SidebarFilter = ({ filters, onFilterChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState({
    size: "",
    color: "",
    brand: "",
    minPrice: 0,
    maxPrice: 5000,
  });

  // Sync with parent
  useEffect(() => {
    setLocalFilters({
      size: filters.size || "",
      color: filters.color || "",
      brand: filters.brand || "",
      minPrice: filters.minPrice || 0,
      maxPrice: filters.maxPrice || 5000,
    });
  }, [filters]);

  const handleCheckboxChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: prev[field] === value ? "" : value  // Toggle single value
    }));
  };

  const handlePriceChange = (_, newValue) => {
    setLocalFilters(prev => ({ ...prev, maxPrice: newValue }));
  };

  const applyFilters = () => {
    // ✅ Send SINGLE VALUES to match controller
    onFilterChange({
      size: localFilters.size,
      color: localFilters.color,
      brand: localFilters.brand,
      minPrice: localFilters.minPrice,
      maxPrice: localFilters.maxPrice,
    });
    if (onClose) onClose();
  };

  const clearFilters = () => {
    const reset = { size: "", color: "", brand: "", minPrice: 0, maxPrice: 5000 };
    setLocalFilters(reset);
    onFilterChange(reset);
    if (onClose) onClose();
  };

  return (
    <Box sx={{ minWidth: 280, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h6" fontWeight="bold">Filters</Typography>
        <Button onClick={onClose} size="small">Close</Button>
      </Box>

      {/* Size - Single selection */}
      <Typography variant="subtitle2" fontWeight="bold" mb={2}>Size</Typography>
      <FormGroup sx={{ mb: 3 }}>
        {["S", "M", "L", "XL", "XXL"].map((size) => (
          <FormControlLabel
            key={size}
            control={
              <Checkbox
                checked={localFilters.size === size}
                onChange={() => handleCheckboxChange('size', size)}
              />
            }
            label={size}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      {/* Color - Single selection */}
      <Typography variant="subtitle2" fontWeight="bold" mb={2}>Color</Typography>
      <FormGroup sx={{ mb: 3 }}>
        {["white", "purple", "blue", "black", "beige", "red"].map((color) => (
          <FormControlLabel
            key={color}
            control={
              <Checkbox
                checked={localFilters.color === color}
                onChange={() => handleCheckboxChange('color', color)}
              />
            }
            label={color}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      {/* Brand - Single selection */}
      <Typography variant="subtitle2" fontWeight="bold" mb={2}>Brand</Typography>
      <FormGroup sx={{ mb: 3 }}>
        {["Levi's", "Nike", "Zara", "Rayman", "Mufti"].map((brand) => (
          <FormControlLabel
            key={brand}
            control={
              <Checkbox
                checked={localFilters.brand === brand}
                onChange={() => handleCheckboxChange('brand', brand)}
              />
            }
            label={brand}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      {/* Price Range */}
      <Typography variant="subtitle2" fontWeight="bold" mb={2}>Price</Typography>
      <Slider
        value={localFilters.maxPrice}
        min={0}
        max={10000}
        step={100}
        valueLabelDisplay="auto"
        onChange={handlePriceChange}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography>₹{localFilters.minPrice}</Typography>
        <Typography>₹{localFilters.maxPrice}</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button fullWidth variant="outlined" onClick={clearFilters}>Clear All</Button>
        <Button fullWidth variant="contained" onClick={applyFilters}>Apply</Button>
      </Box>
    </Box>
  );
};

export default SidebarFilter;
