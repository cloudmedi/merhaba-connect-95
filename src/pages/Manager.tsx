import { Routes, Route } from "react-router-dom";
import ManagerDashboard from "./Manager/Dashboard";
import ManagerPlaylists from "./Manager/Playlists";
import ManagerDevices from "./Manager/Devices";
import ManagerSchedule from "./Manager/Schedule";
import ManagerReports from "./Manager/Reports";
import ManagerSettings from "./Manager/Settings";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function Manager() {
  return (
    <Routes>
      <Route path="/" element={<ManagerDashboard />} />
      <Route path="/playlists/*" element={<ManagerPlaylists />} />
      <Route path="/devices/*" element={<ManagerDevices />} />
      <Route path="/schedule/*" element={<ManagerSchedule />} />
      <Route path="/reports/*" element={<ManagerReports />} />
      <Route path="/settings/*" element={<ManagerSettings />} />
    </Routes>
  );
}