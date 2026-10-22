import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export const ProductSkeleton: React.FC = () => {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.85, { duration: 750 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="flex-1 m-1.5 bg-white rounded-2xl border border-gray-100 p-3 shadow-xs">
      <Animated.View style={animatedStyle}>
        <View className="w-full h-36 bg-gray-200 rounded-xl mb-3" />
        <View className="w-16 h-3 bg-gray-200 rounded mb-2" />
        <View className="w-full h-4 bg-gray-200 rounded mb-1.5" />
        <View className="w-3/4 h-4 bg-gray-200 rounded mb-3" />
        <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <View className="w-16 h-5 bg-gray-200 rounded" />
          <View className="w-9 h-9 bg-gray-200 rounded-xl" />
        </View>
      </Animated.View>
    </View>
  );
};

