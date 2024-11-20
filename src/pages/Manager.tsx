import { Routes, Route } from "react-router-dom";
import { ManagerNav } from "@/components/ManagerNav";
import Dashboard from "./Manager/Dashboard";
import Media from "./Manager/Media";
import Announcements from "./Manager/Announcements";
import Schedule from "./Manager/Schedule";
import Branches from "./Manager/Branches";
import Devices from "./Manager/Devices";
import Reports from "./Manager/Reports";
import Activities from "./Manager/Activities";
import Settings from "./Manager/Settings";

export default function Manager() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <ManagerNav />
      <main className="flex-1 overflow-auto w-full md:w-[calc(100%-16rem)] ml-0 md:ml-64 pt-16 md:pt-0">
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="media/*" element={<Media />} />
              <Route path="announcements/*" element={<Announcements />} />
              <Route path="schedule/*" element={<Schedule />} />
              <Route path="branches/*" element={<Branches />} />
              <Route path="devices/*" element={<Devices />} />
              <Route path="reports/*" element={<Reports />} />
              <Route path="activities/*" element={<Activities />} />
              <Route path="settings/*" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}