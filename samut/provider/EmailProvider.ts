/**
 * @file EmailProvider.ts
 * @description This file provides the EmailProvider for the application. It handles the email sign-in process.
 * @author Awirut Phuseansaart <awirut2629@gmail.com>
 * @date 2024-06-29
 * @version 1.0
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
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

const RegisterWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
    // const user = result.user;
    // return user;
  } catch (error: any) {
    // const errorMessage = getErrorMessage(error.code);
    // Toast.error(errorMessage);
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
