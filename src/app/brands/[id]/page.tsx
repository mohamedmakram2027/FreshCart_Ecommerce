'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, Loader2, ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/Products/ProductCard';

interface Brand {
  _id: string;
  name: string;
  image: string;
}

export default function BrandProductsPage() {
  const params = useParams();
  const brandId = params?.id as string;

  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBrandData() {
      if (!brandId) return;
      setIsLoading(true);

      try {
        // Fetch Brand details
        const brandRes = await fetch(`https://ecommerce.routemisr.com/api/v1/brands/${brandId}`);
        const brandData = await brandRes.json();
        if (brandData.data) {
          setBrand(brandData.data);
        }

        // Fetch Products for this specific Brand
        const prodRes = await fetch(`https://ecommerce.routemisr.com/api/v1/products?brand=${brandId}`);
        const prodData = await prodRes.json();
        if (prodData.data) {
          setProducts(prodData.data);
        }
      } catch (error) {
        console.error('Error fetching brand products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBrandData();
  }, [brandId]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Purple Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <Link href="/brands" className="hover:underline">Brands</Link>
              <span>/</span>
              <span className="text-white font-semibold">{brand?.name || 'Brand Products'}</span>
            </div>

            <Link
              href="/brands"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Brands
            </Link>
          </div>

          <div className="flex items-center gap-4 pt-2">
            {brand?.image ? (
              <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center shrink-0 shadow-md">
                <img src={brand.image} alt={brand.name} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                <Tag className="w-7 h-7" />
              </div>
            )}

            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {brand?.name || 'Brand Products'}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 mt-1 font-medium">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-purple-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 space-y-3">
            <Tag className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No products found for this brand</h3>
            <p className="text-xs text-gray-500">Check back later or browse other top brands.</p>
            <Link
              href="/brands"
              className="inline-block bg-purple-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-purple-700 transition-colors"
            >
              Explore Brands
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}