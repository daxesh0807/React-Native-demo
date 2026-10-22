import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { Product } from '@/types';
import { useReactions } from '@/store/reactions';

interface ReactionButtonsProps {
  product: Product;
  size?: number;
}

export const ReactionButtons: React.FC<ReactionButtonsProps> = ({ product, size = 20 }) => {
  const reaction = useReactions((s) => s.map[product.id]?.type);
  const toggle = useReactions((s) => s.toggle);

  const likeScale = useSharedValue(1);
  const dislikeScale = useSharedValue(1);

  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const dislikeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dislikeScale.value }],
  }));

  const handleLike = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    likeScale.value = withSequence(withSpring(1.35), withSpring(1));
    toggle(product, 'like');
  };

  const handleDislike = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    dislikeScale.value = withSequence(withSpring(1.35), withSpring(1));
    toggle(product, 'dislike');
  };

  return (
    <View className="flex-row items-center gap-1.5 bg-gray-50/90 rounded-full px-2 py-1">
      <TouchableOpacity
        onPress={handleLike}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        className="p-1"
      >
        <Animated.View style={likeAnimatedStyle}>
          <Ionicons
            name={reaction === 'like' ? 'heart' : 'heart-outline'}
            size={size}
            color={reaction === 'like' ? '#EF4444' : '#6B7280'}
          />
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleDislike}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        className="p-1"
      >
        <Animated.View style={dislikeAnimatedStyle}>
          <Ionicons
            name={reaction === 'dislike' ? 'thumbs-down' : 'thumbs-down-outline'}
            size={size}
            color={reaction === 'dislike' ? '#4B5563' : '#9CA3AF'}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

