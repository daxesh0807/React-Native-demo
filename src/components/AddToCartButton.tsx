import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Product } from '@/types';
import { useCart, useCartItemQty } from '@/store/cart';

interface AddToCartButtonProps {
  product: Product;
  compact?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, compact = false }) => {
  const qty = useCartItemQty(product.id);
  const add = useCart((s) => s.add);
  const increase = useCart((s) => s.increase);
  const decrease = useCart((s) => s.decrease);

  const handleAdd = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    add(product);
  };

  const handleIncrease = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    increase(product.id);
  };

  const handleDecrease = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    decrease(product.id);
  };

  if (qty > 0) {
    return (
      <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-xl px-2 py-1">
        <TouchableOpacity
          onPress={handleDecrease}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="w-7 h-7 bg-white rounded-lg items-center justify-center shadow-xs"
        >
          <Ionicons name="remove" size={16} color="#2563EB" />
        </TouchableOpacity>

        <Text className="mx-2.5 font-bold text-blue-700 min-w-5 text-center text-sm">
          {qty}
        </Text>

        <TouchableOpacity
          onPress={handleIncrease}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="w-7 h-7 bg-blue-600 rounded-lg items-center justify-center shadow-xs"
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }

  if (compact) {
    return (
      <TouchableOpacity
        onPress={handleAdd}
        className="w-9 h-9 bg-blue-600 rounded-xl items-center justify-center active:bg-blue-700 shadow-sm"
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handleAdd}
      className="flex-row items-center justify-center bg-blue-600 active:bg-blue-700 px-4 py-2.5 rounded-xl shadow-sm"
    >
      <Ionicons name="cart-outline" size={18} color="#FFFFFF" className="mr-1.5" />
      <Text className="text-white font-semibold text-sm ml-1.5">Add to Cart</Text>
    </TouchableOpacity>
  );
};

