'use client';

import { useEffect, useState } from 'react';
import ProductCard, { Product } from '@/components/Products/ProductCard';
import { Loader2 } from 'lucide-react';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        setLoading(true);
        const res = await fetch('https://ecommerce.routemisr.com/api/v1/products?limit=10');
        if (!res.ok) throw new Error('Failed to fetch products');
        
        const data = await res.json();
        setProducts(data.data || []);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (id: string) => {
    // سيتم ربطها بـ Zustand Cart Store لاحقاً
    console.log('Add to cart:', id);
  };

  const handleAddToWishlist = (id: string) => {
    console.log('Add to wishlist:', id);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-1.5 h-7 bg-[#0aad0a] rounded-full inline-block" />
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Featured <span className="text-[#0aad0a]">Products</span>
        </h2>
      </div>

      {/* Loading Skeleton / Spinner */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-[#0aad0a]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2 text-sm font-medium text-gray-600">Loading products...</span>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div className="text-center py-10 text-red-500 font-medium text-sm">
          Failed to load products. Please check your internet connection.
        </div>
      )}

      {/* Products Grid (5 cols on Desktop like the image, 2-3 on tablet/mobile) */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      )}
    </section>
  );
}