// authContext.js
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
  const [isRegistering, setIsRegistering] = useState(false);
  const [pendingName, setPendingName] = useState(null);

  const handleNewRegister = async (firebaseUser, name) => {
    console.log('handleNewRegister called with firebase_uid:', firebaseUser?.uid, 'name:', name);
    if (firebaseUser) {
      try {
        let dbUser = await checkAlreadyHaveUserInDb(firebaseUser.uid);
        console.log('dbUser after check:', dbUser);

        if (dbUser === null) {
          console.log('Creating new user in DB');
          console.log('name:', name);
          console.log('firebaseUser.displayName:', firebaseUser.displayName);
          const newUser = {
            firebase_uid: firebaseUser.uid,
            name: name || firebaseUser.displayName || 'Anonymous',
            email: firebaseUser.email,
            profile_img: firebaseUser.photoURL || '',
            user_type: 'user',
          };

          dbUser = await createUser(newUser);
          console.log('New user created:', dbUser);
        } else {
          console.log('User already exists in DB:', dbUser);
        }

        setUser(dbUser);

        const isTokenValid = await verifyUserToken();
        console.log('isTokenValid:', isTokenValid);
        if (!isTokenValid) {
          console.log('Token invalid, signing out');
          await auth.signOut();
          setUser(null);
        }
      } catch (error) {
        console.error('Error in handleNewRegister:', {
          message: error.message,
          response: error.response
            ? {
                status: error.response.status,
                data: error.response.data,
              }
            : null,
          stack: error.stack,
        });
        await auth.signOut();
        setUser(null);
        throw error;
      }
    } else {
      console.log('No Firebase user, signing out');
      await auth.signOut();
      setUser(null);
    }
  };

  const refreshUser = async () => {
    if (!user || !user.firebase_uid) {
      console.log('No user or firebase_uid available to refresh');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await checkAlreadyHaveUserInDb(user.firebase_uid);
      if (updatedUser) {
        console.log('Refreshed user data:', updatedUser);
        setUser(updatedUser);
      } else {
        console.error('User not found during refresh, signing out');
        await auth.signOut();
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user data:', {
        message: error.message,
        stack: error.stack,
      });
      await auth.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isProcessing = false;
    let timeoutId = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (isProcessing || isRegistering) {
        console.log('Skipping onAuthStateChanged: isProcessing=', isProcessing, 'isRegistering=', isRegistering);
        return;
      }
      isProcessing = true;
      setLoading(true);
      console.log('onAuthStateChanged triggered for firebase_uid:', firebaseUser?.uid);

      try {
        if (firebaseUser) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(async () => {
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Auth timeout")), 10000)
            );
            // Use pendingName if available, otherwise fallback to firebaseUser.displayName
            await Promise.race([handleNewRegister(firebaseUser, pendingName), timeoutPromise]);
            setPendingName(null); // Clear pendingName after use
          }, 200); // Increased debounce to 200ms
        } else {
          console.log('No authenticated user, setting user to null');
          setUser(null);
        }
      } catch (error) {
        console.error('Error in onAuthStateChanged:', {
          message: error.message,
          stack: error.stack,
        });
        setUser(null);
      } finally {
        setLoading(false);
        isProcessing = false;
      }
    });

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      unsubscribe();
    };
  }, [isRegistering, pendingName]);

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
    setIsRegistering(true);
    try {
      const result = await RegisterWithEmail(email, password, name);
      console.log('RegisterWithEmail result:', result.user, 'name:', name);
      setPendingName(name); // Store name for onAuthStateChanged
      await handleNewRegister(result.user, name);
    } catch (error) {
      console.error('Error in registerWithEmail:', error);
      throw error;
    } finally {
      setLoading(false);
      setIsRegistering(false);
      setPendingName(null);
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
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}