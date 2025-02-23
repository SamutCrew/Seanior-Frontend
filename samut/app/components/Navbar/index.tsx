import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkmode, setIsSidebarCollapsed } from '@/state';
import { Link, LucideIcon, Menu, Moon, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';
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

      // ✅ Collapse sidebar when scrolled to the top
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
        ${isScrolled ? "bg-white dark:bg-black py-5 text-sm" : "bg-transparent py-10 text-lg"}`}
    >
      {/* Logo / Menu Button */}
      <div className="flex items-center gap-8">
        {isScrolled ? (
          isSidebarCollapsed ? ( // Only show menu if sidebar is collapsed
            <button onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
              <Menu className="h-8 w-8 dark:text-white" />
            </button>
          ) : null
        ) : (
          <Image src="/SeaNoir_Logo_DarkBg.png" alt="Logo" width={40} height={40} />
        )}
      </div>

      {/* Menu Items */}
      <div className="flex justify-center gap-12 font-medium text-black dark:text-white">
        <div className="cursor-pointer">Find Course</div>
        <div className="cursor-pointer">My Course</div>
        <div className="cursor-pointer">About</div>
        <div className="cursor-pointer">Support</div>
      </div>

      {/* Icons */}
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
        <div className="cursor-pointer text-black dark:text-white flex items-center">
          Userrrrrrrrr →
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
