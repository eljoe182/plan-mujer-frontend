import { useContext } from "react";
import { MainContext } from "../context/MainProviderContext";

export const useMenu = () => {
  const { menuActive, setMenuActive } = useContext(MainContext);
  return {
    menuActive,
    setMenuActive,
  };
};
