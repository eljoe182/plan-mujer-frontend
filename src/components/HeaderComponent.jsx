import React from "react";
import { Link } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";

const HeaderComponent = () => {
  const { menuActive, setMenuActive } = useMenu();
  return (
    <div className="bg-green-500 px-20 flex flex-row items-center">
      <h1 className="font-bold text-white text-2xl">Nomina</h1>
      <nav className="ml-20 flex text-white font-semibold">
        <Link
          className={`${
            menuActive === "home" ? "bg-black/30" : ""
          } hover:bg-black/20 p-5`}
          to="/"
          onClick={() => {
            setMenuActive("home");
          }}
        >
          Home
        </Link>
        <Link
          className={`${
            menuActive === "show" ? "bg-black/30" : ""
          } hover:bg-black/20 p-5`}
          to="/find_person"
          onClick={() => {
            setMenuActive("show");
          }}
        >
          Buscar
        </Link>
      </nav>
    </div>
  );
};

export default HeaderComponent;
