import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivePlaylistsReport } from "./components/ActivePlaylistsReport";
import { PlaylistHistoryReport } from "./components/PlaylistHistoryReport";
import { ManagerActivityReport } from "./components/ManagerActivityReport";
import { SystemHealthReport } from "./components/SystemHealthReport";

export default function Reports() {
  return (
    <DashboardLayout
      title="System Reports"
      description="Detailed system health, player status, and activity reports"
    >
      <Tabs defaultValue="system-health" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-4">
          <TabsTrigger value="system-health">System Health</TabsTrigger>
          <TabsTrigger value="active-playlists">Active Playlists</TabsTrigger>
          <TabsTrigger value="playlist-history">Playlist History</TabsTrigger>
          <TabsTrigger value="manager-activity">Manager Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="system-health">
          <SystemHealthReport />
        </TabsContent>

        <TabsContent value="active-playlists">
          <ActivePlaylistsReport />
        </TabsContent>

        <TabsContent value="playlist-history">
          <PlaylistHistoryReport />
        </TabsContent>

        <TabsContent value="manager-activity">
          <ManagerActivityReport />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}