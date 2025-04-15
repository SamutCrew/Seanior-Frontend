"use client";

import HomePage from "./Home/page";
import { Outfit } from "next/font/google";

const OutfitFonts = Outfit({
  subsets : ["latin"],
  weight: "400",
  variable : "--font-outfit",
})

export default function Home() {
  return (
    <div className={`${OutfitFonts.variable}`}>
      <div className="flex min-h-screen flex-col item-center justify-between  dark:bg-black dark:text-white">
      <HomePage />
      ;
      </div>
    </div>
  );
}
