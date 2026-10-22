import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { fetchProductById, fetchProducts } from '@/api/products';
import { ReactionButtons } from '@/components/ReactionButtons';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ProductCard } from '@/components/ProductCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch product detail
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });

  // Fetch recommended products from the same category
  const { data: recommendedData } = useQuery({
    queryKey: ['recommended', product?.category, id],
    queryFn: () =>
      fetchProducts({
        category: product?.category,
        limit: 8,
      }),
    enabled: !!product?.category,
    select: (data) =>
      data.products.filter((p) => String(p.id) !== String(id)),
  });

  const recommendedProducts = recommendedData ?? [];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-sm font-semibold text-gray-400 mt-3">
          Loading product details...
        </Text>
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Ionicons name="alert-circle-outline" size={54} color="#EF4444" />
        <Text className="text-lg font-bold text-gray-900 mt-3">
          Product Not Found
        </Text>
        <Text className="text-sm text-gray-500 mt-1 text-center mb-6">
          We couldn't retrieve the details for this item.
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="bg-blue-600 px-6 py-3 rounded-xl shadow-xs"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail];

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Top Header Bar (Safe from Notch & Camera Hole) */}
      <View
        style={{
          paddingTop: Math.max(insets.top, 16) + 4,
          paddingBottom: 10,
          paddingHorizontal: 16,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
          zIndex: 30,
        }}
        className="flex-row items-center justify-between"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>

        <Text
          className="text-base font-bold text-gray-900 flex-1 mx-3 text-center"
          numberOfLines={1}
        >
          {product.title}
        </Text>

        <ReactionButtons product={product} size={20} />
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Carousel */}
        <View className="w-full h-80 bg-gray-50 items-center justify-center relative">
          <FlatList
            data={galleryImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(
                e.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setActiveImageIndex(newIndex);
            }}
            keyExtractor={(_, index) => String(index)}
            renderItem={({ item }) => (
              <View
                style={{ width: SCREEN_WIDTH, height: 320 }}
                className="items-center justify-center p-6"
              >
                <Image
                  source={{ uri: item }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                  transition={300}
                />
              </View>
            )}
          />

          {/* Dots Indicator */}
          {galleryImages.length > 1 && (
            <View className="flex-row items-center justify-center absolute bottom-3 left-0 right-0 gap-1.5">
              {galleryImages.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    activeImageIndex === index
                      ? 'w-6 bg-blue-600'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Details Section */}
        <View className="px-5 pt-5">
          {/* Brand & Category */}
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {product.brand || product.category}
            </Text>
            <View className="bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
              <Text className="text-[11px] font-semibold text-green-700">
                {product.availabilityStatus || 'In Stock'} ({product.stock})
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text className="text-2xl font-black text-gray-900 mb-2 leading-tight">
            {product.title}
          </Text>

          {/* Price & Rating */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-baseline gap-2">
              <Text className="text-3xl font-black text-gray-900">
                ${product.price.toFixed(2)}
              </Text>
              {product.discountPercentage ? (
                <View className="bg-red-500 rounded-md px-2 py-0.5">
                  <Text className="text-white text-xs font-bold">
                    -{Math.round(product.discountPercentage)}% OFF
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="flex-row items-center bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text className="text-sm font-bold text-amber-900 ml-1">
                {product.rating.toFixed(1)}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-sm font-bold text-gray-900 mb-1.5">Description</Text>
            <Text className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </Text>
          </View>

          {/* Product Specs Grid */}
          <View className="flex-row flex-wrap gap-2.5 mb-6">
            {product.warrantyInformation && (
              <View className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex-1 min-w-[45%]">
                <Ionicons name="shield-checkmark" size={18} color="#2563EB" />
                <Text className="text-xs text-gray-400 mt-1 font-medium">Warranty</Text>
                <Text className="text-xs font-semibold text-gray-800 mt-0.5">
                  {product.warrantyInformation}
                </Text>
              </View>
            )}

            {product.shippingInformation && (
              <View className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex-1 min-w-[45%]">
                <Ionicons name="airplane" size={18} color="#2563EB" />
                <Text className="text-xs text-gray-400 mt-1 font-medium">Shipping</Text>
                <Text className="text-xs font-semibold text-gray-800 mt-0.5">
                  {product.shippingInformation}
                </Text>
              </View>
            )}

            {product.returnPolicy && (
              <View className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex-1 min-w-[45%]">
                <Ionicons name="refresh" size={18} color="#2563EB" />
                <Text className="text-xs text-gray-400 mt-1 font-medium">Return Policy</Text>
                <Text className="text-xs font-semibold text-gray-800 mt-0.5">
                  {product.returnPolicy}
                </Text>
              </View>
            )}
          </View>

          {/* Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <View className="mb-6">
              <Text className="text-base font-bold text-gray-900 mb-3">
                Customer Reviews ({product.reviews.length})
              </Text>
              <View className="space-y-2.5">
                {product.reviews.map((rev, idx) => (
                  <View
                    key={idx}
                    className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 mb-2.5"
                  >
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-xs font-bold text-gray-800">
                        {rev.reviewerName}
                      </Text>
                      <View className="flex-row">
                        {[...Array(5)].map((_, i) => (
                          <Ionicons
                            key={i}
                            name={i < rev.rating ? 'star' : 'star-outline'}
                            size={12}
                            color="#F59E0B"
                          />
                        ))}
                      </View>
                    </View>
                    <Text className="text-xs text-gray-600 leading-snug">
                      "{rev.comment}"
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Recommended Products Section */}
          {recommendedProducts.length > 0 && (
            <View className="mt-2 mb-6">
              <Text className="text-base font-bold text-gray-900 mb-3">
                Recommended from this category
              </Text>
              <FlatList
                data={recommendedProducts}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <View style={{ width: 170 }}>
                    <ProductCard product={item} />
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Bar Directly Above the Bottom Navigation Tabs */}
      <View
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          paddingHorizontal: 16,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          zIndex: 40,
        }}
        className="flex-row items-center justify-between"
      >
        <View>
          <Text className="text-[11px] text-gray-400 font-medium">Price</Text>
          <Text className="text-xl font-black text-gray-900">
            ${product.price.toFixed(2)}
          </Text>
        </View>

        <View className="w-48">
          <AddToCartButton product={product} />
        </View>
      </View>
    </View>
  );
}
