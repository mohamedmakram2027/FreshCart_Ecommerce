'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PromoBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Left Banner - Deal of the Day (Slide in from Left) */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00a859] via-[#008a47] to-[#006835] p-6 sm:p-8 text-white shadow-lg flex flex-col justify-between min-h-[220px]"
        >
          {/* Subtle Decorative Background Circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          {/* Badge */}
          <div className="relative z-10 flex items-center">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20 shadow-sm">
              <span>🔥</span> Deal of the Day
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 my-4 space-y-1.5">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Fresh Organic Fruits
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              Get up to 40% off on selected organic fruits
            </p>
            <div className="pt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">40% OFF</span>
              <span className="text-xs text-emerald-100/90 font-medium">
                Use code: <strong className="text-white font-bold uppercase tracking-wider">ORGANIC40</strong>
              </span>
            </div>
          </div>

          {/* Call To Action Button */}
          <div className="relative z-10 pt-2">
            <Link
              href="/products?category=fruits"
              className="inline-flex items-center gap-2 bg-white text-[#008a47] hover:bg-emerald-50 text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 group"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Right Banner - New Arrivals (Slide in from Right) */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ff6b35] via-[#ff5226] to-[#f03813] p-6 sm:p-8 text-white shadow-lg flex flex-col justify-between min-h-[220px]"
        >
          {/* Subtle Decorative Background Circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          {/* Badge */}
          <div className="relative z-10 flex items-center">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20 shadow-sm">
              <span>🎉</span> New Arrivals
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 my-4 space-y-1.5">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Exotic Vegetables
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 font-medium">
              Discover our latest collection of premium vegetables
            </p>
            <div className="pt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">25% OFF</span>
              <span className="text-xs text-orange-100/90 font-medium">
                Use code: <strong className="text-white font-bold uppercase tracking-wider">FRESH25</strong>
              </span>
            </div>
          </div>

          {/* Call To Action Button */}
          <div className="relative z-10 pt-2">
            <Link
              href="/products?category=vegetables"
              className="inline-flex items-center gap-2 bg-white text-[#ff5226] hover:bg-orange-50 text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 group"
            >
              <span>Explore Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}