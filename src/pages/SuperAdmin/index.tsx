import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Users from "./Users";
import Music from "./Music";
import Genres from "./Genres";
import Categories from "./Categories";
import Moods from "./Moods";
import Playlists from "./Playlists";
import { PlaylistDetail } from "./Playlists/PlaylistDetail";
import Notifications from "./Notifications";
import Reports from "./Reports";
import Settings from "./Settings";
import Performance from "./Performance";
import { AdminNav } from "@/components/AdminNav";

export default function SuperAdmin() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <AdminNav />
      <main className="flex-1 overflow-auto w-full md:w-[calc(100%-16rem)] ml-0 md:ml-64 pt-16 md:pt-0">
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="users/*" element={<Users />} />
              <Route path="music/*" element={<Music />} />
              <Route path="genres/*" element={<Genres />} />
              <Route path="categories/*" element={<Categories />} />
              <Route path="moods/*" element={<Moods />} />
              <Route path="playlists" element={<Playlists />} />
              <Route path="playlists/:id" element={<PlaylistDetail />} />
              <Route path="notifications/*" element={<Notifications />} />
              <Route path="performance/*" element={<Performance />} />
              <Route path="reports/*" element={<Reports />} />
              <Route path="settings/*" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}