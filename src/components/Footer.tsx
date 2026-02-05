export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold text-indigo-600">SHOP.AI</span>
            <p className="mt-4 text-sm text-gray-500 max-w-xs">
              Your one-stop destination for the latest in tech-driven fashion and lifestyle.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-indigo-600">New Arrivals</a></li>
              <li><a href="#" className="hover:text-indigo-600">Best Sellers</a></li>
              <li><a href="#" className="hover:text-indigo-600">Sale</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">Support</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-indigo-600">Contact Us</a></li>
              <li><a href="#" className="hover:text-indigo-600">Shipping Info</a></li>
              <li><a href="#" className="hover:text-indigo-600">Returns</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center text-sm text-gray-400">
          <p>© 2026 Shop.io, Built with Next.js & TypeScript.</p>
        </div>
      </div>
    </footer>
  );
}