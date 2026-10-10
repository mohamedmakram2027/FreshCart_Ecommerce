'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Layers, Loader2 } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  image: string;
}

function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  // Fetch All Main Categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoadingCategories(true);
        const res = await fetch('https://ecommerce.routemisr.com/api/v1/categories');
        const data = await res.json();
        if (data.data) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* HEADER SECTION */}
      <div className="bg-[#0aad0a] text-white py-10 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">All Categories</h1>
            <p className="text-sm text-emerald-100 mt-1">
              Browse our wide range of product categories
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* MAIN CATEGORIES GRID */}
        <div>
          {loadingCategories ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#0aad0a]" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/categories/${cat._id}`}
                  className="bg-white rounded-2xl p-4 border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1 group flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-square relative mb-3 bg-gray-50 rounded-xl overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm group-hover:text-[#0aad0a] transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#0aad0a]" /></div>}>
      <CategoriesContent />
    </Suspense>
  );
}