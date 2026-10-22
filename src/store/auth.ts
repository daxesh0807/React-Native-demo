import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User } from '@/types';

const TOKEN_KEY = 'user_access_token';
const USER_KEY = 'user_data';

type AuthState = {
  token: string | null;
  user: User | null;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  signIn: (token: string, user?: User | null) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  token: null,
  user: null,
  isHydrated: false,
  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(USER_KEY);
      const user = userJson ? (JSON.parse(userJson) as User) : null;
      set({ token, user, isHydrated: true });
    } catch {
      set({ token: null, user: null, isHydrated: true });
    }
  },
  signIn: async (token: string, user: User | null = null) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      if (user) {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      }
    } catch (e) {
      console.warn('Failed to persist auth token', e);
    }
    set({ token, user });
  },
  signOut: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (e) {
      console.warn('Failed to remove auth token', e);
    }
    set({ token: null, user: null });
  },
}));

