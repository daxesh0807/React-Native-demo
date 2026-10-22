import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Product } from '@/types';
import { ReactionButtons } from './ReactionButtons';
import { AddToCartButton } from './AddToCartButton';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handlePress = () => {
    router.push({
      pathname: '/product/[id]',
      params: { id: String(product.id) },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      className="flex-1 m-1.5 bg-white rounded-2xl border border-gray-100 p-3 shadow-xs overflow-hidden"
    >
      {/* Top Bar: Discount Badge & Reactions */}
      <View className="flex-row justify-between items-start z-10 mb-1">
        {product.discountPercentage ? (
          <View className="bg-red-500 rounded-full px-2 py-0.5">
            <Text className="text-white text-[10px] font-bold">
              -{Math.round(product.discountPercentage)}%
            </Text>
          </View>
        ) : (
          <View />
        )}
        <ReactionButtons product={product} size={18} />
      </View>

      {/* Product Image */}
      <View className="w-full h-36 items-center justify-center mb-2">
        <Image
          source={{ uri: product.thumbnail }}
          style={{ width: '100%', height: '100%' }}
          contentFit="contain"
          transition={300}
        />
      </View>

      {/* Brand & Category */}
      <Text className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5" numberOfLines={1}>
        {product.brand || product.category}
      </Text>

      {/* Product Title */}
      <Text className="text-sm font-semibold text-gray-900 mb-1 leading-snug h-9" numberOfLines={2}>
        {product.title}
      </Text>

      {/* Rating */}
      <View className="flex-row items-center mb-2">
        <Ionicons name="star" size={13} color="#FBBF24" />
        <Text className="text-xs font-semibold text-gray-700 ml-1">
          {product.rating.toFixed(1)}
        </Text>
        <Text className="text-[11px] text-gray-400 ml-1">
          ({product.stock} in stock)
        </Text>
      </View>

      {/* Price & Action */}
      <View className="flex-row items-center justify-between mt-auto pt-1 border-t border-gray-50">
        <View>
          <Text className="text-base font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </Text>
        </View>

        <AddToCartButton product={product} compact={true} />
      </View>
    </TouchableOpacity>
  );
};

