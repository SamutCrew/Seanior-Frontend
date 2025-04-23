"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Navbar from "../components/layout/navbar"
import Sidebar from "../components/layout/sidebar"
import StoreProvider, { useAppSelector } from "./redux"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

// Update the DashboardLayout component to check for auth routes
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed)
  const isMobileSidebarOpen = useAppSelector((state) => state.global.isMobileSidebarOpen)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const pathname = usePathname()

  // Check if we're on the landing page
  const isLandingPage = pathname === "/"

  // Check if we're on an auth page
  const isAuthPage = pathname.startsWith("/auth/")

  // Update the userRole determination to use a state variable that can be toggled
  const [userRoleState, setUserRoleState] = useState<"student" | "teacher">(
    pathname.startsWith("/Teacher") || pathname.startsWith("/teacher") ? "teacher" : "student",
  )

  // Add a scroll state to the DashboardLayout component
  const [scrollPosition, setScrollPosition] = useState(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Add this useEffect after the existing useEffect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)

    handleScroll() // Check initial position
    handleResize() // Check initial size

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Determine if we're at the top of the page
  const isAtTop = scrollPosition < 10

  // Determine if we're on mobile
  const isMobile = windowWidth < 768

  // Animation variants for the main content
  const mainContentVariants = {
    expanded: {
      paddingLeft: isLandingPage && isAtTop ? "0px" : isMobile ? "0px" : "240px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    collapsed: {
      paddingLeft: isLandingPage && isAtTop ? "0px" : isMobile ? "0px" : "64px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    auth: {
      paddingLeft: "0px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  // If we're on an auth page, render only the children without navigation
  if (isAuthPage) {
    return (
      <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-white">
        <motion.main initial="auth" animate="auth" variants={mainContentVariants} className="flex w-full flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-white">
      {/* Sidebar - with smooth opacity transition */}
      <div
        className={`z-40 transition-all duration-500 ease-in-out ${
          isLandingPage && scrollPosition === 0 ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
        }`}
        style={{
          opacity: isLandingPage ? Math.min(scrollPosition / 50, 1) : 1,
        }}
      >
        {/* Pass the state setter to the Sidebar component */}
        <Sidebar isLandingPage={isLandingPage} scrollPosition={scrollPosition} userRole={userRoleState} />
      </div>

      {/* Main content with smooth padding transition */}
      <motion.main
        initial={false}
        animate={
          isMobile
            ? "collapsed" // Always use collapsed layout on mobile
            : isSidebarCollapsed
              ? "collapsed"
              : "expanded"
        }
        variants={mainContentVariants}
        className="flex w-full flex-col transition-all duration-500 ease-in-out"
        style={{
          marginLeft: 0, // Ensure no margin is creating a gap
        }}
      >
        {/* Modify the Navbar component call to pass the scroll position */}
        <Navbar pathname={pathname} isLandingPage={isLandingPage} scrollPosition={scrollPosition} />

        {/* Content with conditional padding */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={isLandingPage ? "" : "pt-16"}
            style={{
              paddingTop: isLandingPage ? (isAtTop ? "0" : "0") : "4rem",
              transition: "padding-top 0.3s ease-in-out",
              width: "100%", // Ensure full width
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  )
}

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  )
}

export default DashboardWrapper
