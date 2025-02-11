"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image
import { Briefcase, HomeIcon, Icon, Lock, LucideIcon, Search, Settings, User, Users, LucideHome } from "lucide-react"; // Correct import from lucide-react
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux";

const Sidebar = () => {
  const [showProject, setShowProject] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  const sidebarClassNames = `fixed flex flex-col h-full justify-between shadow-xl transition-all duration-300 z-40 dark:bg-black overflow-y-auto bg-white w-64`;

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-full w-full flex-col justify-start">
        {/* Top Logo */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            Samut
          </div>
        </div>

        {/* Team Section */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <div>
            <h2 className="text-md font-bold tracking-wide dark:text-gray-200">
              Samut Team
            </h2>
            <div className="mt-1 flex items-start gap-2">
              <Lock className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
        {/* Navbar Link */}
        <nav className="z-10 w-full">
          <SidebarLink icon={LucideHome} label="Home" href="/" />
        </nav>

      </div>
    </div>
  );
};

interface SidebarLinkProps{
  href: string
  icon: LucideIcon,
  label : string
  // isCollapsed : boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  // isCollapsed
}: SidebarLinkProps) =>{
  const pathname = usePathname();
  const isActive = pathname === href || (pathname === "/" && href === "/dashboard")
  const sreenWidth = window.innerWidth;

  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed)


return(
  <Link href={href} className="w-full">
    <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${
          isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""
        } justify-start px-8 py-3`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200" />
        )}

        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
        <span className={`font-medium text-gray-800 dark:text-gray-100`}>
          {label}
        </span>
      </div>
  </Link>
)
};

export default Sidebar;
