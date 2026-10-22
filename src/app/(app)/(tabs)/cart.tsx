import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart, useCartCount, useCartTotal } from '@/store/cart';
import { CartItem } from '@/types';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const items = useCart((s) => s.items);
  const increase = useCart((s) => s.increase);
  const decrease = useCart((s) => s.decrease);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  const cartCount = useCartCount();
  const cartTotal = useCartTotal();

  const handleCheckout = () => {
    Alert.alert(
      'Order Placed!',
      `Thank you for your purchase of ${cartCount} items totaling $${cartTotal.toFixed(2)}.`,
      [
        {
          text: 'Great!',
          onPress: () => {
            clear();
            router.replace('/(app)/(tabs)');
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clear },
    ]);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const itemTotal = item.product.price * item.qty;

    return (
      <View className="flex-row items-center bg-white p-3.5 mb-3 rounded-2xl border border-gray-100 shadow-xs">
        {/* Product Image */}
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/product/[id]',
              params: { id: String(item.product.id) },
            })
          }
          className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden p-1.5 items-center justify-center mr-3"
        >
          <Image
            source={{ uri: item.product.thumbnail }}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
          />
        </TouchableOpacity>

        {/* Details & Controls */}
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <Text
              className="text-sm font-semibold text-gray-900 flex-1 mr-2"
              numberOfLines={2}
            >
              {item.product.title}
            </Text>
            <TouchableOpacity
              onPress={() => remove(item.product.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="p-1"
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <Text className="text-xs text-gray-400 mt-0.5">
            ${item.product.price.toFixed(2)} each
          </Text>

          <View className="flex-row items-center justify-between mt-3">
            <Text className="text-base font-bold text-gray-900">
              ${itemTotal.toFixed(2)}
            </Text>

            {/* Stepper */}
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-2 py-1">
              <TouchableOpacity
                onPress={() => decrease(item.product.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                className="w-6 h-6 bg-white rounded items-center justify-center shadow-xs"
              >
                <Ionicons name="remove" size={14} color="#374151" />
              </TouchableOpacity>

              <Text className="mx-3 font-bold text-gray-800 text-sm min-w-4 text-center">
                {item.qty}
              </Text>

              <TouchableOpacity
                onPress={() => increase(item.product.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                className="w-6 h-6 bg-blue-600 rounded items-center justify-center shadow-xs"
              >
                <Ionicons name="add" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 pt-3 pb-3 bg-white border-b border-gray-100 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-extrabold text-gray-900">My Cart</Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your bag
          </Text>
        </View>

        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text className="text-xs font-semibold text-red-600">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cart Items List */}
      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 rounded-full bg-blue-50 items-center justify-center mb-4">
            <Ionicons name="cart-outline" size={44} color="#2563EB" />
          </View>
          <Text className="text-xl font-bold text-gray-900">Your Cart is Empty</Text>
          <Text className="text-sm text-gray-400 text-center mt-1.5 max-w-xs mb-6">
            Looks like you haven't added any products to your cart yet.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/(app)/(tabs)')}
            className="bg-blue-600 px-6 py-3.5 rounded-xl shadow-xs"
          >
            <Text className="text-white font-semibold text-sm">Explore Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1">
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => String(item.product.id)}
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          />

          {/* Bottom Checkout Card */}
          <View
            className="bg-white border-t border-gray-200 px-5 pt-4"
            style={{ paddingBottom: insets.bottom + 12 }}
          >
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-500">Subtotal ({cartCount} items)</Text>
              <Text className="text-sm font-semibold text-gray-800">
                ${cartTotal.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between mb-3">
              <Text className="text-sm text-gray-500">Shipping</Text>
              <Text className="text-sm font-semibold text-green-600">FREE</Text>
            </View>

            <View className="h-px bg-gray-100 mb-3" />

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-bold text-gray-900">Total</Text>
              <Text className="text-2xl font-black text-gray-900">
                ${cartTotal.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleCheckout}
              className="bg-blue-600 active:bg-blue-700 py-4 rounded-2xl items-center justify-center shadow-md shadow-blue-500/20"
            >
              <Text className="text-white font-bold text-base">Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

