import { Routes, Route } from "react-router-dom";
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
  );
}