import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  imageCover: string;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: any) => void;
  updateQuantity: (id: string | number, newQuantity: number) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
        const currentCart = get().cart;
        const productId = String(product._id || product.id);
        const existingItem = currentCart.find((item) => item.id === productId);

        if (existingItem) {
          set({
            cart: currentCart.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            cart: [
              ...currentCart,
              {
                id: productId,
                title: product.title,
                price: product.priceAfterDiscount || product.price,
                imageCover: product.imageCover,
                quantity: 1,
              },
            ],
          });
        }
      },

      // دالة تحديث الكمية (حل المشكلة الأساسية)
      updateQuantity: (id, newQuantity) => {
        const targetId = String(id);
        const qty = Math.max(1, Number(newQuantity) || 1);

        set({
          cart: get().cart.map((item) =>
            item.id === targetId ? { ...item, quantity: qty } : item
          ),
        });
      },

      removeFromCart: (id) => {
        const targetId = String(id);
        set({ cart: get().cart.filter((item) => item.id !== targetId) });
      },

      clearCart: () => set({ cart: [] }),

      getTotalCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'freshcart-storage',
    }
  )
);