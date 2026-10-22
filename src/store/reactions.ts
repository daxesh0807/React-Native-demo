import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, ReactionType } from '@/types';

type ReactionState = {
  map: Record<number, { product: Product; type: ReactionType }>;
  toggle: (product: Product, type: ReactionType) => void;
};

export const useReactions = create<ReactionState>()(
  persist(
    (set) => ({
      map: {},
      toggle: (product: Product, type: ReactionType) =>
        set((state) => {
          const current = state.map[product.id]?.type;
          const next = { ...state.map };

          if (current === type) {
            delete next[product.id];
          } else {
            next[product.id] = { product, type };
          }

          return { map: next };
        }),
    }),
    {
      name: 'product_shop_reactions',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useProductReaction = (productId: number) =>
  useReactions((state) => state.map[productId]?.type);

