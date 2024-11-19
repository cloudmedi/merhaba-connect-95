import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SettingsNav } from "./components/SettingsNav";
import { AppSettings } from "./components/AppSettings";
import { ApiKeys } from "./components/ApiKeys";
import { SystemLogs } from "./components/SystemLogs";

export default function Settings() {
  return (
    <DashboardLayout
      title="System Settings"
      description="Manage application settings, API keys, and system logs"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3">
          <SettingsNav />
        </div>
        <div className="md:col-span-9">
          <Routes>
            <Route index element={<AppSettings />} />
            <Route path="api-keys" element={<ApiKeys />} />
            <Route path="logs" element={<SystemLogs />} />
          </Routes>
        </div>
      </div>
    </DashboardLayout>
  );
}