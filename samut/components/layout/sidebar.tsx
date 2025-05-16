"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  MessageCircle,
  BookOpen,
  Settings,
  User,
  Calendar,
  Users,
  GraduationCap,
  BarChart3,
  Search,
  Clock,
  Compass,
  Award,
  Menu,
  X,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/app/redux"
import { setIsSidebarCollapsed, toggleMobileSidebar } from "@/state"
import type { LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"

interface SidebarProps {
  isLandingPage?: boolean
  scrollPosition?: number
  userRole?: "student" | "teacher"
}

const Sidebar = ({ isLandingPage = false, scrollPosition = 0, userRole = "student" }: SidebarProps) => {
  const { user, logOut } = useAuth()

  const [devMode, setDevMode] = useState(false)
  const [userRoleState, setUserRoleState] = useState(userRole)
  const [showClasses, setShowClasses] = useState(true)
  const [isHandleHovered, setIsHandleHovered] = useState(false)
  const [isMenuHovered, setIsMenuHovered] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed)
  const isMobileSidebarOpen = useAppSelector((state) => state.global.isMobileSidebarOpen)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Check if we're on an auth page
  const isAuthPage = pathname.startsWith("/auth/")

  // If we're on an auth page, don't render the sidebar
  if (isAuthPage) {
    return null
  }

  const handleResize = useRef<() => void>(() => {})

  handleResize.current = () => {
    setWindowWidth(window.innerWidth)
    // Auto-collapse sidebar on small screens
    if (window.innerWidth < 768 && !isSidebarCollapsed) {
      dispatch(setIsSidebarCollapsed(true))
    }
  }

  // Track window resize
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const debouncedHandleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        handleResize.current()
      }, 100) // Debounce the resize event
    }

    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth) // Set initial width
      window.addEventListener("resize", debouncedHandleResize)
      debouncedHandleResize() // Check initial size

      return () => {
        window.removeEventListener("resize", debouncedHandleResize)
        clearTimeout(timeoutId)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [])

  const handleLogout = async () => {
    try {
      await logOut()
      // You might want to redirect the user after logout
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }
  // Add this constant to determine if we're at the top of the page
  const isAtTop = scrollPosition < 50 && isLandingPage

  // Calculate opacity based on scroll position for a smoother transition
  const opacity = isLandingPage ? Math.min(scrollPosition / 50, 1) : 1

  // Hide sidebar completely on landing page when at the top
  if (isLandingPage && scrollPosition === 0) {
    return null
  }

  // Determine if we should show the mobile sidebar
  const isMobile = windowWidth < 768
  const showMobileSidebar = isMobile && isMobileSidebarOpen
  const showDesktopSidebar = !isMobile || (isMobile && isMobileSidebarOpen)

  // Define navigation items for each role
  const teacherNavItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "My Courses", href: "/dashboard/courses/manage/1" },
    { icon: User, label: "Profile", href: "/teacher/1" },
    { icon: MessageCircle, label: "Support", href: "/support" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  const studentNavItems = [
    { icon: Search, label: "Find Instructors", href: "/allinstructor" },
    { icon: BookOpen, label: "My Courses", href: "/my-courses" },
    { icon: User, label: "Profile", href: user?.user_id ? `/profile/${user.user_id}` : "/profile" },
  ]

  // Select the appropriate navigation items based on user role
  const navItems = userRoleState === "teacher" ? teacherNavItems : studentNavItems

  // Define class items for each role
  const teacherClassItems = [
    { icon: Users, label: "Beginner Swimming", href: "/classes/beginner" },
    { icon: Users, label: "Advanced Techniques", href: "/classes/advanced" },
    { icon: Users, label: "Intermediate Stroke", href: "/classes/intermediate" },
    { icon: Users, label: "Kids Swimming", href: "/classes/kids" },
    { icon: BarChart3, label: "Class Analytics", href: "/classes/analytics" },
  ]

  const studentClassItems = [
    { icon: BookOpen, label: "Current Courses", href: "/student/current-courses" },
    { icon: Award, label: "Completed Courses", href: "/student/completed-courses" },
    { icon: Compass, label: "Recommended", href: "/student/recommended" },
  ]

  // Select the appropriate class items based on user role
  const classItems = userRoleState === "teacher" ? teacherClassItems : studentClassItems

  // Animation variants for the sidebar
  const sidebarVariants = {
    expanded: {
      width: isMobile ? "85%" : "240px",
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    collapsed: {
      width: isMobile ? "0px" : "64px",
      x: isMobile ? "-100%" : 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  // Animation variants for the toggle button
  const toggleButtonVariants = {
    expanded: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    collapsed: {
      x: -10,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  // If mobile and sidebar is not open, render a minimal component
  if (isMobile && !isMobileSidebarOpen) {
    return null
  }

  const toggleSidebar = () => {
    dispatch(toggleMobileSidebar())
  }

  const collapseSidebar = () => {
    dispatch(setIsSidebarCollapsed(true))
    setShowClasses(false)
  }

  const expandSidebar = () => {
    dispatch(setIsSidebarCollapsed(false))
  }

  // Get display name from user object
  const getDisplayName = () => {
    if (!user) return ""
    if (user.name) return user.name
    if (user.email) {
      // Extract name from email (before @)
      const emailName = user.email.split("@")[0]
      return emailName.charAt(0).toUpperCase() + emailName.slice(1)
    }
    return "User"
  }

  // Calculate the height of fixed sections (approximate values)
  const topSectionsHeight = isMobile ? 140 : 120 // Logo + Role section + Dev toggle (if visible)
  const bottomSectionHeight = 80 // User profile section

  return (
    <>
      {/* Mobile overlay - only visible when mobile sidebar is open */}
      {isMobile && isMobileSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}

      <motion.div
        initial={false}
        animate={(isMobile && !isMobileSidebarOpen) || (!isMobile && isSidebarCollapsed) ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        className="fixed z-40 flex flex-col"
        style={{
          opacity: isLandingPage ? opacity : 1,
          transform: isLandingPage && scrollPosition < 50 && !isMobile ? "translateX(-100%)" : "none",
          backgroundColor: isDarkMode ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          height: isMobile ? "100%" : "calc(100vh - 64px)", // Adjusted height for desktop
          left: 0,
          top: isMobile ? 0 : "64px", // Position below navbar on desktop
          bottom: 0,
          boxShadow: isDarkMode ? "0 0 15px rgba(0, 0, 0, 0.2)" : "0 0 15px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className={`absolute top-4 right-4 p-2 rounded-full ${
              isDarkMode ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-800"
            }`}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}

        {/* Toggle Button - only visible on desktop */}
        {!isMobile && (
          <motion.div
            className="absolute right-0 top-20 z-50"
            initial={false}
            animate={isSidebarCollapsed ? "collapsed" : "expanded"}
            variants={toggleButtonVariants}
          >
            <motion.button
              className={`flex items-center justify-center w-6 h-24 bg-gradient-to-r 
                ${isDarkMode ? "from-slate-800 to-slate-900 text-gray-300" : "from-white to-gray-50 text-gray-600"}
                rounded-r-md shadow-md`}
              onClick={collapseSidebar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}

        {/* Collapsed State Toggle - only visible on desktop */}
        {!isMobile && isSidebarCollapsed && (
          <motion.div
            className="fixed left-0 top-20 h-24 z-50 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onMouseEnter={() => setIsHandleHovered(true)}
            onMouseLeave={() => setIsHandleHovered(false)}
          >
            <motion.button
              className={`flex items-center justify-center w-6 rounded-r-md
                ${
                  isDarkMode
                    ? "bg-gradient-to-r from-slate-800 to-slate-900 text-gray-300"
                    : "bg-gradient-to-r from-white to-gray-50 text-gray-600"
                }
                shadow-md`}
              style={{ height: isHandleHovered ? "96px" : "64px" }}
              onClick={expandSidebar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className={`h-4 w-4 ${isHandleHovered ? "text-cyan-500" : ""}`} />
            </motion.button>
          </motion.div>
        )}

        {/* Main sidebar content with improved height structure */}
        <div className="flex flex-col h-full">
          {/* Top Logo - Fixed height */}
          <div className="flex-shrink-0 flex items-center justify-center h-12 border-b border-gray-100 dark:border-gray-800">
            <AnimatePresence mode="wait">
              {(isMobile ? false : isSidebarCollapsed) ? (
                <motion.div
                  key="collapsed-logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  <GraduationCap className="h-6 w-6 text-cyan-600" />
                </motion.div>
              ) : (
                <motion.div
                  key="expanded-logo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <GraduationCap className="h-6 w-6 text-cyan-600 mr-2" />
                  <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    SeaNior
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Development Mode Toggle - only visible in development - Fixed height */}
          {process.env.NODE_ENV === "development" && (
            <div className="flex-shrink-0 flex items-center justify-center py-1 px-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                {(!isMobile && !isSidebarCollapsed) || isMobile ? (
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {userRoleState === "teacher" ? "Teacher" : "Student"}
                  </span>
                ) : null}
                <button
                  onClick={() => {
                    setUserRoleState((prev) => (prev === "teacher" ? "student" : "teacher"))
                    setDevMode((prev) => !prev)
                  }}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full ${
                    userRoleState === "teacher" ? "bg-cyan-500" : "bg-blue-500"
                  } transition-colors focus:outline-none`}
                >
                  <span className="sr-only">Toggle user role</span>
                  <span
                    className={`${
                      userRoleState === "teacher" ? "translate-x-4" : "translate-x-1"
                    } inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Role Section - Fixed height */}
          <AnimatePresence mode="wait">
            {(!isMobile && !isSidebarCollapsed) || isMobile ? (
              <motion.div
                key="expanded-role"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 flex items-center gap-3 px-4 py-2 border-b border-gray-100 dark:border-gray-800"
              >
                <div className={`bg-${userRoleState === "teacher" ? "cyan" : "blue"}-600 rounded-full p-2`}>
                  {userRoleState === "teacher" ? (
                    <GraduationCap className="h-5 w-5 text-white" />
                  ) : (
                    <BookOpen className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-wide dark:text-gray-200">
                    {userRoleState === "teacher" ? "Teacher Portal" : "Student Portal"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {userRoleState === "teacher" ? "Swimming Instructor" : "Swimming Student"}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-role"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 flex justify-center py-2 border-b border-gray-100 dark:border-gray-800"
              >
                <div className={`bg-${userRoleState === "teacher" ? "cyan" : "blue"}-600 rounded-full p-2`}>
                  {userRoleState === "teacher" ? (
                    <GraduationCap className="h-4 w-4 text-white" />
                  ) : (
                    <BookOpen className="h-4 w-4 text-white" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scrollable content area - KEY FIX: Added explicit max-height calculation */}
          <div
            className="flex-grow overflow-y-auto"
            style={{
              maxHeight: `calc(100% - ${topSectionsHeight + bottomSectionHeight}px)`,
            }}
          >
            {/* Navigation Section */}
            <div className="px-2 pt-1">
              <AnimatePresence>
                {((!isMobile && !isSidebarCollapsed) || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-1 px-2"
                  >
                    <h3 className="text-xs uppercase text-gray-500 font-medium tracking-wider">Navigation</h3>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navbar Links */}
              <nav className="space-y-0.5">
                {navItems.map((item, index) => (
                  <SidebarLink
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    collapsed={!isMobile && isSidebarCollapsed}
                    isLandingPage={isLandingPage}
                    delay={index * 0.05}
                    isMobile={isMobile}
                    onClick={isMobile ? toggleSidebar : undefined}
                  />
                ))}
              </nav>
            </div>

            {/* Classes Section */}
            <div className="px-2 pt-2">
              <AnimatePresence>
                {((!isMobile && !isSidebarCollapsed) || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between mb-1 px-2"
                  >
                    <h3 className="text-xs uppercase text-gray-500 font-medium tracking-wider">
                      {userRoleState === "teacher" ? "My Classes" : "My Learning"}
                    </h3>
                    <button
                      onClick={() => setShowClasses((prev) => !prev)}
                      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {showClasses ? (
                        <ChevronLeft className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isMobile && isSidebarCollapsed && (
                <div className="flex justify-center mb-1">
                  <button
                    onClick={() => setShowClasses((prev) => !prev)}
                    onMouseEnter={() => setIsMenuHovered(true)}
                    onMouseLeave={() => setIsMenuHovered(false)}
                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Menu className={`h-4 w-4 ${isMenuHovered ? "text-cyan-500" : "text-gray-500"}`} />
                  </button>
                </div>
              )}

              <AnimatePresence>
                {showClasses && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-0.5">
                      {classItems.map((item, index) => (
                        <SidebarLink
                          key={item.href}
                          icon={item.icon}
                          label={item.label}
                          href={item.href}
                          collapsed={!isMobile && isSidebarCollapsed}
                          isLandingPage={isLandingPage}
                          delay={0.1 + index * 0.05}
                          isSubItem
                          isMobile={isMobile}
                          onClick={isMobile ? toggleSidebar : undefined}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* User Profile Section - KEY FIX: Ensured it stays at the bottom with proper spacing */}
          <div className="flex-shrink-0 border-t border-gray-100 dark:border-gray-800 py-2 px-2 mt-auto">
            <AnimatePresence mode="wait">
              {(!isMobile && !isSidebarCollapsed) || isMobile ? (
                <motion.div
                  key="expanded-profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col px-2"
                >
                  <div className="flex items-center mb-2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                        {user && user.profile_img ? (
                          <img
                            src={user.profile_img || "/placeholder.svg"}
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
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium dark:text-white">{user?.name || "Name"}</p>
                      <p className="text-xs text-gray-500">{user?.email || "Email"}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed-profile"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                      {user && user.profile_img ? (
                        <img
                          src={user.profile_img || "/placeholder.svg"}
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
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  )
}

interface SidebarLinkProps {
  href: string
  icon: LucideIcon
  label: string
  collapsed: boolean
  isLandingPage?: boolean
  delay?: number
  isSubItem?: boolean
  isMobile?: boolean
  onClick?: () => void
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  collapsed,
  isLandingPage = false,
  delay = 0,
  isSubItem = false,
  isMobile = false,
  onClick,
}: SidebarLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname === href || pathname?.startsWith(href) || (pathname === "/" && href === "/dashboard")
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative flex items-center ${collapsed && !isMobile ? "justify-center" : "justify-start"} 
          rounded-md cursor-pointer transition-all duration-200
          ${
            isActive
              ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-600"
              : isHovered
                ? "bg-gray-100 dark:bg-gray-800"
                : "text-gray-700 dark:text-gray-300"
          }
          ${isSubItem ? "py-1" : "py-1.5"}
          ${collapsed && !isMobile ? "px-2" : "px-3"}
        `}
      >
        {isActive && (
          <motion.div
            layoutId={isMobile ? undefined : "activeIndicator"}
            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-r-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        <Icon
          className={`${collapsed && !isMobile ? "h-5 w-5" : "h-4 w-4 mr-3"} 
            ${isActive ? "text-cyan-600" : isHovered ? "text-cyan-500" : ""}
          `}
        />

        <AnimatePresence>
          {(!collapsed || isMobile) && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className={`whitespace-nowrap ${isActive ? "font-medium" : ""}`}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  )
}

export default Sidebar
