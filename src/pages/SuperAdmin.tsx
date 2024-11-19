import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Music, Users, ListMusic, BarChart3 } from "lucide-react";

export default function SuperAdmin() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your music business centrally</p>
      </div>

      <Tabs defaultValue="music" className="space-y-4">
        <TabsList>
          <TabsTrigger value="music" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Music Library
          </TabsTrigger>
          <TabsTrigger value="playlists" className="flex items-center gap-2">
            <ListMusic className="h-4 w-4" />
            Playlists
          </TabsTrigger>
          <TabsTrigger value="branches" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Branches
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="music">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Music Library</h2>
            {/* Music library management will be implemented here */}
          </Card>
        </TabsContent>

        <TabsContent value="playlists">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Playlists Management</h2>
            {/* Playlist management will be implemented here */}
          </Card>
        </TabsContent>

        <TabsContent value="branches">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Branch Management</h2>
            {/* Branch management will be implemented here */}
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Analytics Dashboard</h2>
            {/* Analytics dashboard will be implemented here */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}