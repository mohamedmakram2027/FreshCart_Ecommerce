'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Heart, Trash2, ShoppingCart, Check, ArrowLeft } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, fetchWishlist } = useWishlistStore();
  const { cart, addToCart } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isProductInCart = (productId: string) => {
    return cart?.some(
      (item: any) =>
        (item.product?._id || item.product?.id || item._id || item.id) === productId
    );
  };

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    addToCart(item);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#0aad0a] transition-colors">Home</Link>
            <span>/</span>
            <span className="font-semibold text-gray-800">Wishlist</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shadow-sm border border-red-100">
              <Heart className="w-6 h-6 fill-red-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                My Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {wishlist.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Your wishlist is empty</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Explore our store and save your favorite fresh items here!
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#0aad0a] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#088d08] transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                  {wishlist.map((item) => {
                    const id = item._id || item.id || '';
                    const inCart = isProductInCart(id);

                    return (
                      <tr key={id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl border border-gray-100 bg-gray-50 relative overflow-hidden shrink-0 flex items-center justify-center p-1">
                              <img
                                src={item.imageCover}
                                alt={item.title}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                                {item.title}
                              </h4>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {item.category?.name || "Category"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 font-black text-slate-900">
                          {item.price} EGP
                        </td>

                        <td className="py-4 px-6">
                          {inCart ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#0aad0a] border border-emerald-100">
                              <ShoppingCart className="w-3.5 h-3.5" /> In Cart
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#0aad0a] border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0aad0a]"></span> In Stock
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            {inCart ? (
                              <Link
                                href="/cart"
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-[#0aad0a] font-bold text-xs rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-100"
                              >
                                <Check className="w-4 h-4 text-[#0aad0a]" /> View Cart
                              </Link>
                            ) : (
                              <button
                                onClick={(e) => handleAddToCart(e, item)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0aad0a] text-white font-bold text-xs rounded-xl hover:bg-[#088d08] transition-colors shadow-sm active:scale-95"
                              >
                                <ShoppingCart className="w-4 h-4" /> Add to Cart
                              </button>
                            )}

                            <button
                              onClick={() => removeFromWishlist(id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl border border-gray-200 hover:border-red-100 transition-all"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#0aad0a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}