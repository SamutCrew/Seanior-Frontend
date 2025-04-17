"use client";

import HomePage from "./Home/page";
import { useAuth } from "@/app/context/AuthContext";
import Login from "@/app/auth/Login/page";
import withLayout from "@/app/hocs/WithLayout";
import { LayoutType } from "@/app/types/layout";

const Home = () => {
  const { user, logOut } = useAuth();
  
  return (
    <div className="flex min-h-screen flex-col item-center justify-between p-24 dark:bg-black dark:text-white">
      <HomePage />;
    </div>
  );
}

export default withLayout(Home, LayoutType.App);
