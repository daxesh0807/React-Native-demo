import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Category } from '@/types';

interface FilterBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View className="py-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        <TouchableOpacity
          onPress={() => onSelectCategory('all')}
          className={`px-4 py-2 rounded-full border ${
            selectedCategory === 'all'
              ? 'bg-blue-600 border-blue-600'
              : 'bg-white border-gray-200'
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              selectedCategory === 'all' ? 'text-white' : 'text-gray-700'
            }`}
          >
            All Products
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <TouchableOpacity
              key={cat.slug}
              onPress={() => onSelectCategory(cat.slug)}
              className={`px-4 py-2 rounded-full border ${
                isSelected
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text
                className={`text-xs font-semibold capitalize ${
                  isSelected ? 'text-white' : 'text-gray-700'
                }`}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

