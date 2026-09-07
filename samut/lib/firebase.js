import { initializeApp } from 'firebase/app';
import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';
import { getDemoSession } from '@/mocks/authMock';

// Demo mode (see lib/demoMode.ts) has no real Firebase project configured.
// Skip talking to the real Firebase SDK entirely in that case so the app
// never needs a NEXT_PUBLIC_FIREBASE_API_KEY to boot.
const hasFirebaseConfig = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

const checkIfAccountExists = async (email) => {
  if (!hasFirebaseConfig) return false;
  const auth = getAuth();
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    if (signInMethods.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking if account exists:', error);
    throw error;
  }
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// A stub that satisfies the handful of properties this codebase reads
// directly off `auth` (auth.currentUser, auth.signOut(), auth.onAuthStateChanged)
// without ever touching the real Firebase SDK.
const authStub = {
  currentUser: null,
  signOut: async () => {},
  onAuthStateChanged: (callback) => {
    const session = getDemoSession();
    callback(session ? { uid: session.user_id } : null);
    return () => {};
  },
};

// Typed as `any`: in demo mode this is the plain stub above, not a real
// firebase/auth `Auth` instance, so it can't carry that type.
/** @type {any} */
const auth = hasFirebaseConfig ? getAuth(initializeApp(firebaseConfig)) : authStub;

export { auth, checkIfAccountExists };
