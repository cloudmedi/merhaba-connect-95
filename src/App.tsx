import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import SuperAdmin from "./pages/SuperAdmin";
import SuperAdminLogin from "./pages/SuperAdmin/Auth/Login";
import SuperAdminRegister from "./pages/SuperAdmin/Auth/Register";
import Manager from "./pages/Manager";
import ManagerRegister from "./pages/Manager/Auth/Register";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Super Admin Routes */}
              <Route path="/super-admin/login" element={<SuperAdminLogin />} />
              <Route path="/super-admin/register" element={<SuperAdminRegister />} />
              <Route path="/super-admin/*" element={<SuperAdmin />} />
              
              {/* Manager Routes */}
              <Route path="/manager/register" element={<ManagerRegister />} />
              <Route path="/manager/*" element={<Manager />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}