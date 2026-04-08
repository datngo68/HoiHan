import { useCallback } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import {
  signInWithGoogle,
  signOut,
  subscribeToAuthState,
  createOrUpdateUser,
} from '../services/authService'

/** Call once at app root to initialize Firebase auth listener */
export function useAuthListener() {
  const setUser = useAuthStore((s) => s.setUser)
  return useCallback(() => {
    return subscribeToAuthState(async (user) => {
      if (user) {
        await createOrUpdateUser(user)
      }
      setUser(user)
    })
  }, [setUser])
}

/** Use auth state + actions in any component */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  return {
    user,
    loading,
    isLoggedIn: user !== null,
    signIn: signInWithGoogle,
    signOut,
  }
}
