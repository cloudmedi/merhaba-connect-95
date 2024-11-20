import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import SuperAdmin from "./pages/SuperAdmin";
import Player from "./pages/Player";
import SuperAdminLogin from "./pages/SuperAdmin/Auth/Login";
import Manager from "./pages/Manager";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Super Admin Routes */}
            <Route path="/super-admin/login" element={<SuperAdminLogin />} />
            <Route path="/super-admin/*" element={<SuperAdmin />} />
            
            {/* Manager Routes */}
            <Route path="/manager/*" element={<Manager />} />
            
            {/* Player Routes */}
            <Route path="/player/*" element={<Player />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}