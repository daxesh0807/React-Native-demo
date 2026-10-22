import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { fetchCategories, fetchProducts } from '@/api/products';
import { useDebounce } from '@/hooks/useDebounce';
import { ProductCard } from '@/components/ProductCard';
import { ProductSkeleton } from '@/components/ProductSkeleton';
import { FilterBar } from '@/components/FilterBar';
import { SortModal, SORT_OPTIONS, SortOption } from '@/components/SortModal';
import { Product } from '@/types';

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>(SORT_OPTIONS[0]);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Infinite query for products
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: [
      'products',
      {
        q: debouncedSearch,
        category: selectedCategory,
        sortBy: selectedSort.sortBy,
        order: selectedSort.order,
      },
    ],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({
        skip: pageParam,
        limit: 20,
        q: debouncedSearch,
        category: selectedCategory,
        sortBy: selectedSort.sortBy,
        order: selectedSort.order,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
  });

  const products = useMemo(() => {
    return data?.pages.flatMap((page) => page.products) ?? [];
  }, [data]);

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Search Header */}
      <View className="px-4 pt-2 pb-2 bg-white border-b border-gray-100">
        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2 text-sm text-gray-900"
              placeholder="Search products, brands..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setIsSortOpen(true)}
            className={`p-2.5 rounded-xl border ${
              selectedSort.id !== 'default'
                ? 'bg-blue-50 border-blue-400'
                : 'bg-white border-gray-200'
            }`}
          >
            <Ionicons
              name="funnel-outline"
              size={18}
              color={selectedSort.id !== 'default' ? '#2563EB' : '#4B5563'}
            />
          </TouchableOpacity>
        </View>

        {/* Categories Bar */}
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      </View>

      {/* Main Content */}
      {isLoading ? (
        <View className="flex-1 p-2">
          <View className="flex-row">
            <ProductSkeleton />
            <ProductSkeleton />
          </View>
          <View className="flex-row">
            <ProductSkeleton />
            <ProductSkeleton />
          </View>
          <View className="flex-row">
            <ProductSkeleton />
            <ProductSkeleton />
          </View>
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="alert-circle-outline" size={56} color="#EF4444" />
          <Text className="text-lg font-bold text-gray-900 mt-3 text-center">
            Failed to Load Products
          </Text>
          <Text className="text-sm text-gray-500 mt-1 text-center mb-6">
            Something went wrong while contacting the store server.
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-blue-600 px-6 py-3 rounded-xl shadow-xs"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlashList<Product>
          data={products}
          numColumns={2}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 8 }}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <View className="items-center justify-center py-20 px-6">
              <Ionicons name="search-outline" size={52} color="#9CA3AF" />
              <Text className="text-base font-bold text-gray-800 mt-3">
                No Products Found
              </Text>
              <Text className="text-xs text-gray-400 mt-1 text-center">
                Try searching for something else or clear the selected filters.
              </Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-6 items-center">
                <ActivityIndicator size="small" color="#2563EB" />
              </View>
            ) : (
              <View className="h-6" />
            )
          }
        />
      )}

      {/* Sort Selection Bottom Sheet / Modal */}
      <SortModal
        visible={isSortOpen}
        selectedSortId={selectedSort.id}
        onSelect={(option) => setSelectedSort(option)}
        onClose={() => setIsSortOpen(false)}
      />
    </View>
  );
}

