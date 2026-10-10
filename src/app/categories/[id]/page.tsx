'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Loader2, 
  Folder, 
  Heart, 
  Eye, 
  Star,
  RefreshCw,
  ShoppingCart
} from 'lucide-react';
import toast from 'react-hot-toast';

// استيراد Zustand Cart Store (تأكد من المسار حسب مجلدك مثلاً '@/store/cartStore')
import { useCartStore } from '@/store/useCartStore';

interface SubCategory {
  _id: string;
  name: string;
  category: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  priceAfterDiscount?: number;
  ratingsAverage?: number;
  imageCover: string;
  category: { _id: string; name: string };
  subcategory: { _id: string; name: string }[];
}

interface CategoryDetails {
  _id: string;
  name: string;
}

export default function CategoryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const categoryId = resolvedParams.id;

  // استدعاء دالة الإضافة من Zustand Store
  const addToCart = useCartStore((state) => state.addToCart);

  const [category, setCategory] = useState<CategoryDetails | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const [loadingSubcategories, setLoadingSubcategories] = useState<boolean>(true);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

  // 1. Fetch Category Info and Subcategories
  useEffect(() => {
    async function fetchCategoryAndSubcategories() {
      try {
        setLoadingSubcategories(true);

        const catRes = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${categoryId}`);
        const catData = await catRes.json();
        if (catData.data) {
          setCategory(catData.data);
        }

        const subRes = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${categoryId}/subcategories`);
        const subData = await subRes.json();
        if (subData.data) {
          setSubcategories(subData.data);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      } finally {
        setLoadingSubcategories(false);
      }
    }

    if (categoryId) {
      fetchCategoryAndSubcategories();
    }
  }, [categoryId]);

  // 2. Fetch Products when a Subcategory is selected
  useEffect(() => {
    if (!selectedSubcategory) {
      setProducts([]);
      return;
    }

    async function fetchProductsBySubcategory() {
      try {
        setLoadingProducts(true);
        const prodRes = await fetch(`https://ecommerce.routemisr.com/api/v1/products?subcategory=${selectedSubcategory._id}`);
        const prodData = await prodRes.json();

        if (prodData.data && prodData.data.length > 0) {
          setProducts(prodData.data);
        } else {
          const allCatProdRes = await fetch(`https://ecommerce.routemisr.com/api/v1/products?category=${categoryId}`);
          const allCatProdData = await allCatProdRes.json();
          if (allCatProdData.data) {
            const filtered = allCatProdData.data.filter((p: Product) =>
              p.subcategory?.some((s) => s._id === selectedSubcategory._id)
            );
            setProducts(filtered);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchProductsBySubcategory();
  }, [selectedSubcategory, categoryId]);

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // دالة الإضافة للسلة عبر Zustand Store
  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      addToCart(product);
      toast.success('Product added successfully to your cart 🚀', {
        duration: 2000,
        position: 'top-right',
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to add product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* HEADER SECTION */}
      <div className="bg-[#0aad0a] text-white py-10 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-4">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-100 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Categories</span>
          </Link>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {category ? `${subcategories.length} Subcategories in ${category.name}` : 'Subcategories'}
            </h1>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        
        {/* SUBCATEGORIES FOLDERS GRID */}
        <div>
          {loadingSubcategories ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#0aad0a]" />
            </div>
          ) : subcategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subcategories.map((sub) => {
                const isSelected = selectedSubcategory?._id === sub._id;
                return (
                  <button
                    key={sub._id}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between h-36 bg-white cursor-pointer ${
                      isSelected
                        ? 'border-[#0aad0a] ring-2 ring-[#0aad0a]/20 shadow-md'
                        : 'border-gray-100 hover:border-emerald-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-[#0aad0a]">
                      <Folder className="w-6 h-6 fill-current" />
                    </div>
                    <span className="font-bold text-gray-800 text-base">{sub.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 text-gray-500">
              No subcategories found for this category.
            </div>
          )}
        </div>

        {/* PRODUCTS DISPLAY SECTION */}
        {selectedSubcategory && (
          <div className="space-y-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Products in <span className="text-[#0aad0a]">{selectedSubcategory.name}</span>
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                Showing {products.length} products
              </span>
            </div>

            {loadingProducts ? (
              <div className="flex justify-center items-center py-16 bg-white rounded-2xl border border-gray-100">
                <Loader2 className="w-8 h-8 animate-spin text-[#0aad0a]" />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {products.map((product) => {
                  const isWishlisted = wishlist.includes(product._id);
                  const hasDiscount = Boolean(
                    product.priceAfterDiscount && product.priceAfterDiscount < product.price
                  );

                  return (
                    <div
                      key={product._id}
                      className="group bg-white border border-gray-200/80 rounded-2xl p-4 flex flex-col justify-between relative hover:shadow-lg transition-all duration-300"
                    >
                      {/* TOP ACTION ICONS */}
                      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                        <button
                          onClick={(e) => toggleWishlist(product._id, e)}
                          title="Add to Wishlist"
                          className="p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isWishlisted ? 'fill-red-500 text-red-500' : ''
                            }`}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          title="Compare"
                          className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/products/${product._id}`}
                          title="Quick View"
                          className="p-1.5 rounded-full text-gray-400 hover:text-[#0aad0a] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>

                      {/* PRODUCT IMAGE LINK */}
                      <Link href={`/products/${product._id}`} className="block relative w-full aspect-square my-2">
                        <Image
                          src={product.imageCover}
                          alt={product.title}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* PRODUCT INFO */}
                      <div className="space-y-1.5 pt-2">
                        <span className="text-xs text-gray-400 font-normal block">
                          {product.category?.name || selectedSubcategory.name}
                        </span>

                        <Link href={`/products/${product._id}`}>
                          <h3 className="font-semibold text-gray-800 text-sm line-clamp-1 group-hover:text-[#0aad0a] transition-colors">
                            {product.title}
                          </h3>
                        </Link>

                        {/* Price & Rating */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-sm">
                              {hasDiscount ? product.priceAfterDiscount : product.price} EGP
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-gray-400 line-through">
                                {product.price} EGP
                              </span>
                            )}
                          </div>

                          {product.ratingsAverage !== undefined && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-xs text-gray-500 font-medium">
                                {product.ratingsAverage}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* ADD TO CART BUTTON */}
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="w-full mt-3 flex items-center justify-center gap-2 bg-[#0aad0a] hover:bg-[#088d08] text-white py-2 px-3 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-400">
                No products available in this subcategory right now.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}