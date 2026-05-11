import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: { id: 'mock-user', email: 'alex.s@btech.edu' } as User,
  loading: false,
  setUser: (user) => set({ user, loading: false }),
  signOut: async () => {
    set({ user: null });
  },
  initialize: async () => {
    set({ user: { id: 'mock-user', email: 'alex.s@btech.edu' } as User, loading: false });
  },
}));

