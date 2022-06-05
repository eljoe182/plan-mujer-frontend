import React from "react";
import { Outlet } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";

const MainLayout = () => {
  return (
    <div className="bg-neutral-100 min-h-screen">
      <HeaderComponent />
      <div className="mx-20">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
