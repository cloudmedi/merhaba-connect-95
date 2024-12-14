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
    <ManagerAuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Manager routes */}
        <Route path="/manager/login" element={<ManagerLogin />} />
        <Route path="/manager/register" element={<ManagerRegister />} />
        <Route path="/manager/*" element={<Manager />} />

        {/* Super Admin routes */}
        <Route path="/super-admin/*" element={
          <SuperAdminAuthProvider>
            <Routes>
              <Route path="/login" element={<SuperAdminLogin />} />
              <Route path="/register" element={<SuperAdminRegister />} />
              <Route path="/*" element={<SuperAdmin />} />
            </Routes>
          </SuperAdminAuthProvider>
        } />
      </Routes>
      <Toaster />
    </ManagerAuthProvider>
  );
}

export default App;