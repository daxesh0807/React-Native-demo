import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword = false,
  style,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="w-full mb-4">
      {label ? (
        <Text className="text-sm font-semibold text-gray-700 mb-1.5">{label}</Text>
      ) : null}
      <View
        className={`flex-row items-center bg-gray-50 border rounded-xl px-3.5 py-3 ${
          error ? 'border-red-500 bg-red-50/20' : 'border-gray-200 focus:border-blue-500'
        }`}
      >
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="p-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text className="text-xs text-red-600 mt-1.5 font-medium">{error}</Text> : null}
    </View>
  );
};

