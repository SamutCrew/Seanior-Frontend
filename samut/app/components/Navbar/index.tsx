"use client";
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkmode, setIsSidebarCollapsed } from '@/state';
import Image from "next/image";
import { Link, LucideIcon, Menu, Moon, Search, Sun, BookOpen, GraduationCap, Info, LifeBuoy } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from "react";
import { getAuthUser } from '@/app/context/authToken';

interface User {
  email: string;
}


const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getAuthUser();
      setUser(user as User);
    };
    fetchUser();
  }, []);
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      setIsScrolled(scrolled);

      if (!scrolled) {
        dispatch(setIsSidebarCollapsed(true));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full transition-all duration-300 z-40 flex items-center justify-between px-12 
        ${isScrolled ? "bg-white dark:bg-black py-5 text-sm" : "bg-transparent py-10 text-lg dark:text-white text-white"}`}
    >
      {/* Left Side - Logo when top, Menu icon when scrolled */}
      <div className="flex items-center gap-8">
        {isScrolled ? (
          <button onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
            <Menu className="h-8 w-8 dark:text-white" />
          </button>
        ) : (
          <button onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
            <Menu className="h-8 w-8 dark:text-white" />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex justify-center gap-12 font-medium dark:text-white">
        <div className="cursor-pointer">Find Course</div>
        <div className="cursor-pointer">My Course</div>
        <div className="cursor-pointer">About</div>
        <div className="cursor-pointer">Support</div>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center">
        <button
          onClick={() => dispatch(setIsDarkmode(!isDarkMode))}
          className={isDarkMode ? `rounded p-2 dark:hover:bg-gray-700` : `rounded p-2 hover:bg-gray-100`}
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6 cursor-pointer dark:text-white" />
          ) : (
            <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
          )}
        </button>

      {user ? user.email : "User"}
      <a href="/auth/Login" className="cursor-pointer">
        <button className="rounded p-2 hover:bg-gray-100">
          <LifeBuoy className="h-6 w-6 cursor-pointer dark:text-white" />
        </button>
      </a>

      </div>
    </nav>
  );
};

export default Navbar;