import { create } from 'zustand'
import type { User } from 'firebase/auth'

interface AuthStore {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true, // true until Firebase resolves initial state
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
}))
