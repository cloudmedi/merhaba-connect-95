import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import ManagerDashboard from "./Manager/Dashboard";
import ManagerMedia from "./Manager/Media";
import ManagerAnnouncements from "./Manager/Announcements";
import ManagerSchedule from "./Manager/Schedule";
import ManagerBranches from "./Manager/Branches";
import ManagerDevices from "./Manager/Devices";
import ManagerReports from "./Manager/Reports";
import ManagerActivities from "./Manager/Activities";
import ManagerSettings from "./Manager/Settings";

export default function Manager() {
  return (
    <Routes>
      <Route path="/" element={<ManagerDashboard />} />
      <Route path="/media/*" element={<ManagerMedia />} />
      <Route path="/announcements/*" element={<ManagerAnnouncements />} />
      <Route path="/schedule/*" element={<ManagerSchedule />} />
      <Route path="/branches/*" element={<ManagerBranches />} />
      <Route path="/devices/*" element={<ManagerDevices />} />
      <Route path="/reports/*" element={<ManagerReports />} />
      <Route path="/activities/*" element={<ManagerActivities />} />
      <Route path="/settings/*" element={<ManagerSettings />} />
    </Routes>
  );
}