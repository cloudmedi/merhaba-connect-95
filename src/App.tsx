import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index";
import Manager from "./pages/Manager";
import SuperAdmin from "./pages/SuperAdmin";
import ManagerLogin from "./pages/Manager/Auth/Login";
import ManagerRegister from "./pages/Manager/Auth/Register";
import SuperAdminLogin from "./pages/SuperAdmin/Auth/Login";
import SuperAdminRegister from "./pages/SuperAdmin/Auth/Register";
import { AuthProvider as ManagerAuthProvider } from "@/contexts/ManagerAuthContext";
import { AuthProvider as SuperAdminAuthProvider } from "@/contexts/SuperAdminAuthContext";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Manager routes with ManagerAuthProvider */}
        <Route element={<ManagerAuthProvider>
          <Routes>
            <Route path="/manager/login" element={<ManagerLogin />} />
            <Route path="/manager/register" element={<ManagerRegister />} />
            <Route path="/manager/*" element={<Manager />} />
          </Routes>
        </ManagerAuthProvider>} />

        {/* Super Admin routes with SuperAdminAuthProvider */}
        <Route element={<SuperAdminAuthProvider>
          <Routes>
            <Route path="/super-admin/login" element={<SuperAdminLogin />} />
            <Route path="/super-admin/register" element={<SuperAdminRegister />} />
            <Route path="/super-admin/*" element={<SuperAdmin />} />
          </Routes>
        </SuperAdminAuthProvider>} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;