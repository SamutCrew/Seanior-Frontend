"use client";
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkmode, setIsSidebarCollapsed } from '@/state';
import Image from "next/image";
import { Menu, Moon, Sun, LifeBuoy } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { getAuthUser } from '@/app/context/authToken';

interface User {
  email: string;
}

interface NavbarProps {
  pathname: string;
}

const Navbar: React.FC<NavbarProps> = ({ pathname }) => {
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getAuthUser();
      setUser(user as User);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
      if (window.scrollY === 0) {
        dispatch(setIsSidebarCollapsed(true));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch, pathname]);

  const isHome = pathname === '/';
  const scrolledClass = isHome && !isScrolled
    ? "bg-transparent text-white"
    : "bg-white text-black dark:bg-black dark:text-white";

  const paddingClass = isHome ? (isScrolled ? "py-5 text-sm" : "py-10 text-lg") : "py-5";

  return (
    <nav
      className={`fixed top-0 left-0 w-full transition-all duration-300 z-40 flex items-center justify-between px-12 ${scrolledClass} ${paddingClass}`}
    >
      {/* Left - Menu */}
      <div className="flex items-center gap-8">
        <button onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
          <Menu className="h-8 w-8" />
        </button>
      </div>

      {/* Center - Links */}
      <div className="flex justify-center gap-12 font-medium">
        <div className="cursor-pointer">Find Course</div>
        <div className="cursor-pointer">My Course</div>
        <div className="cursor-pointer">About</div>
        <div className="cursor-pointer">Support</div>
      </div>

      {/* Right - Toggles */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(setIsDarkmode(!isDarkMode))}
          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>

        <div className="text-sm">{user ? user.email : "User"}</div>

        <a href="/auth/Login">
          <button className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <LifeBuoy className="h-6 w-6" />
          </button>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
