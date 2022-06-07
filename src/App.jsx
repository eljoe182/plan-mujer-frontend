import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainProvider } from "./context/MainProviderContext";
import MainLayout from "./layouts/MainLayout";
import CreatePayrollPage from "./pages/CreatePayrollPage";
import HomePage from "./pages/HomePage";
import ShowPersonPage from "./pages/ShowPersonPage";
import CitaPage from "./pages/CitaPage";
function App() {
  return (
    <MainProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="create_payroll" element={<CreatePayrollPage />} />
            <Route path="find_person" element={<ShowPersonPage />} />
            <Route path="cita" element={<CitaPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MainProvider>
  );
}

export default App;
