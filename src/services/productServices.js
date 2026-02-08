import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3009/api/v1",
});

export const getProducts = () => API.get("/products");
export const createProduct = (data) => API.post("/create/products", data);
export const updateProduct = (id, data) =>
  API.put(`/update/${id}`, data);
export const deleteProduct = (id) =>
  API.delete(`/delete/${id}`);



export const filterProducts = async (filters) => {
  const params = new URLSearchParams();
  
  if (filters.name) params.append('name', filters.name);
  if (filters.sizes?.length) params.append('sizes', filters.sizes.join(','));
  if (filters.colors?.length) params.append('colors', filters.colors.join(','));
  if (filters.brands?.length) params.append('brands', filters.brands.join(','));
  if (filters.priceRange) {
    params.append('minPrice', filters.priceRange[0]);
    params.append('maxPrice', filters.priceRange[1]);
  }
  
  const { data } = await api.get(`/filter/products?${params}`);
  return data;
};

export const getDeletedProducts = () =>
  API.get("/products?deleted=true");

export const restoreProduct = (id) =>
  API.put(`/restore/${id}`);


