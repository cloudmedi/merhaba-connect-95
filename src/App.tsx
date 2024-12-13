import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Manager from "./pages/Manager";
import SuperAdmin from "./pages/SuperAdmin";
import ManagerLogin from "./pages/Manager/Auth/Login";
import ManagerRegister from "./pages/Manager/Auth/Register";
import SuperAdminLogin from "./pages/SuperAdmin/Auth/Login";
import SuperAdminRegister from "./pages/SuperAdmin/Auth/Register";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/manager/login" element={<ManagerLogin />} />
        <Route path="/manager/register" element={<ManagerRegister />} />
        <Route path="/manager/*" element={<Manager />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route path="/super-admin/register" element={<SuperAdminRegister />} />
        <Route path="/super-admin/*" element={<SuperAdmin />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;