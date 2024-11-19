import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { useState } from "react";

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Branch Music Player</h1>
        <p className="text-muted-foreground">Currently playing from branch playlist</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Current Track</h2>
              <p className="text-muted-foreground">Track Name - Artist</p>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="icon">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="icon">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                />
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Next: Upcoming Track - Artist</p>
              <p>Playing from: Morning Playlist</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}