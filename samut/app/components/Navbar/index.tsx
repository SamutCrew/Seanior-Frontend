import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkmode, setIsSidebarCollapsed } from '@/state';
import { Link, LucideIcon, Menu, Moon, Search, Sun, BookOpen, GraduationCap, Info, LifeBuoy } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';




const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)



  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow-md dark:bg-black">
      {/* Logo */}
      <div className="flex items-center gap-8">
        {!isSidebarCollapsed ? null : (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          >
            <Menu className="h-8 w-8 dark:text-white" />
          </button>
        )}

      </div>


      {/* Menu Items */}
      <div className="flex justify-center gap-12 font-medium text-black dark:text-white">
        <div className="cursor-pointer">Find Course</div>
        <div className="cursor-pointer">My Course</div>
        <div className="cursor-pointer">About</div>
        <div className="cursor-pointer">Support</div>
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
        Userrrrrrrrr →
      </div>
      </div>
    </nav>
  );
};

// Define props for the NavbarLink component
interface NavbarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

// Reusable Navbar Link Component
const NavbarLink = ({ href, icon: Icon, label }: NavbarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="relative flex items-center gap-2 px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
      {isActive && <div className="absolute left-0 top-0 h-full w-[3px] bg-blue-500" />}
      <Icon className="h-5 w-5 text-gray-800 dark:text-gray-100" />
      <span className="font-medium text-gray-800 dark:text-gray-100">{label}</span>
    </Link>
  );
};

export default Navbar;


