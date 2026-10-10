'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '@/services/products';
import { Button } from '@/components/ui/button';
import { Star, Heart } from 'lucide-react';
import Link from 'next/link';
import HeroSlider from '@/components/home/HeroSlider';
import FeaturesBar from '@/components/home/FeaturesBar'; 
import CategorySection from '@/components/home/CategorySection';
import PromoBanners from '@/components/home/PromoBanners';
import ProductCard from '@/components/Products/ProductCard';

export default function HomePage() {
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const handleAddToCart = (id: string) => {
    console.log('Add to cart:', id);
  };

  const handleAddToWishlist = (id: string) => {
    console.log('Add to wishlist:', id);
  };

  return (
    <div className="space-y-8 py-4">
      {/* 1. Hero Slider Section */}
      <HeroSlider />

      {/* 2. Features / Services Bar */}
      <FeaturesBar />

      {/* 3. Shop By Category Section */}
      <CategorySection />

      {/* 4. Promotional Banners */}
      <PromoBanners />

      {/* 5. CATEGORIES SLIDER / GRID */}


      {/* 6. PRODUCTS GRID WITH NEW DESIGN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-7 bg-[#0aad0a] rounded-full inline-block" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Featured <span className="text-[#0aad0a]">Products</span>
          </h2>
        </div>

        {isProductsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {products?.map((product: any) => (
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

      {/* 7. Bottom Features Bar */}
      <FeaturesBar />
    </div>
  );
}