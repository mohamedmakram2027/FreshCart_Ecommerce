'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye, RefreshCw, Star, Plus, Check } from 'lucide-react';

import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

export interface Product {
  _id: string;
  id?: string;
  title: string;
  slug?: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  category: {
    name: string;
  };
  ratingsAverage: number;
  ratingsQuantity?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToWishlist?: (id: string) => void;
}

export default function ProductCard({ product, onAddToWishlist }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const productId = product._id || product.id || '';
  const isFavorite = isInWishlist(productId);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        _id: productId,
        title: product.title,
        price: product.priceAfterDiscount || product.price,
        imageCover: product.imageCover,
        category: product.category,
      });
    }

    if (onAddToWishlist) {
      onAddToWishlist(productId);
    }
  };

  const originalPrice = product.price;
  const currentPrice = product.priceAfterDiscount || product.price;
  const hasDiscount = Boolean(
    product.priceAfterDiscount && product.priceAfterDiscount < product.price
  );

  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdded) return;

    addToCart(product as any);
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden p-3 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between h-full">
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-20 bg-[#ff3838] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
          -{discountPercentage}%
        </div>
      )}

      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
        <button
          type="button"
          onClick={toggleWishlist}
          title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`w-8 h-8 rounded-full border shadow-md flex items-center justify-center transition-all duration-150 active:scale-95 ${
            isFavorite
              ? 'bg-red-50 border-red-200 text-red-500'
              : 'bg-white border-gray-100 text-gray-600 hover:text-red-500 hover:border-red-100'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
        </button>

        <button
          type="button"
          title="Compare"
          className="w-8 h-8 rounded-full bg-white border border-gray-100 text-gray-600 hover:text-[#0aad0a] hover:border-emerald-100 shadow-md flex items-center justify-center transition-all duration-150 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <Link
          href={`/products/${productId}`}
          title="Quick View"
          className="w-8 h-8 rounded-full bg-white border border-gray-100 text-gray-600 hover:text-[#0aad0a] hover:border-emerald-100 shadow-md flex items-center justify-center transition-all duration-150 active:scale-95"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>

      <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
        <Link href={`/products/${productId}`} className="relative w-full h-full block">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      <div className="flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[11px] sm:text-xs text-slate-500 font-medium block mb-1">
            {product.category?.name || 'Category'}
          </span>

          <Link href={`/products/${productId}`}>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-800 hover:text-[#0aad0a] transition-colors line-clamp-2 min-h-[36px] mb-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.ratingsAverage || 4)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-200 fill-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium ml-0.5">
              {product.ratingsAverage}{' '}
              {product.ratingsQuantity ? `(${product.ratingsQuantity})` : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span
              className={`text-sm sm:text-base font-extrabold ${
                hasDiscount ? 'text-[#0aad0a]' : 'text-slate-900'
              }`}
            >
              {currentPrice} EGP
            </span>

            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through font-normal">
                {originalPrice} EGP
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all duration-300 shrink-0 ${
              isAdded
                ? 'bg-emerald-600 text-white scale-105'
                : 'bg-[#0aad0a] hover:bg-[#088d08] text-white'
            }`}
          >
            {isAdded ? (
              <Check className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <Plus className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}