import axios from 'axios';

// const cors = require('cors');
// app.use(cors()); 

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3009/api/v1"
});

export const getProducts = () => API.get("/products");
export const createProduct = (data) => API.post("/create/products", data);
export const updateProduct = (id, data) =>
  API.put(`/update/${id}`, data);
export const deleteProduct = (id) =>
  API.delete(`/delete/${id}`);