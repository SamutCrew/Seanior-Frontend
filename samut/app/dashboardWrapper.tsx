// dashboardWrapper.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import { LayoutType } from "@/app/types/layout";
import { useAuth } from "@/app/context/AuthContext";
import LoadingPage from "./components/common/LoadingPage";

interface DashboardLayoutProps {
  children: React.ReactNode;
  layoutType?: LayoutType;
}

const DashboardLayout = ({
  children,
  layoutType = LayoutType.App,
}: DashboardLayoutProps) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  if (layoutType === LayoutType.Guest) {
    return (
      <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-dark-bg">
        <main className="flex w-full flex-col bg-gray-50 dark:bg-dark-bg">
          <Navbar />
          {children}
        </main>
      </div>
    );
  }

  if (layoutType === LayoutType.Auth) {
    return (
      <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-dark-bg">
        <main className="flex w-full flex-col">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar />
      <main
        className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${
          isSidebarCollapsed ? "" : "md:pl-64"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

interface DashboardWrapperProps {
  children: React.ReactNode;
  layoutType?: LayoutType;
}

const DashboardWrapper = ({
  children,
  layoutType = LayoutType.App,
}: DashboardWrapperProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = () => {
      // Only redirect if not loading and user exists for Auth layout
      if (!loading && user && layoutType === LayoutType.Auth) {
        router.push("/");
      }
    };

    handleRedirect();
  }, [user, loading, layoutType, router]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <StoreProvider>
      <DashboardLayout layoutType={layoutType}>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;