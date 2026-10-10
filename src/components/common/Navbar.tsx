'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Truck, 
  Gift, 
  Phone, 
  Mail, 
  User, 
  UserPlus, 
  Search, 
  ChevronDown, 
  Headphones, 
  Heart, 
  ShoppingCart,
  Menu,
  X,
  ShoppingBag,
  MapPin,
  Settings,
  LogOut
} from 'lucide-react';

import { useAuthStore } from '@/store/use-auth-store';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Category {
  _id: string;
  name: string;
}

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Wishlist Counters
  const cart = useCartStore((state) => state.cart);
  const cartCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  const wishlist = useWishlistStore((state) => state.wishlist);
  const wishlistCount = wishlist ? wishlist.length : 0;

  useEffect(() => {
    setIsMounted(true);

    async function fetchCategories() {
      try {
        const res = await fetch('https://ecommerce.routemisr.com/api/v1/categories');
        const data = await res.json();
        if (data.data) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories in Navbar:', error);
      }
    }

    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleCategorySelect = (categoryId?: string) => {
    if (!categoryId) {
      router.push('/categories');
    } else {
      router.push(`/categories/${categoryId}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="hidden md:block border-b border-gray-100 py-2 text-xs text-gray-600 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#0aad0a]" />
              <span>Free Shipping on Orders 500 EGP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-[#0aad0a]" />
              <span>New Arrivals Daily</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center gap-1.5 hover:text-[#0aad0a] transition-colors cursor-pointer">
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              <span>+1 (800) 123-4567</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 hover:text-[#0aad0a] transition-colors cursor-pointer">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              <span>support@freshcart.com</span>
            </div>

            <div className="hidden lg:block h-3 w-px bg-gray-200" />

            {!isAuthenticated && (
              <div className="flex items-center gap-3 font-medium">
                <Link href="/login" className="flex items-center gap-1 hover:text-[#0aad0a] transition-colors">
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link href="/signup" className="flex items-center gap-1 hover:text-[#0aad0a] transition-colors">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 py-3 sm:py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-6">
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 text-gray-700 hover:text-[#0aad0a] focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <div className="flex items-center justify-center text-[#0aad0a]">
                  <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  FreshCart
                </span>
              </Link>
            </div>

            {/* Filtering Input Form */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 max-w-xs md:max-w-md relative">
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="w-full pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-full text-xs md:text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#0aad0a] transition-all"
                />
                <button 
                  type="submit"
                  className="absolute right-1 w-7 h-7 bg-[#0aad0a] hover:bg-[#088d08] text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="hidden lg:flex items-center gap-5 xl:gap-6 font-medium text-sm text-gray-700">
              <Link href="/" className="hover:text-[#0aad0a] transition-colors">Home</Link>
              <Link href="/products" className="hover:text-[#0aad0a] transition-colors">Shop</Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-1 hover:text-[#0aad0a] cursor-pointer transition-colors outline-none">
                    <span>Categories</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-white border border-gray-100 shadow-lg p-1">
                  <DropdownMenuLabel>Select Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleCategorySelect()}
                    className="cursor-pointer hover:bg-emerald-50 hover:text-[#0aad0a] font-semibold"
                  >
                    All Categories
                  </DropdownMenuItem>
                  {categories.map((cat) => (
                    <DropdownMenuItem 
                      key={cat._id} 
                      onClick={() => handleCategorySelect(cat._id)}
                      className="cursor-pointer hover:bg-emerald-50 hover:text-[#0aad0a]"
                    >
                      {cat.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/brands" className="hover:text-[#0aad0a] transition-colors">Brands</Link>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <Link href="/contact" className="hidden xl:flex items-center gap-2.5 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#0aad0a] group-hover:bg-[#0aad0a] group-hover:text-white transition-colors">
                  <Headphones className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-xs leading-tight">
                  <span className="text-gray-400">Support</span>
                  <span className="font-bold text-slate-800 group-hover:text-[#0aad0a] transition-colors">24/7 Help</span>
                </div>
              </Link>

              <div className="h-8 w-px bg-gray-200 hidden xl:block" />

              {/* Wishlist Link with Badge */}
              <Link href="/wishlist" className="relative text-gray-700 hover:text-[#0aad0a] transition-colors p-1">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                {isMounted && wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] sm:text-[11px] font-bold rounded-full min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] flex items-center justify-center px-1 shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Cart Link with Badge */}
              <Link href="/cart" className="relative text-gray-700 hover:text-[#0aad0a] transition-colors p-1">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                {isMounted && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#0aad0a] text-white text-[10px] sm:text-[11px] font-bold rounded-full min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] flex items-center justify-center px-1 shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Account Dropdown */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-[#0aad0a] hover:bg-[#088d08] text-white font-medium rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm flex items-center gap-2 shadow-sm focus:outline-none">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="hidden sm:inline font-semibold">{user?.name || 'Account'}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-white/80" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-100 shadow-xl p-2 rounded-2xl">
                    <DropdownMenuLabel className="text-xs text-gray-400 font-normal">
                      Signed in as <br />
                      <strong className="text-sm font-bold text-gray-900">{user?.name || 'User'}</strong>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1" />
                    
<DropdownMenuItem 
  onClick={() => router.push('/profile/addresses')}
  className="cursor-pointer hover:bg-emerald-50 hover:text-[#0aad0a] font-semibold text-xs flex items-center gap-2.5 py-2 rounded-xl"
>
  <User className="w-4 h-4" /> My Profile
</DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => router.push('/orders')}
                      className="cursor-pointer hover:bg-emerald-50 hover:text-[#0aad0a] font-semibold text-xs flex items-center gap-2.5 py-2 rounded-xl"
                    >
                      <ShoppingBag className="w-4 h-4" /> My Orders
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => router.push('/wishlist')}
                      className="cursor-pointer hover:bg-emerald-50 hover:text-[#0aad0a] font-semibold text-xs flex items-center gap-2.5 py-2 rounded-xl"
                    >
                      <Heart className="w-4 h-4" /> My Wishlist
                    </DropdownMenuItem>



                    <DropdownMenuItem 
                      onClick={() => router.push('/profile/settings')}
                      className="cursor-pointer hover:bg-emerald-50 hover:text-[#0aad0a] font-semibold text-xs flex items-center gap-2.5 py-2 rounded-xl"
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1" />
                    
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="cursor-pointer hover:bg-red-50 text-red-600 font-bold text-xs flex items-center gap-2.5 py-2 rounded-xl"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" className="hidden sm:block">
                  <Button className="bg-[#0aad0a] hover:bg-[#088d08] text-white font-semibold rounded-full px-4 sm:px-6 py-2 text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-colors">
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              )}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}