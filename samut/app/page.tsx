"use client";

import HomePage from "./Home/page";
import { Outfit } from "next/font/google";
import { useAuth } from "@/app/context/AuthContext";
import Login from "@/app/auth/Login/page";


const OutfitFonts = Outfit({
  subsets : ["latin"],
  weight: "400",
  variable : "--font-outfit",
})



export default function Home() {
  const { user, logOut } = useAuth();
  
  return (
    <div className="flex min-h-screen flex-col item-center justify-between  dark:bg-black dark:text-white">
      {/* <button onClick={logOut}>Sign out</button> */}
      <HomePage />;

    </div>
  );
}
