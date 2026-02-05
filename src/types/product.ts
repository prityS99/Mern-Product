// src/types/product.ts

export interface Product {
  _id: string;      // MongoDB uses _id by default
  name: string;
  price: number;
  brand: string;
  color: string;
  size: string;
  image: string;    // URL string
  countInStock: number;
  createdAt: string;
}