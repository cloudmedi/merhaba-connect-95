import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ListMusic, Calendar, Settings, Activity } from "lucide-react";

export default function Manager() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Branch Manager Dashboard</h1>
        <p className="text-muted-foreground">Manage your branch music system</p>
      </div>

      <Tabs defaultValue="playlists" className="space-y-4">
        <TabsList>
          <TabsTrigger value="playlists" className="flex items-center gap-2">
            <ListMusic className="h-4 w-4" />
            Branch Playlists
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="player" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Player Status
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="playlists">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Branch Playlists</h2>
            {/* Branch playlist management will be implemented here */}
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Music Schedule</h2>
            {/* Schedule management will be implemented here */}
          </Card>
        </TabsContent>

        <TabsContent value="player">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Player Status</h2>
            {/* Player status monitoring will be implemented here */}
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Branch Settings</h2>
            {/* Branch settings will be implemented here */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}