'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Heart, Star, Plus, Eye, RefreshCw } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface Product {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
  priceAfterDiscount?: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  category: {
    name: string;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // جلب دالة الإضافة للسلة من الـ Store
  // سنفحص addToCart أو addToCart / addItem لتفادي اختلاف المسميات
  const cartStore = useCartStore() as any;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('https://ecommerce.routemisr.com/api/v1/products');
        const data = await res.json();
        if (data.data) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();

    // اختيار الدالة الموجودة بالفعل في الـ Store
    const addFn = cartStore.addToCart || cartStore.addItem || cartStore.addProduct;

    if (typeof addFn === 'function') {
      addFn({
        _id: product._id,
        id: product._id,
        title: product.title,
        price: product.priceAfterDiscount || product.price,
        imageCover: product.imageCover,
        image: product.imageCover,
        category: product.category,
        ratingsAverage: product.ratingsAverage,
        quantity: 1,
      });
    } else {
      console.error('Cart add function not found in useCartStore');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Hero Header Section */}
      <div className="bg-[#0aad0a] text-white py-10 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-xs font-medium text-emerald-100 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-white font-semibold">All Products</span>
          </nav>

          {/* Title & Subtitle */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-inner">
              <Package className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">All Products</h1>
              <p className="text-emerald-100 text-sm sm:text-base mt-1 font-normal">
                Explore our complete product collection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Products Count Indicator */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-500">
            Showing <span className="font-bold text-gray-800">{products.length}</span> products
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {products.map((product) => {
              const discountPercentage = product.priceAfterDiscount
                ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
                : null;

              return (
                <div
                  key={product._id}
                  className="group relative bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Upper Image Section */}
                  <div className="relative w-full h-52 bg-gray-50 rounded-lg overflow-hidden mb-3">
                    {/* Discount Badge */}
                    {discountPercentage && (
                      <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        -{discountPercentage}%
                      </span>
                    )}

                    <Link href={`/products/${product._id}`}>
                      <Image
                        src={product.imageCover}
                        alt={product.title}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Quick Action Buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        type="button"
                        className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-gray-50 border border-gray-100 shadow-sm transition-colors"
                        title="Add to Wishlist"
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-[#0aad0a] hover:bg-gray-50 border border-gray-100 shadow-sm transition-colors"
                        title="Compare"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/products/${product._id}`}
                        className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-[#0aad0a] hover:bg-gray-50 border border-gray-100 shadow-sm transition-colors"
                        title="Quick View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] text-gray-400 font-medium block mb-1">
                        {product.category?.name}
                      </span>
                      <Link href={`/products/${product._id}`}>
                        <h3 className="text-xs font-bold text-slate-800 line-clamp-1 hover:text-[#0aad0a] transition-colors mb-2">
                          {product.title}
                        </h3>
                      </Link>

                      {/* Star Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.ratingsAverage)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-200 fill-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-gray-400 font-medium">
                          {product.ratingsAverage} ({product.ratingsQuantity})
                        </span>
                      </div>
                    </div>

                    {/* Price & Add to Cart Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <div className="flex flex-col">
                        {product.priceAfterDiscount ? (
                          <>
                            <span className="text-sm font-black text-slate-900">
                              {product.priceAfterDiscount} EGP
                            </span>
                            <span className="text-[11px] text-gray-400 line-through">
                              {product.price} EGP
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-black text-slate-900">
                            {product.price} EGP
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-8 h-8 bg-[#0aad0a] hover:bg-[#088d08] text-white rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-all"
                        title="Add to Cart"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}