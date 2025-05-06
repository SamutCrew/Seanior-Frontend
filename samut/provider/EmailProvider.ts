// EmailProvider.tsx

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  confirmPasswordReset,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Toast } from "@/components/Responseback/Toast";

// import { getErrorMessage } from "@/app/context/firebaseErrorMessages";

const EmailProvider = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
    // const id_token = await userCredential.user.getIdToken();
    // return id_token;
  } catch (error) {
    throw error;
  }
};


const RegisterWithEmail = async (email: string, password: string, name?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update the user's displayName immediately
    await updateProfile(userCredential.user, { displayName: name || 'Anonymous' });
    console.log('Updated Firebase user profile with displayName:', name);
    return userCredential;
  } catch (error) {
    console.error('Error in RegisterWithEmail:', error);
    throw error;
  }
};

const SendForgotPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    throw error;
  }
};

export { EmailProvider, RegisterWithEmail, SendForgotPassword };
