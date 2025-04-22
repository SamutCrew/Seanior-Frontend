"use client"

import { useAppDispatch, useAppSelector } from "@/app/redux"
import { setIsDarkmode, setIsSidebarCollapsed } from "@/state"
import { Menu, Moon, Sun, GraduationCap } from "lucide-react"
import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

interface NavbarProps {
  pathname: string
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
  const [isMenuHovered, setIsMenuHovered] = useState(false)
  const [isDarkModeHovered, setIsDarkModeHovered] = useState(false)

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

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        height: isLandingPage ? (isAtTop ? "80px" : "64px") : "64px",
      }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        !visible ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundColor: isLandingPage
          ? isAtTop
            ? "transparent" // Fully transparent when at top
            : isDarkMode
              ? `rgba(15, 23, 42, 0.95)`
              : `rgba(255, 255, 255, 0.95)`
          : isDarkMode
            ? "rgba(15, 23, 42, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
        backdropFilter: isAtTop ? "none" : "blur(10px)",
        borderBottom: !isAtTop
          ? isDarkMode
            ? "1px solid rgba(55, 65, 81, 0.2)"
            : "1px solid rgba(229, 231, 235, 0.2)"
          : "none",
        boxShadow: !isAtTop
          ? isDarkMode
            ? "0 4px 12px rgba(0, 0, 0, 0.1)"
            : "0 4px 12px rgba(0, 0, 0, 0.05)"
          : "none",
      }}
    >
      <div
        className="flex items-center justify-between px-4 max-w-7xl mx-auto h-full"
        style={{
          padding: isLandingPage && isAtTop ? "0 1.5rem" : "0 1rem", // More horizontal padding when transparent
        }}
      >
        <div className="flex items-center">
          {/* Hamburger menu with hover effect */}
          <motion.button
            onMouseEnter={() => setIsMenuHovered(true)}
            onMouseLeave={() => setIsMenuHovered(false)}
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`mr-4 rounded-md p-2 transition-all duration-200
              ${
                isLandingPage && isAtTop
                  ? "text-white hover:bg-white/10"
                  : isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <Menu
              className={`${isLandingPage && isAtTop ? "h-6 w-6" : "h-5 w-5"} ${isMenuHovered ? "text-cyan-500" : ""}`}
            />
          </motion.button>

          {/* Logo with gradient text to match sidebar */}
          <Link
            href="/"
            className="flex items-center transition-colors duration-300 mr-8"
            style={{
              marginRight: isLandingPage && isAtTop ? "2.5rem" : "2rem",
            }}
          >
            <GraduationCap className={`${isLandingPage && isAtTop ? "h-7 w-7" : "h-6 w-6"} text-cyan-600 mr-2`} />
            <span
              className={`font-bold ${
                isLandingPage && isAtTop
                  ? "text-white text-2xl"
                  : "text-xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"
              }`}
            >
              SeaNior
            </span>
          </Link>

          {/* Navigation links with hover effect */}
          <div className="hidden md:flex space-x-6" style={{ gap: isLandingPage && isAtTop ? "2rem" : "1.5rem" }}>
            {navItems.map((item) => (
              <motion.div key={item.name} whileHover={{ y: -2 }}>
                <Link
                  href={item.href}
                  className={`transition-colors duration-300 font-medium ${
                    isLandingPage && isAtTop
                      ? "text-white hover:text-white/80 text-lg"
                      : "text-gray-700 hover:text-cyan-600 dark:text-gray-300 dark:hover:text-cyan-400 text-base"
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-3" style={{ gap: isLandingPage && isAtTop ? "1.25rem" : "0.75rem" }}>
          {/* Dark mode toggle with hover effect */}
          <motion.button
            onMouseEnter={() => setIsDarkModeHovered(true)}
            onMouseLeave={() => setIsDarkModeHovered(false)}
            onClick={() => dispatch(setIsDarkmode(!isDarkMode))}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`rounded-full p-2 transition-all duration-200 ${
              isLandingPage && isAtTop ? "hover:bg-white/10" : isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            {isDarkMode ? (
              <Sun
                className={`${isLandingPage && isAtTop ? "h-6 w-6 text-white" : "h-5 w-5"} ${isDarkModeHovered ? "text-cyan-400" : "text-gray-300"}`}
              />
            ) : (
              <Moon
                className={`${isLandingPage && isAtTop ? "h-6 w-6 text-white" : "h-5 w-5"} ${isDarkModeHovered ? "text-cyan-600" : "text-gray-700"}`}
              />
            )}
          </motion.button>

          {/* Auth buttons with hover effects */}
          <div className="flex items-center gap-3" style={{ gap: isLandingPage && isAtTop ? "1rem" : "0.75rem" }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth/Login"
                className={`px-4 py-1.5 rounded-md transition-all duration-200 ${
                  isLandingPage && isAtTop
                    ? "text-white border border-white/50 hover:bg-white/10 text-base py-2"
                    : isDarkMode
                      ? "text-white border border-gray-700 hover:border-cyan-700 hover:bg-gray-800"
                      : "text-gray-700 border border-gray-200 hover:border-cyan-500 hover:bg-gray-50"
                }`}
              >
                Sign In
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth/Register"
                className={`px-4 py-1.5 rounded-md transition-all duration-200 ${
                  isLandingPage && isAtTop
                    ? "bg-white text-blue-600 hover:bg-white/90 text-base py-2"
                    : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700"
                }`}
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
