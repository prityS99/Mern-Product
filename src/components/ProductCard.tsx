// src/components/ProductCard.tsx

'use client';

import { Product } from "@/types/product"; 
import { Heart, Plus } from "lucide-react";

interface ProductCardProps {
  product: Product; 
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-110"
        />
      </div>

      <div className="p-4">
        <p className="text-xs font-medium text-indigo-600 uppercase">{product.brand}</p>
        <h3 className="mt-1 text-sm font-semibold text-gray-800">{product.name}</h3>
        
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">{product.price}/-</p>
          <span className="text-xs text-gray-500">{product.color}</span>
        </div>

        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-2 text-sm font-bold text-white hover:bg-indigo-600 transition-colors">
          <Plus className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}