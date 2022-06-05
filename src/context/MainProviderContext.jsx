import { createContext, useState } from "react";

export const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [menuActive, setMenuActive] = useState("");
  return (
    <MainContext.Provider
      value={{
        menuActive,
        setMenuActive,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
