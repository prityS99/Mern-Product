
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer"
import { Product } from "@/types/product";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// src/app/page.tsx

export default async function Dashboard({ searchParams }: Props) {
  const filters = await searchParams;
  const queryString = new URLSearchParams(filters as any).toString();

  // 1. Check your URL. Is it hitting the correct PORT? 
  // If your Express backend is on 5000, use that!
  const API_URL = `http://localhost:3009/api/v1/products?${queryString}`;

  const res = await fetch(API_URL, {
    cache: 'no-store'
  });

  // 2. Add this Debugger Block
  if (!res.ok) {
    const errorText = await res.text(); // Get the HTML error message
    console.error("Backend Error HTML:", errorText);
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }

  // 3. Only parse JSON if the response is actually OK
  const products: Product[] = await res.json();



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1 max-w-[1400px] mx-auto w-full pt-6 px-4 gap-8">
        {/* Pass current filters to sidebar to keep inputs in sync */}
        <Sidebar currentFilters={filters} />

        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
            {products.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500">
                No products found matching these filters.
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}