"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import StoreProvider, { useAppSelector } from "./redux"
import { usePathname } from "next/navigation"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const pathname = usePathname()

  // Check if we're on the landing page
  const isLandingPage = pathname === "/"

  // Add a scroll state to the DashboardLayout component
  const [scrollPosition, setScrollPosition] = useState(0)

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

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial position

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Determine if we're at the top of the page
  const isAtTop = scrollPosition < 10

  // Calculate the left padding based on scroll position for a smoother transition
  const leftPadding = isLandingPage
    ? isAtTop
      ? "pl-0"
      : isSidebarCollapsed
        ? "pl-16"
        : "pl-64"
    : isSidebarCollapsed
      ? "pl-16"
      : "pl-64"

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
        <Sidebar isLandingPage={isLandingPage} scrollPosition={scrollPosition} />
      </div>

      {/* Main content with smooth padding transition */}
      <main
        className={`flex w-full flex-col transition-all duration-500 ease-in-out`}
        style={{
          paddingLeft: isLandingPage
            ? isAtTop
              ? "0px"
              : isSidebarCollapsed
                ? "64px"
                : "256px"
            : isSidebarCollapsed
              ? "64px"
              : "256px",
        }}
      >
        {/* Modify the Navbar component call to pass the scroll position */}
        <Navbar pathname={pathname} isLandingPage={isLandingPage} scrollPosition={scrollPosition} />

        {/* Content with conditional padding */}
        <div
          className={isLandingPage ? "" : "pt-16"}
          style={{
            paddingTop: isLandingPage ? (isAtTop ? "0" : "0") : "4rem",
            transition: "padding-top 0.3s ease-in-out",
          }}
        >
          {children}
        </div>
      </main>
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
