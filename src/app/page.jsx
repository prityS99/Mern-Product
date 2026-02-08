"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
  Snackbar,
  Alert,
  Box,
  IconButton,
  Chip,
  InputBase,
  Paper,
  Drawer,
} from "@mui/material";

import {
  DeleteOutline,
  AddRounded,
  SearchRounded,
  FilterListRounded,
  Inventory2Outlined,
} from "@mui/icons-material";

import { useEffect, useState } from "react";

import {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  restoreProduct,
} from "@/services/productServices";
import SidebarFilter from "@/compo/SidebarFilter";
import CreateProductForm from "./products/create/page";
import ProductDetails from "./products/[id]/page";
import Link from "next/link";

// Fixed filter arrays
const SIZES = ["S", "M", "L", "XL", "XXL"];
const BRANDS = ["Mufti", "Adidas", "Rayman", "Levis"];
const COLORS = ["Black", "White", "Blue", "Red", "Grey"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [trash, setTrash] = useState([]);

  const [toast, setToast] = useState({
    open: false,
    msg: "",
    type: "success",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // FILTER STATES //
  const [filters, setFilters] = useState({
    colors: [],
    sizes: [],
    brands: [],
    priceRange: [0, 5000],
  });
  const [showFilters, setShowFilters] = useState(false);

  {
    /*GET PRODUCTS */
  }
  const fetchProducts = async () => {
    try {
      console.log("🔄 Fetching products..."); // Debug
      const res = await getProducts();
      console.log("📦 Products received:", res?.data?.data?.length); // Debug
      setProducts(res?.data?.data || []);
    } catch (error) {
      console.error("❌ Fetch error:", error);
      setProducts([]);
    }
  };

  {
    /* VIEW DETAILS PRODUCTS  */
  }
  const fetchProduct = async (id) => {
    const res = await fetch(`http://localhost:3009/api/v1/products/${id}`);
    const data = await res.json();
    return data.data;
  };

  useEffect(() => {
    fetchProducts();
  }, []);


const toggleFilterValue = (category, value) => {
  setFilters((prev) => {
    const current = Array.isArray(prev[category]) ? prev[category] : [];

    return {
      ...prev,
      [category]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    };
  });
};

const updateFilters = (newFilters) => {
  setFilters((prev) => ({
    ...prev,
    ...newFilters,
  }));
};



  const activeFiltersCount =
    (filters.colors?.length || 0) +
    (filters.sizes?.length || 0) +
    (filters.brands?.length || 0);

  
  {
    filters.colors?.map((color) => (
      <Chip
        key={`color-${color}`}
        label={`Color: ${color}`}
        onDelete={() => toggleFilterValue(["colors", color])}
        size="small"
      />
    ));
  }
  {
    filters.sizes?.map((size) => (
      <Chip
        key={`size-${size}`}
        label={`Size: ${size}`}
        onDelete={() => toggleFilterValue(["sizes", size])}
        size="small"
      />
    ));
  }
  {
    filters.brands?.map((brand) => (
      <Chip
        key={`brand-${brand}`}
        label={`Brand: ${brand}`}
        onDelete={() => toggleFilterValue(["brands", brand])}
        size="small"
      />
    ));
  }

  const handleClearFilters = () => {
    setFilters({
      colors: [],
      sizes: [],
      brands: [],
      priceRange: [0, 5000],
    });
  };


  const handleSubmit = async (data) => {
    try {
      if (editData) {
        // Update existing product
        await updateProduct(editData._id, data);
        setToast({ open: true, msg: "Updated successfully!", type: "success" });
      } else {
        // Create new product
        await createProduct(data);
        setToast({
          open: true,
          msg: "Product created successfully!",
          type: "success",
        });
      }

      // ALWAYS refresh the list
      setOpenForm(false);
      await fetchProducts();
    } catch (error) {
      console.error("Submit error:", error);
      setToast({ open: true, msg: "Request failed", type: "error" });
    }
  };



  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesColor =
      filters.colors.length === 0 || filters.colors.includes(item.color);
    const matchesSize =
      filters.sizes.length === 0 || filters.sizes.includes(item.size);
    const matchesBrand =
      filters.brands.length === 0 || filters.brands.includes(item.brand);
    const matchesPrice =
      item.price >= filters.priceRange[0] &&
      item.price <= filters.priceRange[1];

    return (
      matchesSearch &&
      matchesColor &&
      matchesSize &&
      matchesBrand &&
      matchesPrice
    );
  });

  const fetchTrash = async () => {
    const res = await getDeletedProducts();
    setTrash(res.data.data || []);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);

    setProducts((prev) => prev.filter((p) => p._id !== id));

    setToast({
      open: true,
      msg: "Product deleted",
      type: "info",
      undoId: id,
    });
  };

  const handleRestore = async (id) => {
    await restoreProduct(id);
    setTrash((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F4F7F9" }}>
      {/* NAVBAR */}
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: "white" }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Inventory2Outlined sx={{ color: "#6366F1" }} />
              <Typography fontWeight={800}>Inventory.</Typography>
            </Box>

            <Paper
              sx={{
                px: 2,
                display: "flex",
                alignItems: "center",
                width: 400,
                bgcolor: "#F1F5F9",
                borderRadius: 2,
              }}
            >
              <SearchRounded />
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Paper>

            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton onClick={() => setShowFilters(true)}>
                <FilterListRounded />
              </IconButton>
              <Button
                variant="contained"
                startIcon={<AddRounded />}
                onClick={() => {
                  setEditData(null);
                  setOpenForm(true);
                }}
              >
                Create
              </Button>

              <Button
                component={Link}
                href="/trash"
                variant="outlined"
                color="error"
                startIcon={<DeleteOutline />}
              >
                Trash
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* MAIN CONTENT */}
      <Container maxWidth="xl" sx={{ mt: 12 }}>
        <Typography variant="h4" fontWeight={800} mb={4}>
          Global House Overview
        </Typography>

        <Grid container spacing={3}>
          {/* FILTERS SIDEBAR - FIXED ARRAYS */}
          <Grid item xs={12} lg={3}>
            {activeFiltersCount > 0 && (
              <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {filters.colors.map((color) => (
                    <Chip
                      key={`color-${color}`}
                      label={`Color: ${color}`}
                      onDelete={() => toggleFilterValue(["colors", color])}
                      size="small"
                    />
                  ))}
                  {filters.sizes.map((size) => (
                    <Chip
                      key={`size-${size}`}
                      label={`Size: ${size}`}
                      onDelete={() => toggleFilterValue(["sizes", size])}
                      size="small"
                    />
                  ))}
                  {filters.brands.map((brand) => (
                    <Chip
                      key={`brand-${brand}`}
                      label={`Brand: ${brand}`}
                      onDelete={() => toggleFilterValue(["brands", brand])}
                      size="small"
                    />
                  ))}
                </Box>
                <Button
                  size="small"
                  onClick={toggleFilterValue}
                  sx={{ mt: 1 }}
                >
                  Clear All ({activeFiltersCount})
                </Button>
              </Paper>
            )}

            {/* Quick Filter Button */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListRounded />}
              onClick={() => setShowFilters(true)}
              sx={{ mb: 3 }}
            >
              More Filters ({activeFiltersCount})
            </Button>
          </Grid>

          <Drawer
            anchor="right"
            open={showFilters}
            onClose={() => setShowFilters(false)}
            sx={{ "& .MuiDrawer-paper": { width: "100%", maxWidth: 320 } }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <SidebarFilter
              filters={filters}
              onFilterChange={toggleFilterValue}
              onClose={() => setShowFilters(false)}
            />
          </Drawer>
          {/* PRODUCTS GRID - FIXED */}
          <Grid item xs={12} lg={9}>
            {/* FIRST ROW - 4 IMAGES */}
            <Grid container spacing={3}>
              {filteredProducts.slice(0, 4).map((item) => (
                <Grid
                  item
                  xs={6}
                  sm={6}
                  md={3}
                  lg={3}
                  key={`first-${item._id}`}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height={350}
                      image={item.image}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ color: "#212121" }}
                        mb={2}
                      >
                        {item.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Size:
                        </Typography>
                        <Chip label={item.size} size="small" color="success" />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Color:
                        </Typography>
                        <Chip label={item.color} size="small" color="primary" />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Brand:
                        </Typography>
                        <Chip
                          label={item.brand}
                          size="small"
                          color="secondary"
                        />
                      </Box>
                      <Typography variant="h5" fontWeight={700} color="#161916">
                        ₹{item.price}/-
                      </Typography>
                    </CardContent>

                    <Box sx={{ p: 2, display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        component={Link}
                        href={`/products/${item._id}`}
                        sx={{ flex: 1 }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setEditData(item);
                          setOpenForm(true);
                        }}
                        sx={{ flex: 1 }}
                      >
                        Edit
                      </Button>

                      <IconButton
                        onClick={() => handleDelete(item._id)}
                        color="error"
                      >
                        <DeleteOutline />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* SECOND ROW - 4 IMAGES */}
            <Grid container spacing={3}>
              {filteredProducts.slice(4, 8).map((item) => (
                <Grid
                  item
                  mt={5}
                  xs={6}
                  sm={6}
                  md={3}
                  lg={3}
                  key={`second-${item._id}`}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height={350}
                      image={item.image}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ color: "#212121" }}
                        mb={2}
                      >
                        {item.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Size:
                        </Typography>
                        <Chip label={item.size} size="small" color="success" />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Color:
                        </Typography>
                        <Chip label={item.color} size="small" color="primary" />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Brand:
                        </Typography>
                        <Chip
                          label={item.brand}
                          size="small"
                          color="secondary"
                        />
                      </Box>
                      <Typography variant="h5" fontWeight={700} color="#161916">
                        ₹{item.price}/-
                      </Typography>
                    </CardContent>

                    <Box sx={{ p: 2, display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        component={Link}
                        href={`/products/${item._id}`}
                        sx={{ flex: 1 }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setEditData(item);
                          setOpenForm(true);
                        }}
                        sx={{ flex: 1 }}
                      >
                        Edit
                      </Button>
                      <IconButton
                        onClick={() => handleDelete(item._id)}
                        color="error"
                      >
                        <DeleteOutline />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {filteredProducts.length === 0 && (
              <Box sx={{ textAlign: "center", mt: 8, py: 6 }}>
                <Inventory2Outlined
                  sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" mb={1}>
                  No products found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your filters or search terms
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        <Box sx={{ bgcolor: "#f5f5f5", py: 3, mt: 6 }}>
          <Container>
            <Typography align="center" variant="body2" color="text.secondary">
              © {new Date().getFullYear()} MyStore. Built the right way.
            </Typography>
          </Container>
        </Box>
      </Container>

      {/* FORM + TOAST */}
      <CreateProductForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        editData={editData}
      />

      {/*EDIT PAGE*/}

      <ProductDetails
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        productId={selectedProductId}
        onEdit={() => {
          // Fetch product and open edit form
          fetchProduct(selectedProductId).then((product) => {
            setEditData(product);
            setOpenForm(true);
            setOpenDetails(false);
          });
        }}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.type}
        >
          {toast.msg}
        </Alert>
      </Snackbar>

      <Snackbar>
        <Alert
          severity="info"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => restoreProduct(toast.undoId)}
            >
              UNDO
            </Button>
          }
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}





// "use client";

// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Card,
//   CardContent,
//   CardMedia,
//   Grid,
//   Container,
//   Snackbar,
//   Alert,
//   Box,
//   IconButton,
//   Chip,
//   InputBase,
//   Paper,
//   Drawer,
// } from "@mui/material";

// import {
//   DeleteOutline,
//   AddRounded,
//   SearchRounded,
//   FilterListRounded,
//   Inventory2Outlined,
// } from "@mui/icons-material";

// import { useEffect, useState } from "react";

// import {
//   getProducts,
//   deleteProduct,
//   createProduct,
//   updateProduct,
// } from "@/services/productServices";
// import SidebarFilter from "@/compo/SidebarFilter";
// import CreateProductForm from "./products/create/page";
// import ProductDetails from "./products/[id]/page";
// import Link from "next/link";

// // Fixed filter arrays
// const SIZES = ["S", "M", "L", "XL", "XXL"];
// const BRANDS = ["Mufti", "Adidas", "Rayman", "Levis"];
// const COLORS = ["Black", "White", "Blue", "Red", "Grey"];

// export default function Home() {
//   const [products, setProducts] = useState([]);
//   const [openForm, setOpenForm] = useState(false);
//   const [openDetails, setOpenDetails] = useState(false);
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [editData, setEditData] = useState(null);

//   const [toast, setToast] = useState({
//     open: false,
//     msg: "",
//     type: "success",
//   });
//   const [searchQuery, setSearchQuery] = useState("");

//   // FILTER STATES //
//   const [filters, setFilters] = useState({
//     colors: [],
//     sizes: [],
//     brands: [],
//     priceRange: [0, 5000],
//   });
//   const [showFilters, setShowFilters] = useState(false);

//   {
//     /*GET PRODUCTS */
//   }
//   const fetchProducts = async () => {
//     try {
//       console.log("🔄 Fetching products..."); // Debug
//       const res = await getProducts();
//       console.log("📦 Products received:", res?.data?.data?.length); // Debug
//       setProducts(res?.data?.data || []);
//     } catch (error) {
//       console.error("❌ Fetch error:", error);
//       setProducts([]);
//     }
//   };

//   {
//     /* VIEW DETAILS PRODUCTS  */
//   }
//   const fetchProduct = async (id) => {
//     const res = await fetch(`http://localhost:3009/api/v1/products/${id}`);
//     const data = await res.json();
//     return data.data;
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // const handleFilterChange = (update) => {
//   //   if (typeof update === "object" && update.priceRange) {
//   //     setFilters(update);
//   //   } else {
//   //     // Single toggle from chips (category, value)
//   //     const [category, value] = update;
//   //     setFilters((prev) => ({
//   //       ...prev,
//   //       [category]: prev[category].includes(value)
//   //         ? prev[category].filter((item) => item !== value)
//   //         : [...prev[category], value],
//   //     }));
//   //   }
//   // };

//   const handleFilterChange = (newFilters) => {
//     setFilters(newFilters);
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       colors: [],
//       sizes: [],
//       brands: [],
//       priceRange: [0, 5000],
//     });
//   };

//   const activeFiltersCount =
//     filters.colors.length + filters.sizes.length + filters.brands.length;

//   const handlePriceChange = (event, newValue) => {
//     setFilters((prev) => ({
//       ...prev,
//       priceRange: newValue,
//     }));
//   };

//   const handleSubmit = async (data) => {
//     try {
//       if (editData) {
//         // Update existing product
//         await updateProduct(editData._id, data);
//         setToast({ open: true, msg: "Updated successfully!", type: "success" });
//       } else {
//         // Create new product
//         await createProduct(data);
//         setToast({
//           open: true,
//           msg: "Product created successfully!",
//           type: "success",
//         });
//       }

//       // ALWAYS refresh the list
//       setOpenForm(false);
//       await fetchProducts();
//     } catch (error) {
//       console.error("Submit error:", error);
//       setToast({ open: true, msg: "Request failed", type: "error" });
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Delete this product?")) {
//       await deleteProduct(id);
//       setToast({ open: true, msg: "Product removed", type: "info" });
//       fetchProducts();
//     }
//   };

//   const filteredProducts = products.filter((item) => {
//     const matchesSearch =
//       item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.category?.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesColor =
//       filters.colors.length === 0 || filters.colors.includes(item.color);
//     const matchesSize =
//       filters.sizes.length === 0 || filters.sizes.includes(item.size);
//     const matchesBrand =
//       filters.brands.length === 0 || filters.brands.includes(item.brand);
//     const matchesPrice =
//       item.price >= filters.priceRange[0] &&
//       item.price <= filters.priceRange[1];

//     return (
//       matchesSearch &&
//       matchesColor &&
//       matchesSize &&
//       matchesBrand &&
//       matchesPrice
//     );
//   });

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#F4F7F9" }}>
//       {/* NAVBAR */}
//       <AppBar position="fixed" elevation={0} sx={{ bgcolor: "white" }}>
//         <Container maxWidth="xl">
//           <Toolbar sx={{ justifyContent: "space-between" }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <Inventory2Outlined sx={{ color: "#6366F1" }} />
//               <Typography fontWeight={800}>Inventory.</Typography>
//             </Box>

//             <Paper
//               sx={{
//                 px: 2,
//                 display: "flex",
//                 alignItems: "center",
//                 width: 400,
//                 bgcolor: "#F1F5F9",
//                 borderRadius: 2,
//               }}
//             >
//               <SearchRounded />
//               <InputBase
//                 sx={{ ml: 1, flex: 1 }}
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </Paper>

//             <Box sx={{ display: "flex", gap: 2 }}>
//               <IconButton onClick={() => setShowFilters(true)}>
//                 <FilterListRounded />
//               </IconButton>
//               <Button
//                 variant="contained"
//                 startIcon={<AddRounded />}
//                 onClick={() => {
//                   setEditData(null);
//                   setOpenForm(true);
//                 }}
//               >
//                 Create
//               </Button>
//             </Box>
//           </Toolbar>
//         </Container>
//       </AppBar>

//       {/* MAIN CONTENT */}
//       <Container maxWidth="xl" sx={{ mt: 12 }}>
//         <Typography variant="h4" fontWeight={800} mb={4}>
//           Global House Overview
//         </Typography>

//         <Grid container spacing={3}>
//           {/* FILTERS SIDEBAR - FIXED ARRAYS */}
//           <Grid item xs={12} lg={3}>
//             {activeFiltersCount > 0 && (
//               <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
//                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//                   {filters.colors.map((color) => (
//                     <Chip
//                       key={`color-${color}`}
//                       label={`Color: ${color}`}
//                       onDelete={() => handleFilterChange(["colors", color])}
//                       size="small"
//                     />
//                   ))}
//                   {filters.sizes.map((size) => (
//                     <Chip
//                       key={`size-${size}`}
//                       label={`Size: ${size}`}
//                       onDelete={() => handleFilterChange(["sizes", size])}
//                       size="small"
//                     />
//                   ))}
//                   {filters.brands.map((brand) => (
//                     <Chip
//                       key={`brand-${brand}`}
//                       label={`Brand: ${brand}`}
//                       onDelete={() => handleFilterChange(["brands", brand])}
//                       size="small"
//                     />
//                   ))}
//                 </Box>
//                 <Button
//                   size="small"
//                   onClick={handleClearFilters}
//                   sx={{ mt: 1 }}
//                 >
//                   Clear All ({activeFiltersCount})
//                 </Button>
//               </Paper>
//             )}

//             {/* Quick Filter Button */}
//             <Button
//               fullWidth
//               variant="outlined"
//               startIcon={<FilterListRounded />}
//               onClick={() => setShowFilters(true)}
//               sx={{ mb: 3 }}
//             >
//               More Filters ({activeFiltersCount})
//             </Button>
//           </Grid>

//           <Drawer
//             anchor="right"
//             open={showFilters}
//             onClose={() => setShowFilters(false)}
//             sx={{ "& .MuiDrawer-paper": { width: "100%", maxWidth: 320 } }}
//             ModalProps={{
//               keepMounted: true,
//             }}
//           >
//             <SidebarFilter
//               filters={filters}
//               onFilterChange={handleFilterChange}
//               onClose={() => setShowFilters(false)}
//             />
//           </Drawer>
//           {/* PRODUCTS GRID - FIXED */}

//           <Grid container spacing={3}>
//             {filteredProducts.map((item) => (
//               <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
//                 <Card
//                   sx={{
//                     borderRadius: 3,
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <CardMedia
//                     component="img"
//                     height={350}
//                     image={item.image}
//                     sx={{ objectFit: "cover" }}
//                   />

//                   <CardContent sx={{ flexGrow: 1 }}>
//                     <Typography fontWeight={600} mb={2}>
//                       {item.name}
//                     </Typography>

//                     <Chip label={item.size} size="small" sx={{ mr: 1 }} />
//                     <Chip label={item.color} size="small" sx={{ mr: 1 }} />
//                     <Chip label={item.brand} size="small" />

//                     <Typography mt={2} variant="h6" fontWeight={700}>
//                       ₹{item.price}/-
//                     </Typography>
//                   </CardContent>

//                   <Box sx={{ p: 2, display: "flex", gap: 1 }}>
//                     <Button
//                       size="small"
//                       variant="outlined"
//                       component={Link}
//                       href={`/products/${item._id}`}
//                       sx={{ flex: 1 }}
//                     >
//                       View
//                     </Button>

//                     <Button
//                       size="small"
//                       variant="outlined"
//                       onClick={() => {
//                         setEditData(item);
//                         setOpenForm(true);
//                       }}
//                       sx={{ flex: 1 }}
//                     >
//                       Edit
//                     </Button>

//                     <IconButton
//                       onClick={() => handleDelete(item._id)}
//                       color="error"
//                     >
//                       <DeleteOutline />
//                     </IconButton>
//                   </Box>
//                 </Card>
//               </Grid>
//             ))}

//             {filteredProducts.length === 0 && (
//               <Box sx={{ textAlign: "center", mt: 8, py: 6 }}>
//                 <Inventory2Outlined
//                   sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
//                 />
//                 <Typography variant="h6" color="text.secondary" mb={1}>
//                   No products found
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Try adjusting your filters or search terms
//                 </Typography>
//               </Box>
//             )}
//           </Grid>
//         </Grid>

//         <Box sx={{ bgcolor: "#f5f5f5", py: 3, mt: 6 }}>
//           <Container>
//             <Typography align="center" variant="body2" color="text.secondary">
//               © {new Date().getFullYear()} MyStore. Built the right way.
//             </Typography>
//           </Container>
//         </Box>
//       </Container>

//       {/* FORM + TOAST */}
//       <CreateProductForm
//         open={openForm}
//         onClose={() => {
//           setOpenForm(false);
//           setEditData(null);
//         }}
//         onSubmit={handleSubmit}
//         editData={editData}
//       />

//       {/*EDIT PAGE*/}

//       <ProductDetails
//         open={openDetails}
//         onClose={() => setOpenDetails(false)}
//         productId={selectedProductId}
//         onEdit={() => {
//           // Fetch product and open edit form
//           fetchProduct(selectedProductId).then((product) => {
//             setEditData(product);
//             setOpenForm(true);
//             setOpenDetails(false);
//           });
//         }}
//       />
//       <Snackbar
//         open={toast.open}
//         autoHideDuration={3000}
//         onClose={() => setToast({ ...toast, open: false })}
//       >
//         <Alert severity={toast.type} variant="filled">
//           {toast.msg}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }
