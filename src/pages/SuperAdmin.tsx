import { Routes, Route } from "react-router-dom";
import { AdminNav } from "@/components/AdminNav";
import Dashboard from "./SuperAdmin/Dashboard";
import Users from "./SuperAdmin/Users";
import Playlists from "./SuperAdmin/Playlists";
import Music from "./SuperAdmin/Music";
import Categories from "./SuperAdmin/Categories";
import Moods from "./SuperAdmin/Moods";
import Genres from "./SuperAdmin/Genres";
import Settings from "./SuperAdmin/Settings";
import Reports from "./SuperAdmin/Reports";
import Notifications from "./SuperAdmin/Notifications";
import Performance from "./SuperAdmin/Performance";
import { CreatePlaylist } from "@/components/playlists/CreatePlaylist";

export default function SuperAdmin() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <AdminNav />
      <main className="flex-1 overflow-auto w-full md:w-[calc(100%-16rem)] ml-0 md:ml-64 pt-16 md:pt-0">
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="playlists" element={<Playlists />} />
              <Route path="playlists/create" element={<CreatePlaylist />} />
              <Route path="music" element={<Music />} />
              <Route path="genres" element={<Genres />} />
              <Route path="categories" element={<Categories />} />
              <Route path="moods" element={<Moods />} />
              <Route path="notifications/*" element={<Notifications />} />
              <Route path="settings/*" element={<Settings />} />
              <Route path="reports" element={<Reports />} />
              <Route path="performance" element={<Performance />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}