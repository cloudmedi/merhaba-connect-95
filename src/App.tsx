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
        
        {/* Manager routes */}
        <Route path="/manager" element={<ManagerAuthProvider><Manager /></ManagerAuthProvider>} />
        <Route path="/manager/login" element={<ManagerAuthProvider><ManagerLogin /></ManagerAuthProvider>} />
        <Route path="/manager/register" element={<ManagerAuthProvider><ManagerRegister /></ManagerAuthProvider>} />

        {/* Super Admin routes */}
        <Route path="/super-admin" element={<SuperAdminAuthProvider><SuperAdmin /></SuperAdminAuthProvider>} />
        <Route path="/super-admin/login" element={<SuperAdminAuthProvider><SuperAdminLogin /></SuperAdminAuthProvider>} />
        <Route path="/super-admin/register" element={<SuperAdminAuthProvider><SuperAdminRegister /></SuperAdminAuthProvider>} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;