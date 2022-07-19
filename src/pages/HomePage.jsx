import { useEffect } from "react";
import { useMenu } from "../hooks/useMenu";

const HomePage = () => {
  const { setMenuActive } = useMenu();
  useEffect(() => {
    setMenuActive("home");
  }, []);
  return (
    <div className="flex flex-col gap-5 h-screen items-center justify-center">
      <h1 className="font-bold text-6xl text-center">Sistema de consulta</h1>
      <h1 className="font-bold text-6xl text-center">Plan Mujer Bolivariana</h1>
    </div>
  );
};

export default HomePage;
