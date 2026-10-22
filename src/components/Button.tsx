import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  size = 'md',
  disabled,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-100 active:bg-gray-200';
      case 'outline':
        return 'bg-transparent border border-blue-600 active:bg-blue-50';
      case 'danger':
        return 'bg-red-600 active:bg-red-700';
      case 'primary':
      default:
        return 'bg-blue-600 active:bg-blue-700';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'text-gray-800';
      case 'outline':
        return 'text-blue-600';
      case 'danger':
      case 'primary':
      default:
        return 'text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-3 rounded-lg';
      case 'lg':
        return 'py-4 px-6 rounded-2xl';
      case 'md':
      default:
        return 'py-3.5 px-5 rounded-xl';
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      className={`flex-row items-center justify-center ${getVariantStyles()} ${getSizeStyles()} ${
        disabled || loading ? 'opacity-50' : ''
      } ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? '#2563EB' : variant === 'secondary' ? '#1F2937' : '#FFFFFF'}
          className="mr-2"
        />
      ) : null}
      <Text className={`font-semibold text-center text-base ${getTextStyles()}`}>{title}</Text>
    </TouchableOpacity>
  );
};

