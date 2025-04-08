// authContext.js
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { GoogleProvider } from '@/app/provider/GoogleProvider';
import { checkAlreadyHaveUserInDb, createUser, verifyUserToken } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    console.log('User:', user);
    return () => unsubscribe();
  }, []);

  const handleNewRegister = async (firebaseUser) => {
    if (firebaseUser) {
      try {
        let dbUser = await checkAlreadyHaveUserInDb(firebaseUser.uid);
        if (!dbUser) {
          const newUser = {
            user_id: firebaseUser.uid,
            firebase_uid: firebaseUser.uid,
            name: firebaseUser.displayName || "Anonymous",
            email: firebaseUser.email,
            profile_img: firebaseUser.photoURL || "",
            user_type : "user",
          };

          dbUser = await createUser(newUser);
        }

        setUser(dbUser);

        const isTokenValid = await verifyUserToken();
        console.log('isTokenValid:', isTokenValid);
        if (!isTokenValid) {
          await auth.signOut();
          console.log("Token expired or invalid, signing out...");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching or creating user:", error);
        await auth.signOut();
        setUser(null);
      }
    } else {
      await auth.signOut();
      setUser(null);
    }
  };

  const googleSignIn = async () => {
    setLoading(true);
    try {
      const result = await GoogleProvider();
      await handleNewRegister(result.user);
      console.log("User signed in:", result.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logOut = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}