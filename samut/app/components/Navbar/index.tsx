import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkmode, setIsSidebarCollapsed } from '@/state';
import { Menu, Moon, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from "next/image";

const Navbar = () => {
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
        <div className="cursor-pointer dark:text-white text-white flex items-center ml-4">
          Userrrrrrrrr →
        </div>
      </div>
    </nav>
  );
};

export default Navbar;