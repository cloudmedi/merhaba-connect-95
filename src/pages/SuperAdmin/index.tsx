import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/SuperAdminAuthContext";
import Dashboard from "./Dashboard";
import Settings from "./Settings";

export default function SuperAdmin() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/super-admin/login" replace />;
  }

  if (user.role !== 'super_admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="settings/*" element={<Settings />} />
    </Routes>
  );
}