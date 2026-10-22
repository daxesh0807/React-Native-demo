import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@/utils/resolver';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signInSchema, SignInFormValues } from '@/utils/schemas';
import { loginUser } from '@/api/auth';
import { useAuth } from '@/store/auth';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const signIn = useAuth((s) => s.signIn);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onTouched',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await loginUser(data);
      await signIn(res.accessToken, {
        id: res.id,
        username: res.username,
        email: res.email,
        firstName: res.firstName,
        lastName: res.lastName,
        gender: res.gender,
        image: res.image,
      });
      // Auth guard in _layout automatically redirects to (app)/(tabs)
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setValue('username', 'emilys');
    setValue('password', 'emilyspass');
    setErrorMessage(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Icon */}
        <View className="items-center mt-6 mb-8">
          <View className="w-20 h-20 rounded-3xl bg-blue-600 items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
            <Ionicons name="bag-handle" size={40} color="#FFFFFF" />
          </View>
          <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Sign in to explore amazing products
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
        <View className="space-y-1">
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Username"
                placeholder="e.g. emilys"
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
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Enter password"
                isPassword
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
              />
            )}
          />
        </View>

        {/* Demo Credentials Helper */}
        <TouchableOpacity
          onPress={fillDemoCredentials}
          className="self-end mb-6"
        >
          <Text className="text-xs font-semibold text-blue-600">
            Use Demo Login (emilys / emilyspass)
          </Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <Button
          title="Sign In"
          loading={loading}
          onPress={() => handleSubmit(onSubmit)()}
        />

        {/* Switch to Sign Up */}
        <View className="flex-row items-center justify-center mt-8">
          <Text className="text-sm text-gray-500">Don't have an account? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity>
              <Text className="text-sm font-bold text-blue-600">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
