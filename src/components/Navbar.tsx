import { ShoppingCart, User, Menu, Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:block">SHOP.AI</span>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:text-indigo-600 transition-colors">
            <User className="h-5 w-5" />
          </button>
          <button className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </button>
          <button className="md:hidden p-2">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}