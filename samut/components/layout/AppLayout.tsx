/**
 * @file AppLayout.tsx
 * @description This component represents the layout of the application. It displays a header, sidebar, and footer.
 * @author Awirut Phuseansaart <awirut2629@gmail.com>
 * @date 2024-06-24
 * @version 1.0
 */

import React, { ReactNode, useState } from "react";
import Navbar from "@/app/components/Navbar/index";
import SideBar from "@/app/components/Sidebar/index";
const AppLayout = ({
  children,
  showSidebar = true,
}: {
  children: React.ReactNode;
  showSidebar?: boolean;
}) => {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 pt-2">
        {showSidebar && <SideBar />}
        <div className={`flex-1 p-1 overflow-y-auto mt-[60px] ml-[200px]`}>
          {children}
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default AppLayout;
