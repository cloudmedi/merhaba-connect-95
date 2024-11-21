import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Announcements from "./Announcements";
import Devices from "./Devices";
import Schedule from "./Schedule";
import Categories from "./Categories";

export default function Manager() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/announcements/*" element={<Announcements />} />
      <Route path="/devices/*" element={<Devices />} />
      <Route path="/schedule/*" element={<Schedule />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}