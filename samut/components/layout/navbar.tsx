"use client"

import { useAppDispatch, useAppSelector } from "@/app/redux"
import { setIsDarkmode, toggleMobileSidebar } from "@/state"
import { Menu, Moon, Sun, GraduationCap, X } from "lucide-react"
import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

// Add these imports at the top of the file
import { useAuth } from "@/context/AuthContext"
import { ChevronDown, LogOut, Settings, UserCircle } from "lucide-react"

interface NavbarProps {
  pathname: string
  isLandingPage?: boolean
  scrollPosition?: number
}

// Update the Navbar component to include user authentication state
const Navbar: React.FC<NavbarProps> = ({ pathname, isLandingPage = false, scrollPosition = 0 }) => {
  const dispatch = useAppDispatch()
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed)
  const isMobileSidebarOpen = useAppSelector((state) => state.global.isMobileSidebarOpen)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Get authentication state from context
  const { user, logOut } = useAuth()

  // Add state for user dropdown menu
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Check if we're on an auth page
  const isAuthPage = pathname.startsWith("/auth/")

  // If we're on an auth page, don't render the navbar
  if (isAuthPage) {
    return null
  }

  // Track scroll direction
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)
  const [isMenuHovered, setIsMenuHovered] = useState(false)
  const [isDarkModeHovered, setIsDarkModeHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close user menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    let handleScroll: () => void

    if (typeof window !== "undefined") {
      handleScroll = () => {
        const currentScrollPos = window.scrollY

        // Always show navbar, regardless of scroll position
        setVisible(true)

        setPrevScrollPos(currentScrollPos)
      }

      window.addEventListener("scroll", handleScroll)
      handleScroll() // Check initial position
    }

    return () => {
      if (typeof window !== "undefined" && handleScroll) {
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [isLandingPage])

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logOut()
      setIsUserMenuOpen(false)
      // You might want to redirect the user after logout
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

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

  // Toggle mobile sidebar
  const handleToggleMobileSidebar = () => {
    dispatch(toggleMobileSidebar())
  }

  // Get display name from user object
  const getDisplayName = () => {
    if (!user) return ""
    if (user.displayName) return user.displayName
    if (user.email) {
      // Extract name from email (before @)
      const emailName = user.email.split("@")[0]
      return emailName.charAt(0).toUpperCase() + emailName.slice(1)
    }
    return "User"
  }

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
          {/* Hamburger menu with hover effect - visible on all screens */}
          <motion.button
            onMouseEnter={() => setIsMenuHovered(true)}
            onMouseLeave={() => setIsMenuHovered(false)}
            onClick={handleToggleMobileSidebar}
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
            aria-label="Toggle sidebar"
          >
            {isMobileSidebarOpen ? (
              <X
                className={`${isLandingPage && isAtTop ? "h-6 w-6" : "h-5 w-5"} ${isMenuHovered ? "text-cyan-500" : ""}`}
              />
            ) : (
              <Menu
                className={`${isLandingPage && isAtTop ? "h-6 w-6" : "h-5 w-5"} ${isMenuHovered ? "text-cyan-500" : ""}`}
              />
            )}
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

          {/* Navigation links with hover effect - hidden on mobile */}
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
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
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

          {/* Conditional rendering based on authentication status */}
          {user ? (
            // User is authenticated - show user profile section
            <div className="relative">
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                  isLandingPage && isAtTop
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : isDarkMode
                      ? "bg-slate-800 text-white hover:bg-slate-700"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                <div className="relative">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL || "/placeholder.svg"}
                      alt={getDisplayName()}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isLandingPage && isAtTop
                          ? "bg-white/20 text-white"
                          : isDarkMode
                            ? "bg-cyan-600 text-white"
                            : "bg-cyan-100 text-cyan-600"
                      }`}
                    >
                      {getDisplayName().charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                </div>
                <span
                  className={`font-medium text-sm hidden sm:block ${
                    isLandingPage && isAtTop ? "text-white" : isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {getDisplayName()}
                </span>
                <ChevronDown
                  className={`w-4 h-4 ${
                    isLandingPage && isAtTop ? "text-white" : isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                />
              </motion.button>

              {/* User dropdown menu */}
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${
                    isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"
                  }`}
                >
                  <Link
                    href="/profile"
                    className={`flex items-center gap-2 px-4 py-2 text-sm ${
                      isDarkMode ? "text-gray-200 hover:bg-slate-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <UserCircle className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  {user.user_type === "admin" && (
                    <Link
                      href="/admin"
                      className={`flex items-center gap-2 px-4 py-2 text-sm ${
                        isDarkMode ? "text-gray-200 hover:bg-slate-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" /> {/* You can use a different icon if preferred */}
                      <span>Admin</span>
                    </Link>
                  )}
                  <Link
                    href="/settings"
                    className={`flex items-center gap-2 px-4 py-2 text-sm ${
                      isDarkMode ? "text-gray-200 hover:bg-slate-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <div className={`border-t ${isDarkMode ? "border-slate-700" : "border-gray-200"} my-1`}></div>
                  <button
                    onClick={logOut}
                    className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left ${
                      isDarkMode ? "text-red-400 hover:bg-slate-700" : "text-red-600 hover:bg-gray-100"
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            // User is not authenticated - show login/register buttons
            <div
              className="hidden sm:flex items-center gap-3"
              style={{ gap: isLandingPage && isAtTop ? "1rem" : "0.75rem" }}
            >
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
          )}

          {/* Mobile menu button - only visible on small screens */}
          <div className="sm:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-md ${
                isLandingPage && isAtTop
                  ? "text-white hover:bg-white/10"
                  : isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className={isLandingPage && isAtTop ? "h-6 w-6" : "h-5 w-5"} />
              ) : (
                <Menu className={isLandingPage && isAtTop ? "h-6 w-6" : "h-5 w-5"} />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - only visible on mobile when toggled */}
      <AnimatedMobileMenu
        isOpen={isMobileMenuOpen}
        navItems={navItems}
        isDarkMode={isDarkMode}
        isLandingPage={isLandingPage}
        isAtTop={isAtTop}
        user={user}
        onLogout={handleLogout}
      />
    </motion.nav>
  )
}

// Update the AnimatedMobileMenu component to include user authentication state
interface AnimatedMobileMenuProps {
  isOpen: boolean
  navItems: { name: string; href: string }[]
  isDarkMode: boolean
  isLandingPage: boolean
  isAtTop: boolean
  user: any
  onLogout: () => void
}

const AnimatedMobileMenu: React.FC<AnimatedMobileMenuProps> = ({
  isOpen,
  navItems,
  isDarkMode,
  isLandingPage,
  isAtTop,
  user,
  onLogout,
}) => {
  if (!isOpen) return null

  // Get display name from user object
  const getDisplayName = () => {
    if (!user) return ""
    if (user.displayName) return user.displayName
    if (user.email) {
      // Extract name from email (before @)
      const emailName = user.email.split("@")[0]
      return emailName.charAt(0).toUpperCase() + emailName.slice(1)
    }
    return "User"
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`md:hidden w-full overflow-hidden ${
        isDarkMode ? "bg-slate-900/95" : "bg-white/95"
      } backdrop-blur-md border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}
    >
      {/* User profile section for mobile - only shown when authenticated */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 mb-2 border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}
        >
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img
                src={user.photoURL || "/placeholder.svg"}
                alt={getDisplayName()}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-cyan-600 text-white" : "bg-cyan-100 text-cyan-600"
                }`}
              >
                {getDisplayName().charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>{getDisplayName()}</p>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{user.email}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="px-4 py-3 space-y-1">
        {navItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={item.href}
              className={`block py-2 px-3 rounded-md ${
                isDarkMode ? "text-gray-200 hover:bg-gray-800" : "text-gray-800 hover:bg-gray-100"
              } transition-colors duration-200`}
            >
              {item.name}
            </Link>
          </motion.div>
        ))}

        {/* Conditional rendering for mobile auth buttons */}
        {user ? (
          // User is authenticated - show profile and logout options
          <div className="pt-2 pb-3 border-t border-gray-200 dark:border-gray-800 mt-2 flex flex-col space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.1 }}
            >
              <Link
                href="/profile"
                className={`flex items-center gap-2 py-2 px-3 rounded-md ${
                  isDarkMode ? "text-gray-200 hover:bg-gray-800" : "text-gray-800 hover:bg-gray-100"
                } transition-colors duration-200`}
              >
                <UserCircle className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.1 + 0.1 }}
            >
              <Link
                href="/settings"
                className={`flex items-center gap-2 py-2 px-3 rounded-md ${
                  isDarkMode ? "text-gray-200 hover:bg-gray-800" : "text-gray-800 hover:bg-gray-100"
                } transition-colors duration-200`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.1 + 0.2 }}
            >
              <button
                onClick={onLogout}
                className={`flex items-center gap-2 w-full text-left py-2 px-3 rounded-md ${
                  isDarkMode ? "text-red-400 hover:bg-gray-800" : "text-red-600 hover:bg-gray-100"
                } transition-colors duration-200`}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </motion.div>
          </div>
        ) : (
          // User is not authenticated - show login/register buttons
          <div className="pt-2 pb-3 border-t border-gray-200 dark:border-gray-800 mt-2 flex flex-col space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.1 }}
            >
              <Link
                href="/auth/Login"
                className={`block py-2 px-3 rounded-md text-center ${
                  isDarkMode
                    ? "text-gray-200 border border-gray-700 hover:bg-gray-800"
                    : "text-gray-800 border border-gray-200 hover:bg-gray-100"
                } transition-colors duration-200`}
              >
                Sign In
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.1 + 0.1 }}
            >
              <Link
                href="/auth/Register"
                className={`block py-2 px-3 rounded-md text-center ${
                  isDarkMode
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                    : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                } transition-colors duration-200`}
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Navbar
