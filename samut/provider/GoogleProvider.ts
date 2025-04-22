/**
 * @file GoogleProvider.ts
 * @description This file provides the GoogleProvider for the application. It handles the Google sign-in process.
 * @author Awirut Phuseansaart <awirut2629@gmail.com>
 * @date 2024-06-29
 * @version 1.0
 */

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

const googleProvider = new GoogleAuthProvider();

const GoogleProvider = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.log(error);
  }
};


export { GoogleProvider };
