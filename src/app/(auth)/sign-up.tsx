import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@/utils/resolver';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signUpSchema, SignUpFormValues } from '@/utils/schemas';
import { registerUser } from '@/api/auth';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      await registerUser(data);
      Alert.alert(
        'Account Created',
        'Your registration was successful! Please sign in with your credentials.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/sign-in'),
          },
        ]
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-4"
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>

        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Create Account
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Join now and start discovering curated products
          </Text>
        </View>

        {/* Error Banner */}
        {errorMessage ? (
          <View className="flex-row items-center bg-red-50 border border-red-200 rounded-xl p-3.5 mb-5">
            <Ionicons name="alert-circle" size={20} color="#DC2626" />
            <Text className="text-xs text-red-700 font-medium ml-2 flex-1">
              {errorMessage}
            </Text>
          </View>
        ) : null}

        {/* Form Fields */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Username"
              placeholder="e.g. johndoe"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.username?.message}
              autoCorrect={false}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email Address"
              placeholder="e.g. john@example.com"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.email?.message}
              autoCorrect={false}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="At least 6 characters"
              isPassword
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              isPassword
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.confirmPassword?.message}
            />
          )}
        />

        <Button
          title="Sign Up"
          loading={loading}
          className="mt-2"
          onPress={() => handleSubmit(onSubmit)()}
        />

        {/* Switch to Sign In */}
        <View className="flex-row items-center justify-center mt-6">
          <Text className="text-sm text-gray-500">Already have an account? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity>
              <Text className="text-sm font-bold text-blue-600">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
