import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product } from '@/types';

type CartState = {
  items: CartItem[];
  add: (product: Product) => void;
  increase: (id: number) => void;
  decrease: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (product: Product) =>
        set((state) => {
          const found = state.items.find((item) => item.product.id === product.id);
          if (found) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
              ),
            };
          }
          return { items: [...state.items, { product, qty: 1 }] };
        }),
      increase: (id: number) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === id ? { ...item, qty: item.qty + 1 } : item
          ),
        })),
      decrease: (id: number) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product.id === id ? { ...item, qty: item.qty - 1 } : item
            )
            .filter((item) => item.qty > 0),
        })),
      remove: (id: number) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== id),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'product_shop_cart',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useCartCount = () =>
  useCart((state) => state.items.reduce((acc, item) => acc + item.qty, 0));

export const useCartTotal = () =>
  useCart((state) =>
    state.items.reduce((sum, item) => sum + item.product.price * item.qty, 0)
  );

export const useCartItemQty = (productId: number) =>
  useCart((state) => state.items.find((i) => i.product.id === productId)?.qty ?? 0);

