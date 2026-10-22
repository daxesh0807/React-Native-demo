import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/store/auth';
import { useCartCount } from '@/store/cart';
import { useReactions } from '@/store/reactions';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const cartCount = useCartCount();
  const reactionsMap = useReactions((s) => s.map);
  const likesCount = Object.values(reactionsMap).filter((r) => r.type === 'like').length;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 24,
      }}
    >
      {/* Profile Header Card */}
      <View className="mx-4 bg-white rounded-3xl p-5 border border-gray-100 shadow-xs items-center mb-5">
        <View className="w-24 h-24 rounded-full bg-blue-100 p-1 mb-3">
          <Image
            source={{
              uri:
                user?.image ||
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
            }}
            style={{ width: '100%', height: '100%', borderRadius: 999 }}
            contentFit="cover"
          />
        </View>

        <Text className="text-xl font-bold text-gray-900">
          {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
        </Text>
        <Text className="text-xs text-gray-400 mt-0.5">@{user?.username || 'user'}</Text>
        <Text className="text-xs text-blue-600 mt-1">{user?.email || 'user@example.com'}</Text>

        {/* Stats Row */}
        <View className="flex-row items-center justify-around w-full mt-5 pt-4 border-t border-gray-100">
          <View className="items-center">
            <Text className="text-lg font-black text-gray-900">{cartCount}</Text>
            <Text className="text-xs text-gray-400 mt-0.5">In Cart</Text>
          </View>
          <View className="h-8 w-px bg-gray-100" />
          <View className="items-center">
            <Text className="text-lg font-black text-red-500">{likesCount}</Text>
            <Text className="text-xs text-gray-400 mt-0.5">Favorites</Text>
          </View>
        </View>
      </View>

      {/* Settings / Menu Options */}
      <View className="mx-4 bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden mb-5 divide-y divide-gray-50">
        <View className="flex-row items-center px-5 py-4">
          <View className="w-9 h-9 rounded-xl bg-blue-50 items-center justify-center mr-3.5">
            <Ionicons name="notifications-outline" size={20} color="#2563EB" />
          </View>
          <Text className="text-sm font-semibold text-gray-800 flex-1">
            Notifications
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </View>

        <View className="flex-row items-center px-5 py-4">
          <View className="w-9 h-9 rounded-xl bg-green-50 items-center justify-center mr-3.5">
            <Ionicons name="shield-checkmark-outline" size={20} color="#16A34A" />
          </View>
          <Text className="text-sm font-semibold text-gray-800 flex-1">
            Security & Privacy
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </View>

        <View className="flex-row items-center px-5 py-4">
          <View className="w-9 h-9 rounded-xl bg-purple-50 items-center justify-center mr-3.5">
            <Ionicons name="help-buoy-outline" size={20} color="#9333EA" />
          </View>
          <Text className="text-sm font-semibold text-gray-800 flex-1">
            Help & Customer Support
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </View>
      </View>

      {/* Logout Action */}
      <View className="mx-4">
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center bg-red-50 border border-red-200 py-4 rounded-2xl active:bg-red-100"
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text className="text-red-600 font-bold text-base ml-2">Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

