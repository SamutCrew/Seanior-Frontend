"use client";
import React from 'react'
import { useAuth } from '@/app/context/AuthContext';

export default function login() {
  const { user, logOut, googleSignIn } = useAuth();
  if (user) {
    return (
      <div className="">
        <h1>Welcome, {user.email}</h1>
        <button onClick={logOut}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Login</h1>
      <button onClick={googleSignIn}>google Sign in</button>
    </div>
  );
}