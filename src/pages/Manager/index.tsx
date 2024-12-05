import { Routes, Route } from "react-router-dom";
import { ManagerHeader } from "@/components/ManagerHeader";
import ManagerDashboard from "./Dashboard";
import { PlaylistDetail } from "./Playlists/PlaylistDetail";
import { CategoryPlaylists } from "./Playlists/CategoryPlaylists";
import Playlists from "./Playlists";
import Devices from "./Devices";
import Schedule from "./Schedule";
import Announcements from "./Announcements";
import Settings from "./Settings";
import ProfileSettings from "./Settings/Profile";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivities } from "@/components/dashboard/RecentActivities";

export default function Manager() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col h-screen">
        <ManagerHeader />
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Main Content */}
          <ResizablePanel defaultSize={80} minSize={70}>
            <main className="overflow-auto px-4 md:px-8 py-6">
              <div className="max-w-[1400px] mx-auto w-full">
                <Routes>
                  <Route path="/" element={<ManagerDashboard />} />
                  <Route path="/playlists" element={<Playlists />} />
                  <Route path="/playlists/category/:categoryId" element={<CategoryPlaylists />} />
                  <Route path="/playlists/:id" element={<PlaylistDetail />} />
                  <Route path="/devices" element={<Devices />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/settings/profile" element={<ProfileSettings />} />
                </Routes>
              </div>
            </main>
          </ResizablePanel>

          {/* Resize Handle */}
          <ResizableHandle withHandle />

          {/* Right Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                <Card className="p-4">
                  <QuickActions />
                </Card>
                <Card className="p-4">
                  <RecentActivities />
                </Card>
              </div>
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}