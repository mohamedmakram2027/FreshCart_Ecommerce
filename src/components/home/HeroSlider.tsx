'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  bgImage: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Fresh Products Delivered\nto your Door',
    subtitle: 'Get 20% off your first order',
    primaryBtnText: 'Shop Now',
    primaryBtnLink: '/products',
    secondaryBtnText: 'View Deals',
    secondaryBtnLink: '/deals',
    bgImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Quality Organic Food\nFor Daily Life',
    subtitle: 'Fresh vegetables and fruits direct from farms',
    primaryBtnText: 'Explore Category',
    primaryBtnLink: '/categories',
    secondaryBtnText: 'Top Offers',
    secondaryBtnLink: '/offers',
    bgImage: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Healthy Grocery\nBest Prices Every Day',
    subtitle: 'Save time and money with FreshCart delivery',
    primaryBtnText: 'Start Shopping',
    primaryBtnLink: '/products',
    secondaryBtnText: 'Special Discounts',
    secondaryBtnLink: '/discounts',
    bgImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1600&auto=format&fit=crop',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Autoplay slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <section className="relative w-full overflow-hidden bg-emerald-950 text-white">
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-[340px] sm:h-[400px] md:h-[450px]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="min-w-full relative flex items-center bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.bgImage}')` }}
          >
            {/* Green Overlay Gradient strictly matching design */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0aad0a]/90 via-[#0aad0a]/75 to-[#0aad0a]/30" />

            {/* Content Box */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full">
              <div className="max-w-xl space-y-3 sm:space-y-4">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight whitespace-pre-line tracking-tight text-white drop-shadow-sm">
                  {slide.title}
                </h1>
                
                <p className="text-xs sm:text-sm md:text-base font-medium text-emerald-50/90">
                  {slide.subtitle}
                </p>

                <div className="flex items-center gap-3 pt-2 sm:pt-4">
                  <Link
                    href={slide.primaryBtnText ? slide.primaryBtnLink : '/products'}
                    className="bg-white hover:bg-emerald-50 text-[#0aad0a] font-bold text-xs sm:text-sm px-5 sm:px-7 py-2.5 rounded-md shadow-md transition-all duration-200"
                  >
                    {slide.primaryBtnText}
                  </Link>

                  <Link
                    href={slide.secondaryBtnLink}
                    className="border border-white/80 hover:bg-white/10 text-white font-medium text-xs sm:text-sm px-5 sm:px-6 py-2.5 rounded-md transition-all duration-200"
                  >
                    {slide.secondaryBtnText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 bg-white/90 hover:bg-white text-emerald-800 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 bg-white/90 hover:bg-white text-emerald-800 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}