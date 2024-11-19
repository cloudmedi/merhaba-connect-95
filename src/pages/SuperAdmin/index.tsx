import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Users from "./Users";
import Music from "./Music";
import Genres from "./Genres";
import Categories from "./Categories";
import Moods from "./Moods";
import Playlists from "./Playlists";
import Notifications from "./Notifications";
import Reports from "./Reports";
import Settings from "./Settings";
import { AdminNav } from "@/components/AdminNav";

export default function SuperAdmin() {
  return (
    <div className="flex">
      <AdminNav />
      <main className="flex-1 p-8">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="users/*" element={<Users />} />
          <Route path="music/*" element={<Music />} />
          <Route path="genres/*" element={<Genres />} />
          <Route path="categories/*" element={<Categories />} />
          <Route path="moods/*" element={<Moods />} />
          <Route path="playlists/*" element={<Playlists />} />
          <Route path="notifications/*" element={<Notifications />} />
          <Route path="reports/*" element={<Reports />} />
          <Route path="settings/*" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}