import React from "react";
import { Outlet } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import { Toaster } from "react-hot-toast";

const MainLayout = () => {
  return (
    <div className="bg-neutral-100 min-h-screen">
      <Toaster />
      <HeaderComponent />
      <div className="mx-20">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
