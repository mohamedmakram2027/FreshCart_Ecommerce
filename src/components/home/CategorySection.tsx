'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

const categories: Category[] = [
  { id: '1', name: 'Music', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop', slug: 'music' },
  { id: '2', name: "Men's Fashion", image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=300&auto=format&fit=crop', slug: 'mens-fashion' },
  { id: '3', name: "Women's Fashion", image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop', slug: 'womens-fashion' },
  { id: '4', name: 'SuperMarket', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=300&auto=format&fit=crop', slug: 'supermarket' },
  { id: '5', name: 'Baby & Toys', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=300&auto=format&fit=crop', slug: 'baby-toys' },
  { id: '6', name: 'Home', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=300&auto=format&fit=crop', slug: 'home' },
  { id: '7', name: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&auto=format&fit=crop', slug: 'books' },
  { id: '8', name: 'Beauty & Health', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=300&auto=format&fit=crop', slug: 'beauty-health' },
  { id: '9', name: 'Mobiles', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&auto=format&fit=crop', slug: 'mobiles' },
  { id: '10', name: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop', slug: 'electronics' },
];

export default function CategorySection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* Vertical Green Indicator Line */}
          <span className="w-1.5 h-7 bg-[#0aad0a] rounded-full inline-block" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Shop By <span className="text-[#0aad0a]">Category</span>
          </h2>
        </div>

        {/* View All Categories Link */}
        <Link
          href="/categories"
          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#0aad0a] hover:text-[#088d08] transition-colors group"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid Layout (2 cols mobile, 3 cols tablet, 6 cols desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group flex flex-col items-center justify-between bg-white border border-gray-100/80 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 text-center"
          >
            {/* Image Circle Container */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 bg-gray-50 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-cover"
              />
            </div>

            {/* Category Name */}
            <span className="text-xs sm:text-sm font-medium text-slate-800 group-hover:text-[#0aad0a] transition-colors line-clamp-1">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}