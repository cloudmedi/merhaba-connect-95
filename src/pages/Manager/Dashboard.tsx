import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export default function ManagerDashboard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);

  return (
    <DashboardLayout
      title="Manager Dashboard"
      description="Control your branch's music and view statistics"
    >
      <div className="grid gap-6">
        {/* Now Playing Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Now Playing</h2>
              <p className="text-sm text-gray-500">Current playlist: Morning Vibes</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                size="icon"
                className="bg-[#FFD700] text-black hover:bg-[#E6C200]"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Volume2 className="h-4 w-4" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="w-48"
            />
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <h3 className="font-medium text-gray-500">Active Playlists</h3>
            <p className="text-2xl font-bold mt-2">5</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-medium text-gray-500">Total Songs</h3>
            <p className="text-2xl font-bold mt-2">248</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-medium text-gray-500">Connected Devices</h3>
            <p className="text-2xl font-bold mt-2">3</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">Playlist Changed</p>
                  <p className="text-sm text-gray-500">Evening Chill playlist activated</p>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}