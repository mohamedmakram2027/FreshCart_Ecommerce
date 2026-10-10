'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building, 
  MapPin, 
  Phone, 
  Plus, 
  Check, 
  CreditCard, 
  Banknote, 
  Lock, 
  ArrowLeft, 
  Loader2,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import Cookies from 'js-cookie';

import { useCartStore } from '@/store/useCartStore';

interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const token = Cookies.get('token');

  const { cart, cartId, clearCart } = useCartStore();

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
  const [isLoadingAddresses, setIsLoadingLoadingAddresses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address Form Inputs
  const [formData, setFormData] = useState({
    details: '',
    phone: '',
    city: '',
  });

  // Calculate Summary
  const subtotal = cart ? cart.reduce((acc, item) => acc + item.price * item.quantity, 0) : 0;
  const shippingFee = 50;
  const total = subtotal + shippingFee;

  // Fetch Saved Addresses
  useEffect(() => {
    async function fetchAddresses() {
      if (!token) {
        setIsLoadingLoadingAddresses(false);
        setUseCustomAddress(true);
        return;
      }

      try {
        const res = await fetch('https://ecommerce.routemisr.com/api/v1/addresses', {
          headers: { token },
        });
        const data = await res.json();

        if (data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) {
          setSavedAddresses(data.data);
          const firstAddr = data.data[0];
          setSelectedAddressId(firstAddr._id);
          setFormData({
            details: firstAddr.details || '',
            phone: firstAddr.phone || '',
            city: firstAddr.city || '',
          });
        } else {
          setUseCustomAddress(true);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        setUseCustomAddress(true);
      } finally {
        setIsLoadingLoadingAddresses(false);
      }
    }

    fetchAddresses();
  }, [token]);

  // Handle selecting a saved address
  const handleSelectSavedAddress = (addr: Address) => {
    setSelectedAddressId(addr._id);
    setUseCustomAddress(false);
    setFormData({
      details: addr.details || '',
      phone: addr.phone || '',
      city: addr.city || '',
    });
  };

  // Switch to new custom address input
  const handleSelectCustomAddress = () => {
    setSelectedAddressId(null);
    setUseCustomAddress(true);
    setFormData({ details: '', phone: '', city: '' });
  };

  // Place Order Action
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.city || !formData.details || !formData.phone) {
      alert('Please fill in all address details');
      return;
    }

    setIsSubmitting(true);

    const shippingAddress = {
      details: formData.details,
      phone: formData.phone,
      city: formData.city,
    };

    try {
      if (paymentMethod === 'online') {
        // Stripe Online Checkout Session API
        const domain = window.location.origin;
        const res = await fetch(
          `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${encodeURIComponent(domain)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: token || '',
            },
            body: JSON.stringify({ shippingAddress }),
          }
        );

        const data = await res.json();

        if (data.status === 'success' && data.session?.url) {
          window.location.href = data.session.url; // Redirect to Stripe Checkout
        } else {
          throw new Error(data.message || 'Failed to initialize Stripe payment session');
        }
      } else {
        // Cash on Delivery Order API
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/${cartId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: token || '',
          },
          body: JSON.stringify({ shippingAddress }),
        });

        const data = await res.json();

        if (data.status === 'success') {
          clearCart();
          router.push('/orders?success=true');
        } else {
          throw new Error(data.message || 'Failed to place cash order');
        }
      }
    } catch (error: any) {
      alert(error.message || 'Something went wrong while processing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#0aad0a] font-bold text-sm mb-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Building className="w-4 h-4 text-[#0aad0a]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Complete Your Order
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Review your items and complete your purchase
            </p>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#0aad0a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
        </div>

        {/* Main Grid */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Addresses & Payment Form */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Shipping Address Box */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#0aad0a] text-white px-6 py-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-base leading-tight">Shipping Address</h3>
                  <p className="text-xs text-white/80">Where should we deliver your order?</p>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Saved Addresses List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0aad0a]"></span> Saved Addresses
                  </h4>
                  <p className="text-xs text-gray-400">Select a saved address or enter a new one below</p>

                  {isLoadingAddresses ? (
                    <div className="p-6 text-center text-gray-400">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedAddressId === addr._id && !useCustomAddress;

                        return (
                          <div
                            key={addr._id}
                            onClick={() => handleSelectSavedAddress(addr)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? 'border-[#0aad0a] bg-emerald-50/40 shadow-sm'
                                : 'border-gray-100 bg-white hover:border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-[#0aad0a] text-white' : 'border border-gray-300'
                                }`}
                              >
                                {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                              </div>
                              <div>
                                <h5 className="font-bold text-slate-900 text-sm">{addr.name}</h5>
                                <p className="text-xs text-gray-500 line-clamp-1">{addr.details}</p>
                                <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold mt-1">
                                  <span>📞 {addr.phone}</span>
                                  <span>🏙️ {addr.city}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Option to use a different address */}
                      <div
                        onClick={handleSelectCustomAddress}
                        className={`p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all flex items-center gap-3 ${
                          useCustomAddress
                            ? 'border-[#0aad0a] bg-emerald-50/40'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            useCustomAddress ? 'bg-[#0aad0a] text-white' : 'bg-slate-100 text-gray-500'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 text-sm">Use a different address</h5>
                          <p className="text-xs text-gray-400">Enter a new shipping address manually</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dynamic Address Details Form Inputs */}
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 text-xs text-blue-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                    <span>
                      {useCustomAddress
                        ? 'Enter your shipping address details below.'
                        : 'Using your saved address. You can edit the details below if needed.'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cairo"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Street name, building, apartment..."
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="01xxxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Egyptian numbers only</p>
                  </div>
                </div>

              </div>
            </div>

            {/* 2. Payment Method Box */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#0aad0a] text-white px-6 py-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-base leading-tight">Payment Method</h3>
                  <p className="text-xs text-white/80">Choose how you&apos;d like to pay</p>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'cash'
                      ? 'border-[#0aad0a] bg-emerald-50/40 shadow-sm'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-gray-600">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Cash on Delivery</h4>
                      <p className="text-xs text-gray-400">Pay when your order arrives at your doorstep</p>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'cash' ? 'border-[#0aad0a] bg-[#0aad0a] text-white' : 'border-gray-300'
                    }`}
                  >
                    {paymentMethod === 'cash' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Pay Online via Stripe */}
                <div
                  onClick={() => setPaymentMethod('online')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'online'
                      ? 'border-[#0aad0a] bg-emerald-50/40 shadow-sm'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Pay Online</h4>
                      <p className="text-xs text-gray-400">Secure payment with Credit/Debit Card via Stripe</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">VISA</span>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">MasterCard</span>
                        <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Amex</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'online' ? 'border-[#0aad0a] bg-[#0aad0a] text-white' : 'border-gray-300'
                    }`}
                  >
                    {paymentMethod === 'online' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* SSL Security note */}
                <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-800">
                  <Lock className="w-5 h-5 text-[#0aad0a] shrink-0" />
                  <div>
                    <h5 className="font-bold">Secure & Encrypted</h5>
                    <p className="text-emerald-600">Your payment info is protected with 256-bit SSL encryption</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-6 p-6">
              
              <div className="bg-[#0aad0a] text-white -mx-6 -mt-6 px-6 py-4 flex items-center justify-between">
                <h3 className="font-bold text-base">Order Summary</h3>
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold">
                  {cart?.length || 0} {cart?.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-gray-50">
                {cart?.map((item) => (
                  <div key={item.id || item._id} className="flex items-center justify-between pt-3 gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <img src={item.imageCover} alt={item.title} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 line-clamp-1">{item.title}</h5>
                        <p className="text-gray-400">{item.quantity} × {item.price} EGP</p>
                      </div>
                    </div>
                    <span className="font-black text-slate-900 shrink-0">{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Calculation Summary */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{subtotal} EGP</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-slate-900">{shippingFee} EGP</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-[#0aad0a] text-base">{total} EGP</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !cart || cart.length === 0}
                className="w-full bg-[#0aad0a] hover:bg-[#088d08] text-white font-extrabold py-3.5 rounded-2xl transition-all text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{paymentMethod === 'online' ? 'Proceed to Payment' : 'Place Order'}</span>
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-[10px] text-center text-gray-500 font-semibold">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#0aad0a]" />
                  <span>Secure</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-[#0aad0a]" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-[#0aad0a]" />
                  <span>Easy Returns</span>
                </div>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
}