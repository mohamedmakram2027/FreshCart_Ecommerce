'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Star, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Zap, 
  Heart, 
  Share2, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  FileText, 
  MessageSquare, 
  Loader2,
  Check
} from 'lucide-react';

import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import ProductCard from '@/components/Products/ProductCard';

interface ProductDetails {
  _id: string;
  id?: string;
  title: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images: string[];
  quantity: number;
  sold?: number;
  ratingsAverage: number;
  ratingsQuantity?: number;
  category: {
    _id: string;
    name: string;
  };
  subcategory?: {
    name: string;
  }[];
  brand?: {
    name: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'shipping'>('details');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();

  const isFavorite = product ? isInWishlist(product._id || product.id || '') : false;

  useEffect(() => {
    async function fetchProductData() {
      if (!productId) return;
      setIsLoading(true);

      try {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${productId}`);
        const data = await res.json();

        if (data.data) {
          const item = data.data;
          setProduct(item);
          setSelectedImage(item.imageCover || (item.images && item.images[0]) || '');

          // Fetch Related Products from same category
          if (item.category?._id) {
            const relRes = await fetch(
              `https://ecommerce.routemisr.com/api/v1/products?category=${item.category._id}`
            );
            const relData = await relRes.json();
            if (relData.data) {
              setRelatedProducts(
                relData.data.filter((p: any) => p._id !== item._id).slice(0, 4)
              );
            }
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProductData();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-[#0aad0a] animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <Link
          href="/products"
          className="bg-[#0aad0a] text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-[#088d08] transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const currentPrice = product.priceAfterDiscount || product.price;
  const originalPrice = product.price;
  const hasDiscount = Boolean(product.priceAfterDiscount && product.priceAfterDiscount < product.price);
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const totalPrice = (currentPrice * quantity).toFixed(2);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity } as any);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity } as any);
    router.push('/checkout');
  };

  const toggleWishlist = () => {
    const id = product._id || product.id || '';
    if (isFavorite) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        _id: id,
        title: product.title,
        price: currentPrice,
        imageCover: product.imageCover,
        category: product.category,
      });
    }
  };

  const allImages = Array.from(
    new Set([product.imageCover, ...(product.images || [])].filter(Boolean))
  );

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Main Product Card Grid */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Image
                src={selectedImage || product.imageCover}
                alt={product.title}
                fill
                priority
                className="object-contain p-2"
              />
            </div>

            {/* Thumbnail Navigation */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                      selectedImage === img
                        ? 'border-[#0aad0a] ring-2 ring-[#0aad0a]/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Category & Brand Badges */}
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-[#0aad0a] text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100">
                {product.category?.name || "Women's Fashion"}
              </span>
              {product.brand?.name && (
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {product.brand.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.ratingsAverage || 4)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-200 fill-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-600">
                {product.ratingsAverage || 4.4} ({product.ratingsQuantity || 19} reviews)
              </span>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">{currentPrice} EGP</span>
              {hasDiscount && (
                <>
                  <span className="text-base text-gray-400 line-through">{originalPrice} EGP</span>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Badge */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#0aad0a] border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-[#0aad0a]"></span> In Stock
              </span>
            </div>

            {/* Short Material / Color Info */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
              {product.description || 'Premium quality product crafted with comfortable materials for everyday wear.'}
            </p>

            {/* Quantity Selector */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-gray-700">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-gray-600 hover:text-[#0aad0a] hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-gray-600 hover:text-[#0aad0a] hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  {product.quantity || 222} available
                </span>
              </div>
            </div>

            {/* Total Price Card */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-600">Total Price:</span>
              <span className="text-xl font-black text-[#0aad0a]">{totalPrice} EGP</span>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                className={`py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0aad0a] hover:bg-[#088d08] text-white'
                }`}
              >
                {isAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                <span>{isAdded ? 'Added to Cart' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Wishlist & Share Bar */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={toggleWishlist}
                className="flex-1 py-3 px-4 border border-gray-200 hover:border-red-200 rounded-2xl text-xs font-bold text-gray-700 hover:text-red-500 flex items-center justify-center gap-2 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{isFavorite ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: product.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="p-3 border border-gray-200 hover:border-gray-300 rounded-2xl text-gray-600 hover:text-[#0aad0a] transition-colors"
                title="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Guarantees Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-[11px] font-semibold text-gray-500 text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#0aad0a]" />
                <span>Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-[#0aad0a]" />
                <span>30 Days Return</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#0aad0a]" />
                <span>Secure Payment</span>
              </div>
            </div>

          </div>

        </div>

        {/* Tabs Section: Product Details / Reviews / Shipping */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Tab Headers */}
          <div className="flex border-b border-gray-100 bg-slate-50/50 overflow-x-auto">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'details'
                  ? 'border-[#0aad0a] text-[#0aad0a] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <FileText className="w-4 h-4" /> Product Details
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-[#0aad0a] text-[#0aad0a] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Reviews ({product.ratingsQuantity || 19})
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'shipping'
                  ? 'border-[#0aad0a] text-[#0aad0a] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Truck className="w-4 h-4" /> Shipping & Returns
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6 sm:p-8">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">About this Product</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Information Box */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 space-y-3 text-xs">
                    <h4 className="font-bold text-slate-900 text-sm mb-2">Product Information</h4>
                    <div className="flex justify-between py-1 border-b border-gray-200/60">
                      <span className="text-gray-500">Category</span>
                      <span className="font-semibold text-slate-800">{product.category?.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200/60">
                      <span className="text-gray-500">Subcategory</span>
                      <span className="font-semibold text-slate-800">
                        {product.subcategory?.[0]?.name || 'General'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200/60">
                      <span className="text-gray-500">Brand</span>
                      <span className="font-semibold text-slate-800">{product.brand?.name || 'DeFacto'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Items Sold</span>
                      <span className="font-semibold text-slate-800">{product.sold || 1207}+ sold</span>
                    </div>
                  </div>

                  {/* Key Features Box */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 space-y-3 text-xs">
                    <h4 className="font-bold text-slate-900 text-sm mb-2">Key Features</h4>
                    <div className="space-y-2 text-gray-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#0aad0a]" /> Premium Quality Product
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#0aad0a]" /> 100% Authentic Guarantee
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#0aad0a]" /> Fast & Secure Packaging
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#0aad0a]" /> Quality Tested
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Customer Reviews</h3>
                  <span className="text-xs bg-amber-50 text-amber-700 font-bold px-3 py-1 rounded-full border border-amber-100">
                    ★ {product.ratingsAverage || 4.4} out of 5
                  </span>
                </div>

                <div className="divide-y divide-gray-100 space-y-4">
                  <div className="pt-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0aad0a] font-bold flex items-center justify-center text-xs">
                        SJ
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-slate-900">Sarah Johnson</h5>
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 pl-10">
                      Excellent material and fits perfectly! The delivery was super fast too.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
                <h3 className="text-base font-bold text-slate-900">Shipping Policy</h3>
                <p>
                  We offer fast same-day or next-day shipping depending on your area. All packages are safely sealed and delivered to your doorstep.
                </p>

                <h3 className="text-base font-bold text-slate-900 pt-2">Return & Replacement Policy</h3>
                <p>
                  You can return or exchange any unwashed and unworn product within 30 days of purchase for a full refund or exchange.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct._id} product={relProduct} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}