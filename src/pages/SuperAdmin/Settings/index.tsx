import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SettingsNav } from "./components/SettingsNav";
import { AppSettings } from "./components/AppSettings";
import { CompanySettings } from "./components/CompanySettings";
import { LocalizationSettings } from "./components/LocalizationSettings";
import { BillingSettings } from "./components/BillingSettings";
import { EmailSettings } from "./components/EmailSettings";
import { SecuritySettings } from "./components/SecuritySettings";
import { NotificationSettings } from "./components/NotificationSettings";
import { ApiKeys } from "./components/ApiKeys";
import { SystemLogs } from "./components/SystemLogs";

export default function Settings() {
  return (
    <DashboardLayout
      title="System Settings"
      description="Manage all aspects of your music business platform"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3">
          <SettingsNav />
        </div>
        <div className="md:col-span-9">
          <Routes>
            <Route index element={<AppSettings />} />
            <Route path="company" element={<CompanySettings />} />
            <Route path="localization" element={<LocalizationSettings />} />
            <Route path="billing" element={<BillingSettings />} />
            <Route path="email" element={<EmailSettings />} />
            <Route path="security" element={<SecuritySettings />} />
            <Route path="notifications" element={<NotificationSettings />} />
            <Route path="api-keys" element={<ApiKeys />} />
            <Route path="logs" element={<SystemLogs />} />
          </Routes>
        </div>
      </div>
    </DashboardLayout>
  );
}