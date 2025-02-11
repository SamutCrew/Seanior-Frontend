import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkmode } from '@/state';
import { Link, Moon, Sun } from 'lucide-react';
import React from 'react';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)



  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow-md dark:bg-black">
      {/* Logo */}
      <div className="p-2 bg-gray-200 text-black dark:bg-gray-700 dark:text-white">
        Logo
      </div>

      {/* Menu Items */}
      <div className="flex space-x-8 text-black dark:text-white">
        <div className="cursor-pointer">Text ⌄</div>
        <div className="cursor-pointer">Text</div>
        <div className="cursor-pointer">Text</div>
        <div className="cursor-pointer">Text</div>
      </div>

      {/* Last Item */}
      {/* Icons */}
      <div className="flex items-center">
        <button
          onClick={() => dispatch(setIsDarkmode(!isDarkMode))}
          className={
            isDarkMode
              ? `rounded p-2 dark:hover:bg-gray-700`
              : `rounded p-2 hover:bg-gray-100`
          }
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6 cursor-pointer dark:text-white" />
          ) : (
            <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
          )}
        </button>
      <div className="cursor-pointer text-black dark:text-white flex items-center">
        Text →
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
