import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

export interface WishlistItem {
  _id: string;
  id?: string;
  title: string;
  imageCover: string;
  price: number;
  category?: {
    name: string;
  };
  quantity?: number;
}

interface WishlistState {
  wishlist: WishlistItem[];
  wishlistIds: string[];
  addToWishlist: (product: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  fetchWishlist: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      wishlistIds: [],

      isInWishlist: (productId: string) => {
        return get().wishlistIds.includes(productId);
      },

      fetchWishlist: async () => {
        const token = Cookies.get('token');
        if (!token) return;

        try {
          const res = await fetch('https://ecommerce.routemisr.com/api/v1/wishlist', {
            headers: { token },
          });
          const data = await res.json();
          if (data.status === 'success' && Array.isArray(data.data)) {
            const items = data.data;
            set({
              wishlist: items,
              wishlistIds: items.map((item: WishlistItem) => item._id || item.id || ''),
            });
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      },

      addToWishlist: async (product: WishlistItem) => {
        const id = product._id || product.id || '';
        const token = Cookies.get('token');

        const currentWishlist = get().wishlist;
        const currentIds = get().wishlistIds;

        if (!currentIds.includes(id)) {
          set({
            wishlist: [...currentWishlist, { ...product, _id: id }],
            wishlistIds: [...currentIds, id],
          });
        }

        if (token) {
          try {
            const res = await fetch('https://ecommerce.routemisr.com/api/v1/wishlist', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                token,
              },
              body: JSON.stringify({ productId: id }),
            });
            const data = await res.json();
            if (data.status === 'success' && data.data) {
              set({ wishlistIds: data.data });
            }
          } catch (error) {
            console.error('Error adding to wishlist API:', error);
          }
        }
      },

      removeFromWishlist: async (productId: string) => {
        const token = Cookies.get('token');

        set({
          wishlist: get().wishlist.filter((item) => (item._id || item.id) !== productId),
          wishlistIds: get().wishlistIds.filter((id) => id !== productId),
        });

        if (token) {
          try {
            const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
              method: 'DELETE',
              headers: { token },
            });
            const data = await res.json();
            if (data.status === 'success' && data.data) {
              set({ wishlistIds: data.data });
            }
          } catch (error) {
            console.error('Error removing from wishlist API:', error);
          }
        }
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);