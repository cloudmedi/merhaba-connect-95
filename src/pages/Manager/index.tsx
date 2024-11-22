import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "./Dashboard";
import Devices from "./Devices";
import Playlists from "./Playlists";
import Schedule from "./Schedule";
import Announcements from "./Announcements";

export default function Manager() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const managerView = localStorage.getItem('managerView');
      const superAdminSession = localStorage.getItem('superAdminSession');

      if (!session && !managerView) {
        navigate('/manager/login');
        return;
      }

      // If we're in manager view mode (switched from super admin)
      if (managerView && superAdminSession) {
        const managerData = JSON.parse(managerView);
        const superAdmin = JSON.parse(superAdminSession);

        // Verify the super admin session is still valid
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession || currentSession.access_token !== superAdmin.token) {
          localStorage.removeItem('managerView');
          localStorage.removeItem('superAdminSession');
          navigate('/super-admin/login');
          toast.error('Super admin session expired');
          return;
        }
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="devices/*" element={<Devices />} />
      <Route path="playlists/*" element={<Playlists />} />
      <Route path="schedule/*" element={<Schedule />} />
      <Route path="announcements/*" element={<Announcements />} />
      <Route path="*" element={<Navigate to="/manager" replace />} />
    </Routes>
  );
}