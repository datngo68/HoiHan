import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

const googleProvider = new GoogleAuthProvider()

/** Sign in with Google popup. Falls back to redirect on mobile. */
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    await createOrUpdateUser(result.user)
    return result.user
  } catch (err: unknown) {
    // Popup blocked on mobile — fallback to redirect
    const code = (err as { code?: string }).code
    if (code === 'auth/popup-blocked' || code === 'auth/popup-closed-by-user') {
      await signInWithRedirect(auth, googleProvider)
    }
    throw err
  }
}

/** Sign out current user */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

/** Upsert user document in Firestore */
export async function createOrUpdateUser(user: User): Promise<void> {
  const ref = doc(db, 'users', user.uid)
  await setDoc(
    ref,
    {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      updatedAt: serverTimestamp(),
    },
    { merge: true }, // Don't overwrite linkCount
  )
}

/** Subscribe to auth state changes */
export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}
