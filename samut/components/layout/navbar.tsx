"use client"

import { useAppDispatch, useAppSelector } from "@/app/redux"
import { setIsDarkmode, setIsSidebarCollapsed } from "@/state"
import { Menu, Moon, Sun } from "lucide-react"
import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"

interface NavbarProps {
  pathname: string | null
  isLandingPage?: boolean
  scrollPosition?: number
}

const Navbar: React.FC<NavbarProps> = ({ pathname, isLandingPage = false, scrollPosition = 0 }) => {
  const dispatch = useAppDispatch()
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Track scroll direction
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY

      // Always show navbar, regardless of scroll position
      setVisible(true)

      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial position
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isLandingPage])

  // Landing page navigation items
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Instructors", href: "/search?type=teacher" },
    { name: "Courses", href: "/search?type=course" },
    { name: "Events", href: "/events" },
    { name: "About", href: "/about" },
  ]

  // Determine if we're at the top of the page
  const isAtTop = scrollPosition < 10

  // Calculate opacity based on scroll position for a smoother transition
  const backgroundOpacity = isLandingPage ? (isAtTop ? 0 : 1) : 1

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        !visible ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundColor: isLandingPage
          ? isAtTop
            ? "transparent" // Fully transparent when at top
            : isDarkMode
              ? `rgba(15, 23, 42, 0.9)`
              : `rgba(255, 255, 255, 0.9)`
          : isDarkMode
            ? "rgb(15, 23, 42)"
            : "rgb(255, 255, 255)",
        backdropFilter: isAtTop ? "none" : "blur(8px)",
        borderBottom: !isAtTop
          ? isDarkMode
            ? "1px solid rgba(55, 65, 81, 0.5)"
            : "1px solid rgba(229, 231, 235, 0.5)"
          : "none",
        height: isLandingPage ? (isAtTop ? "80px" : "64px") : "64px", // Only change height on landing page
        boxShadow: "none", // Ensure no shadow
      }}
    >
      <div
        className="flex items-center justify-between px-4 max-w-7xl mx-auto h-full"
        style={{
          padding: isLandingPage && isAtTop ? "0 1.5rem" : "0 1rem", // More horizontal padding when transparent
        }}
      >
        <div className="flex items-center">
          {/* Hamburger menu */}
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            className={`mr-4 rounded-md p-2 transition-all duration-300
              ${
                isLandingPage && isAtTop
                  ? "text-white hover:bg-white/10"
                  : isLandingPage
                    ? "text-gray-800 dark:text-white hover:bg-white/10"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            style={{
              marginRight: isLandingPage && isAtTop ? "1.5rem" : "1rem",
            }}
          >
            <Menu className={`${isLandingPage && isAtTop ? "h-6 w-6" : "h-5 w-5"}`} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className={`font-bold transition-colors duration-300 mr-8 ${
              isLandingPage && isAtTop ? "text-white text-2xl" : "text-gray-800 dark:text-white text-xl"
            }`}
            style={{
              marginRight: isLandingPage && isAtTop ? "2.5rem" : "2rem",
            }}
          >
            SeaNior
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex space-x-6" style={{ gap: isLandingPage && isAtTop ? "2rem" : "1.5rem" }}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors duration-300 font-medium ${
                  isLandingPage && isAtTop
                    ? "text-white hover:text-white/80 text-lg"
                    : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-base"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-3" style={{ gap: isLandingPage && isAtTop ? "1.25rem" : "0.75rem" }}>
          {/* Dark mode toggle */}
          <button
            onClick={() => dispatch(setIsDarkmode(!isDarkMode))}
            className={`rounded-full p-2 transition-all duration-300 hover:scale-110 transform ${
              isLandingPage && isAtTop ? "hover:bg-white/10" : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {isDarkMode ? (
              <Sun className={`${isLandingPage && isAtTop ? "h-6 w-6 text-white" : "h-5 w-5 text-gray-300"}`} />
            ) : (
              <Moon className={`${isLandingPage && isAtTop ? "h-6 w-6 text-white" : "h-5 w-5 text-gray-700"}`} />
            )}
          </button>

          {/* Auth buttons */}
          <div className="flex items-center gap-3" style={{ gap: isLandingPage && isAtTop ? "1rem" : "0.75rem" }}>
            <Link
              href="/auth/Login"
              className={`px-4 py-1.5 rounded-md transition-all duration-300 hover:scale-105 transform ${
                isLandingPage && isAtTop
                  ? "text-white border border-white/50 hover:bg-white/10 text-base py-2"
                  : "text-gray-700 border border-gray-300 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-800"
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/auth/Register"
              className={`px-4 py-1.5 rounded-md transition-all duration-300 hover:scale-105 transform ${
                isLandingPage && isAtTop
                  ? "bg-white text-blue-600 hover:bg-white/90 text-base py-2"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
