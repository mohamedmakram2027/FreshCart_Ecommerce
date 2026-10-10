'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, Loader2 } from 'lucide-react';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch('https://ecommerce.routemisr.com/api/v1/brands');
        const data = await res.json();
        if (data.data) {
          setBrands(data.data);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Purple Banner Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-white font-semibold">Brands</span>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md shadow-inner">
              <Tag className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Top Brands</h1>
              <p className="text-xs sm:text-sm text-white/80 mt-1 font-medium">
                Shop from your favorite brands
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-purple-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-500 font-semibold text-sm">No brands available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/brands/${brand._id}`}
                className="group bg-white border border-gray-100 rounded-3xl p-4 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col items-center text-center justify-between"
              >
                <div className="w-full aspect-square relative rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-3 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-contain p-2"
                  />
                </div>
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm mt-3 group-hover:text-purple-600 transition-colors">
                  {brand.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}