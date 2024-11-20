import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState(33);

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Branch Music Player</h1>
        <p className="text-gray-400 mb-8">Currently playing from branch playlist</p>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Current Track</h2>
            <p className="text-gray-600">Track Name - Artist</p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full w-12 h-12"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button 
              size="icon"
              className="rounded-full w-12 h-12 bg-[#1A1F2C] hover:bg-[#2A2F3C] text-white"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-1" />
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full w-12 h-12"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            <Progress value={progress} className="h-1" />
            
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-gray-500" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>
          </div>

          <div className="mt-8 text-center space-y-1">
            <p className="text-gray-600">Next: Upcoming Track - Artist</p>
            <p className="text-gray-500">Playing from: Morning Playlist</p>
          </div>
        </div>
      </div>
    </div>
  );
}