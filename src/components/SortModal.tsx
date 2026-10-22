import React from 'react';
import { Modal, Text, TouchableOpacity, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type SortOption = {
  id: string;
  label: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
};

export const SORT_OPTIONS: SortOption[] = [
  { id: 'default', label: 'Featured / Default' },
  { id: 'price-asc', label: 'Price: Low to High', sortBy: 'price', order: 'asc' },
  { id: 'price-desc', label: 'Price: High to Low', sortBy: 'price', order: 'desc' },
  { id: 'rating-desc', label: 'Highest Rated', sortBy: 'rating', order: 'desc' },
  { id: 'title-asc', label: 'Alphabetical: A-Z', sortBy: 'title', order: 'asc' },
];

interface SortModalProps {
  visible: boolean;
  selectedSortId: string;
  onSelect: (option: SortOption) => void;
  onClose: () => void;
}

export const SortModal: React.FC<SortModalProps> = ({
  visible,
  selectedSortId,
  onSelect,
  onClose,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/40 justify-end"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-white rounded-t-3xl p-6 pb-8"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-900">Sort Products</Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-1 rounded-full bg-gray-100"
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View className="divide-y divide-gray-100">
            {SORT_OPTIONS.map((option) => {
              const isSelected = selectedSortId === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                  className="flex-row items-center justify-between py-3.5"
                >
                  <Text
                    className={`text-base ${
                      isSelected ? 'font-bold text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={22} color="#2563EB" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

