import Link from 'next/link';
import { ShoppingBag, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-200">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-slate-900">
                Fresh<span className="text-emerald-600">Cart</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your one-stop shop for daily groceries, fresh food, and electronics delivered right to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/products" className="hover:text-emerald-600 transition-colors">All Products</Link></li>
              <li><Link href="/categories" className="hover:text-emerald-600 transition-colors">Categories</Link></li>
              <li><Link href="/brands" className="hover:text-emerald-600 transition-colors">Featured Brands</Link></li>
              <li><Link href="/cart" className="hover:text-emerald-600 transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Customer Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="#" className="hover:text-emerald-600 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors">Track Order</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cairo, Egypt</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>+20 100 000 0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>support@freshcart.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-100 mt-10 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} FreshCart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}