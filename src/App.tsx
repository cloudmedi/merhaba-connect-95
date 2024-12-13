import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index";
import Manager from "./pages/Manager";
import SuperAdmin from "./pages/SuperAdmin";
import ManagerLogin from "./pages/Manager/Auth/Login";
import ManagerRegister from "./pages/Manager/Auth/Register";
import SuperAdminLogin from "./pages/SuperAdmin/Auth/Login";
import SuperAdminRegister from "./pages/SuperAdmin/Auth/Register";
import { ManagerAuthProvider } from "@/contexts/ManagerAuthContext";
import { SuperAdminAuthProvider } from "@/contexts/SuperAdminAuthContext";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Manager routes */}
        <Route path="/manager/*" element={
          <ManagerAuthProvider>
            <Routes>
              <Route path="/" element={<Manager />} />
              <Route path="/login" element={<ManagerLogin />} />
              <Route path="/register" element={<ManagerRegister />} />
            </Routes>
          </ManagerAuthProvider>
        } />

        {/* Super Admin routes */}
        <Route path="/super-admin/*" element={
          <SuperAdminAuthProvider>
            <Routes>
              <Route path="/" element={<SuperAdmin />} />
              <Route path="/login" element={<SuperAdminLogin />} />
              <Route path="/register" element={<SuperAdminRegister />} />
            </Routes>
          </SuperAdminAuthProvider>
        } />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;