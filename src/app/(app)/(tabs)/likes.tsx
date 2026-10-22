import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useReactions } from '@/store/reactions';
import { ProductCard } from '@/components/ProductCard';
import { Product, ReactionType } from '@/types';

export default function LikesScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ReactionType>('like');
  const reactionMap = useReactions((s) => s.map);

  const filteredProducts = useMemo(() => {
    return Object.values(reactionMap)
      .filter((item) => item.type === activeTab)
      .map((item) => item.product);
  }, [reactionMap, activeTab]);

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 pt-3 pb-3 bg-white border-b border-gray-100">
        <Text className="text-2xl font-extrabold text-gray-900 mb-3">
          Saved Reactions
        </Text>

        {/* Segmented Control */}
        <View className="flex-row bg-gray-100 p-1 rounded-xl">
          <TouchableOpacity
            onPress={() => setActiveTab('like')}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg ${
              activeTab === 'like' ? 'bg-white shadow-xs' : ''
            }`}
          >
            <Ionicons
              name={activeTab === 'like' ? 'heart' : 'heart-outline'}
              size={18}
              color={activeTab === 'like' ? '#EF4444' : '#6B7280'}
            />
            <Text
              className={`ml-2 text-sm font-semibold ${
                activeTab === 'like' ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              Liked Items
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('dislike')}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg ${
              activeTab === 'dislike' ? 'bg-white shadow-xs' : ''
            }`}
          >
            <Ionicons
              name={activeTab === 'dislike' ? 'thumbs-down' : 'thumbs-down-outline'}
              size={18}
              color={activeTab === 'dislike' ? '#374151' : '#6B7280'}
            />
            <Text
              className={`ml-2 text-sm font-semibold ${
                activeTab === 'dislike' ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              Disliked
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlashList<Product>
        data={filteredProducts}
        numColumns={2}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 8 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-28 px-6">
            <View
              className={`w-16 h-16 rounded-full items-center justify-center mb-3 ${
                activeTab === 'like' ? 'bg-red-50' : 'bg-gray-100'
              }`}
            >
              <Ionicons
                name={activeTab === 'like' ? 'heart-dislike-outline' : 'thumbs-down-outline'}
                size={32}
                color={activeTab === 'like' ? '#EF4444' : '#6B7280'}
              />
            </View>
            <Text className="text-base font-bold text-gray-800">
              {activeTab === 'like' ? 'No Liked Products Yet' : 'No Disliked Products'}
            </Text>
            <Text className="text-xs text-gray-400 mt-1 text-center max-w-xs">
              {activeTab === 'like'
                ? 'Tap the heart icon on any product in the shop to save it to your favorites list.'
                : 'Products marked with thumbs down will appear here.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

