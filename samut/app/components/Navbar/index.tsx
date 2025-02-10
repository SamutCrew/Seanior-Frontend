import React from 'react';

const Navbar = () => {
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
      <div className="cursor-pointer text-black dark:text-white flex items-center">
        Text →
      </div>
    </nav>
  );
};

export default Navbar;
