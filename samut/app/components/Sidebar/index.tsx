// "use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image
import { Briefcase, HomeIcon, Icon, Lock, LucideIcon, Search, Settings, User, Users, LucideHome, X, Check, BookOpenCheck, School, LogOut, MessageCircleQuestion, ChevronUp, ChevronDown, AlertCircle, ShieldAlert, AlertTriangle, AlertOctagon, Layers3 } from "lucide-react"; // Correct import from lucide-react
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useAuth } from "@/app/context/AuthContext";


const Sidebar = () => {
  const { user, logOut } = useAuth();
  const [showProject, setShowProject] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);

  // Dummy user data
  const dummyUser = {
    username: "John Doe",
    profilePictureUrl: "", // Leave empty to show default icon
  };

  const handleSignOut = () => {
    alert("Signed out!"); // Replace this with actual sign-out logic
  };

  const sidebarClassNames = `fixed flex flex-col h-full justify-between shadow-xl transition-all duration-300 z-40 dark:bg-black overflow-y-auto bg-white 
  ${isSidebarCollapsed ? "w-0" : "w-64"}`;

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-full w-full flex-col justify-start">
        {/* Top Logo */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            Sea Nior
          </div> 
          {isSidebarCollapsed ? null : (
            <button
              className="py-3"
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>

        {/* Team Section */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
          <Image src="/SeaNoir_Logo_DarkBg.png" alt="Logo" width={40} height={40} />
          <div>
            <h2 className="text-md font-bold tracking-wide dark:text-gray-200">
              Sea Nior Team
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
          <SidebarLink icon={BookOpenCheck} label="Find Course" href="/" />
          <SidebarLink icon={School} label="My Course" href="/" />
          <SidebarLink icon={MessageCircleQuestion} label="Support" href="/" />
          <SidebarLink icon={Settings} label="Setting" href="/" />
        </nav>


        {/* PRIORITIES LINKS */}
        <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Coach class</span>
          {showPriority ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {showPriority && (
          <>
            <SidebarLink
              icon={AlertCircle}
              label="Class 1"
              href="/priority/urgent"
            />
            <SidebarLink
              icon={ShieldAlert}
              label="Class 2"
              href="/priority/high"
            />
            <SidebarLink
              icon={AlertTriangle}
              label="Class 3"
              href="/priority/medium"
            />
            <SidebarLink 
              icon={AlertOctagon} 
              label="Class 4" 
              href="/priority/low" 
            />
            
            <SidebarLink
              icon={Layers3}
              label="Class 5"
              href="/priority/backlog"
            />
          </>
        )}
      </div>
      <div className="z-10 mt-40 flex w-full flex-col items-center gap-4 bg-white px-6 py-2 dark:bg-black md:block h-screen">
  {/* User Profile Section (Top) */}
  <div className="flex w-full items-center">
    <div className="align-center flex h-9 w-9 justify-center">
      {dummyUser.profilePictureUrl ? (
        <Image
          src={dummyUser.profilePictureUrl}
          alt={dummyUser.username || "User Profile Picture"}
          width={100}
          height={50}
          className="h-full rounded-full object-cover"
        />
      ) : (
        <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
      )}
    </div>
    <span className="mx-3 text-gray-800 dark:text-white">
      { user ? user.email : dummyUser.username}
    </span>
  </div>

  {/* Spacer to push the Logout button to the bottom */}
  <div className="flex-grow"></div>

  {/* Logout Button (Bottom) */}
  {/* <SidebarLink icon={LogOut} label="Logout" href="/" /> */}
  <button onClick={logOut} className="w-full">
    <div className="flex items-center gap-3 rounded-md px-2 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
      <LogOut className="h-6 w-6" />
      <span className="font-medium">Logout</span>
    </div>
  </button>
</div>
</div>

  );
};

interface SidebarLinkProps{
  href: string
  icon: LucideIcon,
  label : string
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
}: SidebarLinkProps) =>{
  const pathname = usePathname();
  const isActive = pathname === href || (pathname === "/" && href === "/dashboard")


return(
  <Link href={href} className="w-full">
    <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-200 dark:bg-black dark:hover:bg-gray-700 ${
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
