
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  EmailProvider,
  RegisterWithEmail,
  SendForgotPassword,
} from "@/provider/EmailProvider";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { GoogleProvider } from '@/provider/GoogleProvider';

import { checkAlreadyHaveUserInDb, createUser, verifyUserToken } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const handleNewRegister = async (firebaseUser, name) => {
    if (firebaseUser) {
      try {
        let dbUser = await checkAlreadyHaveUserInDb(firebaseUser.uid);
        if (dbUser === null) {
          const newUser = {
            user_id: firebaseUser.uid,
            firebase_uid: firebaseUser.uid,
            name: name || firebaseUser.displayName || "Anonymous",

            email: firebaseUser.email,
            profile_img: firebaseUser.photoURL || "",
            user_type: "user",
          };

          dbUser = await createUser(newUser);
        }


        setUser(dbUser); // Set the user state with the database user


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


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      console.log('onAuthStateChanged: loading = true');
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Auth timeout")), 10000) // 10s timeout
        );
        if (firebaseUser) {
          await Promise.race([handleNewRegister(firebaseUser), timeoutPromise]);
        } else {
          setUser(null); // Clear user if no Firebase user
        }
      } catch (error) {
        console.error("Error in onAuthStateChanged:", error);
        setUser(null);
      } finally {
        setLoading(false);
        console.log('onAuthStateChanged: loading = false');
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await EmailProvider(email, password);
      await handleNewRegister(userCredential.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email, password, name) => {
    setLoading(true);
    try {
      const result = await RegisterWithEmail(email, password, name);
      await handleNewRegister(result.user, name);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
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


  const logOut = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendForgotPassword = async (email) => {
    setLoading(true);
    try {
      await SendForgotPassword(email);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (oobCode, newPassword) => {
    setLoading(true);
    try {
      await ResetPassword(oobCode, newPassword);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        logOut,
        registerWithEmail,
        sendForgotPassword,
        googleSignIn,
        loading,
        resetPassword,
      }}
    >

      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}