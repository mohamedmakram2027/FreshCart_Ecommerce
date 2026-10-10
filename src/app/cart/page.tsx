'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, Plus, Minus, UserCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/use-auth-store';

export default function CartPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { cart, updateQuantity, removeFromCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  if (!isMounted) return null;

  // Total Quantity and Price Calculation
  const totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

  // Handle Quantity Increase / Decrease safely
  const handleIncrease = (item: any) => {
    const currentQty = Number(item.quantity) || 1;
    const itemId = item.id ?? item._id;
    updateQuantity(itemId, currentQty + 1);
    showToast('Product quantity updated');
  };

  const handleDecrease = (item: any) => {
    const currentQty = Number(item.quantity) || 1;
    if (currentQty > 1) {
      const itemId = item.id ?? item._id;
      updateQuantity(itemId, currentQty - 1);
      showToast('Product quantity updated');
    }
  };

  // Confirm Product Deletion
  const confirmDelete = () => {
    if (deletingId !== null) {
      removeFromCart(deletingId as any);
      setDeletingId(null);
      showToast('Product deleted successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg border border-slate-700 animate-in slide-in-from-bottom-5 duration-300 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-900 mb-2">Remove Item</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete this product from your shopping cart?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </nav>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#0aad0a] text-white p-2.5 rounded-xl shadow-sm flex items-center justify-center">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Shopping Cart
            </h1>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            You have <span className="text-[#0aad0a] font-bold">{totalItems} items</span> in your cart
          </p>
        </div>

        {/* Empty Cart State */}
        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto my-12">
            <div className="w-16 h-16 bg-emerald-50 text-[#0aad0a] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Your shopping cart is empty</h2>
            <p className="text-gray-500 text-sm mb-6">Explore our products and add items to your cart.</p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-[#0aad0a] hover:bg-[#088d08] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Main Cart Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Products List (Left Side) */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item: any) => {
                const itemImg = item.image || item.imageCover || item.images?.[0] || '';
                const itemTitle = item.title || item.name || 'Product';
                const itemCategory = item.category?.name || item.category || "Men's Fashion";
                const itemId = item.id ?? item._id;

                return (
                  <div
                    key={itemId}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6"
                  >
                    {/* Product Image & Info */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100 relative">
                        {itemImg ? (
                          <Image
                            src={itemImg}
                            alt={itemTitle}
                            fill
                            sizes="96px"
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-100">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="font-semibold text-slate-900 text-base leading-snug">
                          {itemTitle}
                        </h3>
                        <span className="inline-block bg-emerald-50 text-[#0aad0a] text-xs px-2.5 py-1 rounded-full font-medium">
                          {itemCategory}
                        </span>
                        <div className="text-[#0aad0a] font-bold text-lg pt-1">
                          {item.price.toLocaleString()} EGP
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
                        <button
                          onClick={() => handleDecrease(item)}
                          disabled={item.quantity <= 1}
                          className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded-md transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrease(item)}
                          className="p-1.5 bg-[#0aad0a] hover:bg-[#088d08] text-white rounded-md transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Total Price & Delete Button */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                            Total
                          </div>
                          <div className="text-slate-900 font-bold text-base">
                            {(item.price * item.quantity).toLocaleString()}{' '}
                            <span className="text-xs font-normal text-gray-500">EGP</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setDeletingId(itemId)}
                          className="p-2.5 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 rounded-xl transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Side Card */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
              <div className="bg-slate-900 text-white px-6 py-4">
                <h2 className="text-lg font-bold">Order Summary</h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-4 text-sm pb-4 border-b border-gray-100">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-bold text-slate-900">{subtotal.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Shipping</span>
                    <span className="text-[#0aad0a] font-medium">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg font-extrabold text-slate-900">
                  <span>Estimated Total</span>
                  <span className="text-[#0aad0a]">{subtotal.toLocaleString()} EGP</span>
                </div>

                <div className="space-y-3">
                  {isAuthenticated ? (
                    <button
                      onClick={() => router.push('/main/checkout')}
                      className="w-full bg-[#0aad0a] hover:bg-[#088d08] text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      <span>Proceed to Checkout</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push('/login')}
                      className="w-full bg-[#0aad0a] hover:bg-[#088d08] text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      <UserCheck className="w-5 h-5" />
                      <span>Login to Checkout</span>
                    </button>
                  )}

                  {!isAuthenticated && (
                    <p className="text-center text-xs text-gray-500">
                      Don&apos;t have an account?{' '}
                      <Link href="/register" className="text-[#0aad0a] font-semibold hover:underline">
                        Sign up
                      </Link>
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">✓</span> Your cart items will be saved
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">✓</span> Track your orders easily
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">✓</span> Access exclusive member deals
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}