import { AuthResponse } from '@/types';
import { SignInFormValues, SignUpFormValues } from '@/utils/schemas';

const BASE_URL = 'https://dummyjson.com';

export async function loginUser(credentials: SignInFormValues): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: credentials.username.trim(),
      password: credentials.password,
      expiresInMins: 60 * 24 * 7, // 7 days
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Invalid username or password');
  }

  return data as AuthResponse;
}

export async function registerUser(formData: SignUpFormValues): Promise<{ id: number; username: string; email: string }> {
  const response = await fetch(`${BASE_URL}/users/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
}

