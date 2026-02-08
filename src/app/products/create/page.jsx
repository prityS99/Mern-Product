"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
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

export default function CreateProductForm({ open, onClose, onSubmit, editData }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    desc: "",
    brand: "",
    size: [],
    color: [],
    image: "", // Changed to string for URL
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        price: editData.price || "",
        desc: editData.desc || "",
        brand: editData.brand || "",
        size: editData.size || [],
        color: editData.color || [],
        image: editData.image || "",
      });
    } else {
      setFormData({
        name: "",
        price: "",
        desc: "",
        brand: "",
        size: [],
        color: [],
        image: "",
      });
    }
  }, [editData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    let updated = [...formData[type]];

    checked
      ? updated.push(value)
      : (updated = updated.filter((i) => i !== value));

    setFormData({ ...formData, [type]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editData ? "Edit Product" : "Create Product"}
      </DialogTitle>
      <DialogContent>
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

          {/* IMAGE URL - ONE LINE AT END */}
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

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{ backgroundColor: "#008374" }}
            >
              {editData ? "UPDATE PRODUCT" : "CREATE PRODUCT"}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}


// "use client";

// import { useState } from "react";
// import Navbar from "../../components/Navbar";
// import { useRouter } from "next/navigation";

// import {
//   Container,
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
//   Select,
//   MenuItem,
//   Typography,
//   Box,
// } from "@mui/material";

// export default function CreateProductForm() {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     desc: "",
//     brand: "",
//     size: [],
//     color: [],
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleCheckboxChange = (e, type) => {
//     const { value, checked } = e.target;
//     let updated = [...formData[type]];

//     checked
//       ? updated.push(value)
//       : (updated = updated.filter((i) => i !== value));

//     setFormData({ ...formData, [type]: updated });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch(
//         "http://localhost:4000/api/v1/product/create",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         alert("Product Created!");
//         router.push("/");
//       } else {
//         alert(data.message);
//       }
//     } catch {
//       alert("Failed to submit");
//     }
//   };

//   return (
//     <Box className="bg-light min-vh-100 pb-5">
//       <Navbar />

//       <Container maxWidth="sm" className="mt-4">
//         <Card className="shadow-sm">
//           <CardContent className="p-4">
//             <Typography variant="h5" align="center" gutterBottom>
//               Create Product
//             </Typography>

//             <form onSubmit={handleSubmit}>
//               <TextField
//                 fullWidth
//                 label="Product Name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 margin="normal"
//               />

//               <TextField
//                 fullWidth
//                 type="number"
//                 label="Price"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 required
//                 margin="normal"
//               />

//               <Typography className="mt-3 fw-bold">Size:</Typography>
//               <FormGroup row>
//                 {["S", "M", "L", "XL", "XXL"].map((s) => (
//                   <FormControlLabel
//                     key={s}
//                     control={
//                       <Checkbox
//                         value={s}
//                         onChange={(e) =>
//                           handleCheckboxChange(e, "size")
//                         }
//                       />
//                     }
//                     label={s}
//                   />
//                 ))}
//               </FormGroup>

//               <Typography className="mt-3 fw-bold">Color:</Typography>
//               <FormGroup row>
//                 {["white", "purple", "blue", "black"].map((c) => (
//                   <FormControlLabel
//                     key={c}
//                     control={
//                       <Checkbox
//                         value={c}
//                         onChange={(e) =>
//                           handleCheckboxChange(e, "color")
//                         }
//                       />
//                     }
//                     label={c}
//                   />
//                 ))}
//               </FormGroup>

//               <Select
//                 fullWidth
//                 name="brand"
//                 value={formData.brand}
//                 onChange={handleChange}
//                 displayEmpty
//                 className="mt-3"
//                 required
//               >
//                 <MenuItem value="">Select Brand</MenuItem>
//                 <MenuItem value="Levi's">Levi's</MenuItem>
//                 <MenuItem value="H&M">H&M</MenuItem>
//                 <MenuItem value="Zara">Zara</MenuItem>
//                 <MenuItem value="Nike">Nike</MenuItem>
//                 <MenuItem value="Other">Other</MenuItem>
//               </Select>

//               <TextField
//                 fullWidth
//                 label="Product Description"
//                 name="desc"
//                 value={formData.desc}
//                 onChange={handleChange}
//                 multiline
//                 rows={3}
//                 required
//                 margin="normal"
//               />

//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 className="mt-3"
//                 style={{ backgroundColor: "#008374" }}
//               >
//                 SUBMIT
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </Container>
//     </Box>
//   );
// }
