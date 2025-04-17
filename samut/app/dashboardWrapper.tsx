"use client";

import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import StoreProvider, { useAppSelector } from './redux';
import { usePathname } from 'next/navigation';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const pathname = usePathname();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className='flex min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-dark-bg'>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 flex h-full transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
      }`}>
        <Sidebar />
      </div>

      {/* Main content */}
      <main className={`flex w-full flex-col transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'pl-0' : 'pl-64'
      } bg-gray-50 dark:bg-dark-bg`}>
        <Navbar pathname={pathname} />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;
