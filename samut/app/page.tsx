"use client";

import HomePage from "./Home/page";
import { useAuth } from "@/app/context/AuthContext";
import Login from "@/app/auth/Login/page";

export default function Home() {
  const { user, logOut } = useAuth();
  
  return (
    <div className="flex min-h-screen flex-col item-center justify-between p-24 dark:bg-black dark:text-white">
      <button onClick={logOut}>Sign out</button>
      <HomePage />;
    </div>
  );
}
