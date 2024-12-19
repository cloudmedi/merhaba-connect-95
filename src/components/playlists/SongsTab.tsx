import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Song } from "@/types/playlist";
import DataTableLoader from "@/components/loaders/DataTableLoader";
import { getSongsQuery } from "@/services/songs/queries";

interface SongsTabProps {
  selectedSongs: Song[];
  onAddSong: (song: Song) => void;
  onRemoveSong: (songId: string) => void;
}

export function SongsTab({ selectedSongs, onAddSong, onRemoveSong }: SongsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: songs = [], isLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: getSongsQuery
  });

  const handleSelectSong = (song: Song) => {
    const isSelected = selectedSongs.some((s: Song) => s._id === song._id);
    
    if (isSelected) {
      onRemoveSong(song._id);
    } else {
      onAddSong(song);
    }
  };

  const filteredSongs = songs.filter((song: Song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (song.artist?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <DataTableLoader />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="space-y-4">
          {filteredSongs.map((song: Song) => {
            const isSelected = selectedSongs.some((s: Song) => s._id === song._id);
            
            return (
              <div
                key={song._id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected ? 'bg-purple-50 border-purple-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSelectSong(song)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={song.artworkUrl || "/placeholder.svg"}
                    alt={song.title}
                    className="w-12 h-12 rounded object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = "/placeholder.svg";
                    }}
                  />
                  <div>
                    <h4 className="font-medium text-sm">{song.title}</h4>
                    <p className="text-sm text-gray-500">{song.artist || 'Unknown Artist'}</p>
                  </div>
                </div>
                <Button
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectSong(song);
                  }}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </Button>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}