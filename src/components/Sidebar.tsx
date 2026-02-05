'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function Sidebar({ currentFilters }: { currentFilters: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className="w-64 space-y-8 hidden md:block">
      {/* Brand Filter */}
      <div>
        <h3 className="font-bold mb-3">Brand</h3>
        {['Nike', 'Adidas', 'Puma'].map(brand => (
          <label key={brand} className="flex items-center gap-2 mb-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={currentFilters.brand === brand}
              onChange={(e) => handleFilterChange('brand', e.target.checked ? brand : '')}
              className="rounded text-indigo-600"
            />
            <span className="text-sm">{brand}</span>
          </label>
        ))}
      </div>

      {/* Color Filter */}
      <div>
        <h3 className="font-bold mb-3">Color</h3>
        <div className="flex gap-2">
          {['black', 'white', 'red', 'blue'].map(color => (
            <button
              key={color}
              onClick={() => handleFilterChange('color', color)}
              className={`w-6 h-6 rounded-full border ${currentFilters.color === color ? 'ring-2 ring-indigo-500' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-bold mb-3">Max Price: ${currentFilters.price || '500'}</h3>
        <input 
          type="range" 
          min="0" 
          max="1000" 
          step="10"
          value={currentFilters.price || 500}
          onChange={(e) => handleFilterChange('price', e.target.value)}
          className="w-full accent-indigo-600"
        />
      </div>
    </aside>
  );
}