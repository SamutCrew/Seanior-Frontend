"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronDown,
  ChevronUp,
  Home,
  LogOut,
  MessageCircleQuestion,
  School,
  Settings,
  User,
  Calendar,
  Users,
  GraduationCap,
  BarChart3,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/app/redux"
import { setIsSidebarCollapsed } from "@/state"
import type { LucideIcon } from "lucide-react"

interface SidebarProps {
  isLandingPage?: boolean
  scrollPosition?: number
}

const Sidebar = ({ isLandingPage = false, scrollPosition = 0 }: SidebarProps) => {
  const [showClasses, setShowClasses] = useState(true)

  const dispatch = useAppDispatch()
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const handleSignOut = () => {
    alert("Signed out!")
  }

  const sidebarWidth = isSidebarCollapsed ? "w-16" : "w-64"

  // Add this constant to determine if we're at the top of the page
  const isAtTop = scrollPosition < 50 && isLandingPage

  // Calculate opacity based on scroll position for a smoother transition
  const opacity = isLandingPage ? Math.min(scrollPosition / 50, 1) : 1

  // Hide sidebar completely on landing page when at the top
  if (isLandingPage && scrollPosition === 0) {
    return null
  }

  return (
    <div
      className={`h-full flex flex-col justify-between transition-all duration-500 ease-in-out z-40 
        ${isLandingPage ? "bg-transparent backdrop-blur-sm" : "bg-white dark:bg-slate-900"} 
        shadow-xl ${sidebarWidth} pointer-events-auto fixed`}
      style={{
        opacity: isLandingPage ? opacity : 1,
        transform: isLandingPage && scrollPosition < 50 ? "translateX(-100%)" : "none",
        backgroundColor: isLandingPage ? `rgba(255, 255, 255, ${opacity * 0.9})` : "",
        maxHeight: "100vh", // Prevent sidebar from extending beyond viewport height
        overflowY: "auto", // Add scrolling for content that exceeds height
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="flex h-full w-full flex-col justify-start">
        {/* Top Logo */}
        <div
          className={`z-10 flex min-h-[56px] items-center justify-between pt-3 
            transition-colors duration-500
            ${isLandingPage ? "bg-transparent" : "bg-white dark:bg-slate-900"}
            ${isSidebarCollapsed ? "px-2" : "px-6"}`}
        >
          {isSidebarCollapsed ? (
            <div className="mx-auto">
              <GraduationCap className="h-6 w-6 text-cyan-600" />
            </div>
          ) : (
            <>
              <div className="text-xl font-bold text-gray-800 dark:text-white">SeaNior</div>
              <button
                className="py-3 transition-transform hover:scale-110 duration-300"
                onClick={() => {
                  dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
                }}
              >
                <ChevronUp className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
              </button>
            </>
          )}
        </div>

        {/* Team Section */}
        {!isSidebarCollapsed ? (
          <div
            className={`flex items-center gap-5 px-8 py-4 transition-colors duration-500
            ${isLandingPage ? "border-y-[1.5px] border-gray-200/50" : "border-y-[1.5px] border-gray-200 dark:border-gray-700"}`}
          >
            <div className="bg-cyan-600 rounded-full p-2">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-md font-bold tracking-wide dark:text-gray-200">Teacher Portal</h2>
              <div className="mt-1 flex items-start gap-2">
                <p className="text-xs text-gray-500">Swimming Instructor</p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`flex justify-center py-4 transition-colors duration-500
            ${isLandingPage ? "border-y-[1.5px] border-gray-200/50" : "border-y-[1.5px] border-gray-200 dark:border-gray-700"}`}
          >
            <div className="bg-cyan-600 rounded-full p-2">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
          </div>
        )}

        {/* Navbar Links */}
        <nav className="z-10 w-full">
          <SidebarLink
            icon={Home}
            label="Dashboard"
            href="/Teacher/manage"
            collapsed={isSidebarCollapsed}
            isLandingPage={isLandingPage}
          />
          <SidebarLink
            icon={School}
            label="Find Course"
            href="/search"
            collapsed={isSidebarCollapsed}
            isLandingPage={isLandingPage}
          />
          <SidebarLink
            icon={School}
            label="My Courses"
            href="/Teacher/profile/courses"
            collapsed={isSidebarCollapsed}
            isLandingPage={isLandingPage}
          />
          <SidebarLink
            icon={User}
            label="Profile"
            href="/Teacher/profile/edit"
            collapsed={isSidebarCollapsed}
            isLandingPage={isLandingPage}
          />
          <SidebarLink
            icon={Calendar}
            label="Schedule"
            href="/Teacher/schedule"
            collapsed={isSidebarCollapsed}
            isLandingPage={isLandingPage}
          />
          <SidebarLink
            icon={MessageCircleQuestion}
            label="Support"
            href="/support"
            collapsed={isSidebarCollapsed}
            isLandingPage={isLandingPage}
          />
          <SidebarLink
            icon={Settings}
            label="Settings"
            href="/settings"
            collapsed={isSidebarCollapsed}
            isLandingPage={isLandingPage}
          />
        </nav>

        {/* Classes Section */}
        {!isSidebarCollapsed && (
          <button
            onClick={() => setShowClasses((prev) => !prev)}
            className={`flex w-full items-center justify-between px-8 py-3 transition-colors duration-500
              ${isLandingPage ? "text-gray-600" : "text-gray-500 dark:text-gray-400"}`}
          >
            <span>My Classes</span>
            {showClasses ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        )}

        {!isSidebarCollapsed && showClasses && (
          <>
            <SidebarLink
              icon={Users}
              label="Beginner Swimming"
              href="/classes/beginner"
              collapsed={isSidebarCollapsed}
              isLandingPage={isLandingPage}
            />
            <SidebarLink
              icon={Users}
              label="Advanced Techniques"
              href="/classes/advanced"
              collapsed={isSidebarCollapsed}
              isLandingPage={isLandingPage}
            />
            <SidebarLink
              icon={Users}
              label="Intermediate Stroke"
              href="/classes/intermediate"
              collapsed={isSidebarCollapsed}
              isLandingPage={isLandingPage}
            />
            <SidebarLink
              icon={Users}
              label="Kids Swimming"
              href="/classes/kids"
              collapsed={isSidebarCollapsed}
              isLandingPage={isLandingPage}
            />
            <SidebarLink
              icon={BarChart3}
              label="Class Analytics"
              href="/classes/analytics"
              collapsed={isSidebarCollapsed}
              isLandingPage={isLandingPage}
            />
          </>
        )}

        {isSidebarCollapsed && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowClasses((prev) => !prev)}
              className={`rounded-full p-2 transition-all duration-300
                ${isLandingPage ? "hover:bg-gray-100/50" : "hover:bg-gray-100 dark:hover:bg-gray-800"} hover:scale-110 transform`}
            >
              {showClasses ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        )}

        {isSidebarCollapsed && showClasses && (
          <>
            <SidebarLink
              icon={Users}
              label="Beginner"
              href="/classes/beginner"
              collapsed={isSidebarCollapsed}
              isLandingPage={isLandingPage}
            />
            <SidebarLink
              icon={Users}
              label="Advanced"
              href="/classes/advanced"
              collapsed={isSidebarCollapsed}
              isLandingPage={isLandingPage}
            />
            <SidebarLink
              icon={Users}
              label="Intermediate"
              href="/classes/intermediate"
              collapsed={isSidebarCollapsed}
              isLandingPage={isLandingPage}
            />
            <SidebarLink
              icon={Users}
              label="Kids"
              href="/classes/kids"
              collapsed={isSidebarCollapsed}
              isLandingPage={isLandingPage}
            />
            <SidebarLink
              icon={BarChart3}
              label="Analytics"
              href="/classes/analytics"
              collapsed={isSidebarCollapsed}
              isLandingPage={isLandingPage}
            />
          </>
        )}
      </div>

      {/* User Profile Section */}
      <div
        className={`z-10 flex w-full flex-col py-4 transition-colors duration-500
          ${isLandingPage ? "border-t border-gray-200/50" : "border-t border-gray-200 dark:border-gray-700"} 
          ${isLandingPage ? "bg-transparent" : "bg-white dark:bg-slate-900"}
          ${isLandingPage ? "bg-transparent" : "bg-white dark:bg-slate-900"}
          ${isSidebarCollapsed ? "items-center px-3" : "px-6"}`}
      >
        {!isSidebarCollapsed ? (
          <>
            <div className="flex w-full items-center mb-4">
              <div className="bg-cyan-600 rounded-full p-1 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <span
                  className={`text-sm font-medium ${isLandingPage ? "text-gray-700" : "text-gray-800 dark:text-white"}`}
                >
                  Alex Johnson
                </span>
                <p className="text-xs text-gray-500">Swimming Instructor</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleSignOut}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 transition-all duration-300
                ${
                  isLandingPage
                    ? "text-gray-700 hover:bg-gray-100/50"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                } hover:scale-105 transform`}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <div className="bg-cyan-600 rounded-full p-1 flex items-center justify-center mb-4">
              <User className="h-4 w-4 text-white" />
            </div>
            <button
              onClick={handleSignOut}
              className={`rounded-full p-2 transition-all duration-300
                ${isLandingPage ? "hover:bg-gray-100/50" : "hover:bg-gray-100 dark:hover:bg-gray-800"} hover:scale-110 transform`}
              title="Logout"
            >
              <LogOut className={`h-5 w-5 ${isLandingPage ? "text-gray-700" : "text-gray-700 dark:text-gray-300"}`} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

interface SidebarLinkProps {
  href: string
  icon: LucideIcon
  label: string
  collapsed: boolean
  isLandingPage?: boolean
}

const SidebarLink = ({ href, icon: Icon, label, collapsed, isLandingPage = false }: SidebarLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname === href || pathname?.startsWith(href) || (pathname === "/" && href === "/dashboard")

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center transition-all duration-300 
          ${
            isLandingPage
              ? isActive
                ? "bg-gray-100/50"
                : "hover:bg-gray-200/50"
              : isActive
                ? "bg-gray-100 dark:bg-gray-800"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
          } 
          justify-start ${collapsed ? "px-0 py-4 flex-col" : "px-8 py-3 gap-3"} hover:scale-[1.02] transform`}
      >
        {isActive && <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-cyan-500" />}

        <Icon
          className={`${collapsed ? "h-5 w-5 mx-auto" : "h-5 w-5"} 
            ${isActive ? "text-cyan-600" : isLandingPage ? "text-gray-700" : "text-gray-700 dark:text-gray-300"}`}
        />

        {!collapsed && (
          <span
            className={`font-medium 
            ${isActive ? "text-cyan-600" : isLandingPage ? "text-gray-700" : "text-gray-700 dark:text-gray-300"}`}
          >
            {label}
          </span>
        )}

        {collapsed && (
          <span
            className={`text-[10px] mt-1 font-medium text-center truncate w-full px-1 
            ${isLandingPage ? "text-gray-700" : "text-gray-700 dark:text-gray-300"}`}
          >
            {label.split(" ")[0]}
          </span>
        )}
      </div>
    </Link>
  )
}

export default Sidebar
