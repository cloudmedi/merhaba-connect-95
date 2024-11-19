import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Music } from "lucide-react";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
}

interface SongsTabProps {
  selectedSongs: Song[];
  onAddSong: (song: Song) => void;
  onRemoveSong: (songId: number) => void;
}

export function SongsTab({ selectedSongs, onAddSong, onRemoveSong }: SongsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock available songs data
  const availableSongs: Song[] = [
    { id: 1, title: "Summer Vibes", artist: "John Doe", duration: "3:45" },
    { id: 2, title: "Chill Beats", artist: "Jane Smith", duration: "4:20" },
  ];

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search songs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium mb-2">Available Songs</h3>
          <div className="border rounded-lg divide-y">
            {availableSongs.map(song => (
              <div key={song.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-gray-500">{song.artist}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{song.duration}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAddSong(song)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Selected Songs ({selectedSongs.length})</h3>
          <div className="border rounded-lg divide-y">
            {selectedSongs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No songs selected</p>
                <p className="text-sm">Add songs from the list</p>
              </div>
            ) : (
              selectedSongs.map(song => (
                <div key={song.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{song.title}</p>
                    <p className="text-sm text-gray-500">{song.artist}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveSong(song.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}