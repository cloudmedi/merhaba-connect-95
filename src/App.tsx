import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import SuperAdmin from "./pages/SuperAdmin";
import Manager from "./pages/Manager";
import Player from "./pages/Player";
import SuperAdminLogin from "./pages/SuperAdmin/Auth/Login";
import ManagerLogin from "./pages/Manager/Auth/Login";
import ManagerRegister from "./pages/Manager/Auth/Register";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Index />} />
            
            {/* Super Admin Routes */}
            <Route path="/super-admin/login" element={<SuperAdminLogin />} />
            <Route path="/super-admin/*" element={<SuperAdmin />} />
            
            {/* Manager Routes */}
            <Route path="/manager/login" element={<ManagerLogin />} />
            <Route path="/manager/register" element={<ManagerRegister />} />
            <Route path="/manager/*" element={<Manager />} />
            
            {/* Player Routes */}
            <Route path="/player/*" element={<Player />} />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}