"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  MessageCircle,
  Settings,
  User,
  Users,
  FileText,
  BookOpen,
  Database,
  Menu,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed, toggleMobileSidebar } from "@/state";
import type { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface AdminSidebarProps {
  isLandingPage?: boolean;
  scrollPosition?: number;
}

const AdminSidebar = ({ isLandingPage = false, scrollPosition = 0 }: AdminSidebarProps) => {
  const { user, logOut } = useAuth();

  const [showAdminSections, setShowAdminSections] = useState(true);
  const [isHandleHovered, setIsHandleHovered] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isMobileSidebarOpen = useAppSelector((state) => state.global.isMobileSidebarOpen);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Check if we're on an auth page
  const isAuthPage = pathname.startsWith("/auth/");
  if (isAuthPage) {
    return null;
  }

  // Track window resize
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
        // Auto-collapse sidebar on small screens
        if (window.innerWidth < 768 && !isSidebarCollapsed) {
          dispatch(setIsSidebarCollapsed(true));
        }
      }, 100); // Debounce the resize event
    };

    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      handleResize();

      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(timeoutId);
      };
    }

    return () => clearTimeout(timeoutId);
  }, [dispatch, isSidebarCollapsed]);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Add this constant to determine if we're at the top of the page
  const isAtTop = scrollPosition < 50 && isLandingPage;

  // Calculate opacity based on scroll position for a smoother transition
  const opacity = isLandingPage ? Math.min(scrollPosition / 50, 1) : 1;

  // Hide sidebar completely on landing page when at the top
  if (isLandingPage && scrollPosition === 0) {
    return null;
  }

  // Determine if we should show the mobile sidebar
  const isMobile = windowWidth < 768;
  const showMobileSidebar = isMobile && isMobileSidebarOpen;
  const showDesktopSidebar = !isMobile || (isMobile && isMobileSidebarOpen);

  // Define navigation items for admin
  const adminNavItems = [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
    { icon: FileText, label: "Instructor Requests", href: "/admin/instructor-request" },
    { icon: User, label: "Teachers", href: "/admin/teacher" },
    { icon: BookOpen, label: "Courses", href: "/admin/course" },
    { icon: Users, label: "Users", href: "/admin/user" },
    { icon: Database, label: "Resources", href: "/admin/resource" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
    { icon: MessageCircle, label: "Support", href: "/admin/support" },
  ];

  // Animation variants for the sidebar
  const sidebarVariants = {
    expanded: {
      width: isMobile ? "85%" : "240px",
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    collapsed: {
      width: isMobile ? "0px" : "64px",
      x: isMobile ? "-100%" : 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  // Animation variants for the toggle button
  const toggleButtonVariants = {
    expanded: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    collapsed: {
      x: -10,
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  // If mobile and sidebar is not open, render a minimal component
  if (isMobile && !isMobileSidebarOpen) {
    return null;
  }

  const toggleSidebar = () => {
    dispatch(toggleMobileSidebar());
  };

  const collapseSidebar = () => {
    dispatch(setIsSidebarCollapsed(true));
    setShowAdminSections(false);
  };

  const expandSidebar = () => {
    dispatch(setIsSidebarCollapsed(false));
  };

  // Get display name from user object
  const getDisplayName = () => {
    if (!user) return "";
    if (user.name) return user.name;
    if (user.email) {
      const emailName = user.email.split("@")[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return "Admin";
  };

  // Calculate the height of fixed sections
  const topSectionsHeight = isMobile ? 140 : 120; // Logo + Role section
  const bottomSectionHeight = 80; // User profile section

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
          height: isMobile ? "100%" : "calc(100vh - 64px)",
          left: 0,
          top: isMobile ? 0 : "64px",
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
              <ChevronRight className={`h-4 w-4 ${isHandleHovered ? "text-purple-500" : ""}`} />
            </motion.button>
          </motion.div>
        )}

        {/* Main sidebar content */}
        <div className="flex flex-col h-full">
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
                <div>
                  <h2 className="text-sm font-bold tracking-wide dark:text-gray-200">Admin Portal</h2>
                  <p className="text-xs text-gray-500">System Administrator</p>
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
                <div className="bg-purple-600 rounded-full p-2">
                  <User className="h-4 w-4 text-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scrollable content area */}
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
                    <h3 className="text-xs uppercase text-gray-500 font-medium tracking-wider">Admin Menu</h3>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navbar Links */}
              <nav className="space-y-0.5">
                {adminNavItems.map((item, index) => (
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
          </div>

          {/* User Profile Section */}
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
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
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
                                  ? "bg-purple-600 text-white"
                                  : "bg-purple-100 text-purple-600"
                            }`}
                          >
                            {getDisplayName().charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium dark:text-white">{user?.name || "Admin"}</p>
                      <p className="text-xs text-gray-500">{user?.email || "admin@example.com"}</p>
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
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
                                ? "bg-purple-600 text-white"
                                : "bg-purple-100 text-purple-600"
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
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  isLandingPage?: boolean;
  delay?: number;
  isSubItem?: boolean;
  isMobile?: boolean;
  onClick?: () => void;
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
  const pathname = usePathname();
  const isActive =
    pathname === href || pathname?.startsWith(href) || (pathname === "/" && href === "/admin/dashboard");
  const [isHovered, setIsHovered] = useState(false);

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
              ? "bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-600"
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
            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-r-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        <Icon
          className={`${collapsed && !isMobile ? "h-5 w-5" : "h-4 w-4 mr-3"} 
            ${isActive ? "text-purple-600" : isHovered ? "text-purple-500" : ""}`}
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
  );
};

export default AdminSidebar;