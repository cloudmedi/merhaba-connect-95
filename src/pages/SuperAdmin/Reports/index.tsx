import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivePlaylistsReport } from "./components/ActivePlaylistsReport";
import { PlaylistHistoryReport } from "./components/PlaylistHistoryReport";
import { ManagerActivityReport } from "./components/ManagerActivityReport";

export default function Reports() {
  return (
    <DashboardLayout
      title="Reports"
      description="View store playlists and manager activity reports"
    >
      <Tabs defaultValue="active-playlists" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active-playlists">Active Playlists</TabsTrigger>
          <TabsTrigger value="playlist-history">Playlist History</TabsTrigger>
          <TabsTrigger value="manager-activity">Manager Activity</TabsTrigger>
        </TabsList>

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