import React from "react";
import Navbar from "@/app/components/Navbar/index";

const GuestLayout = ({
  children,
  showHeader = true,
}: {
  children: React.ReactNode,
  showHeader?: boolean,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && <Navbar />}
      <main className="flex-grow bg-white">{children}</main>
    </div>
  );
};

export default GuestLayout;
