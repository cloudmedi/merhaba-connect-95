import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Search, Music2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Song } from "@/types/playlist";
import DataTableLoader from "@/components/loaders/DataTableLoader";
import { getSongsQuery } from "@/services/songs/queries";

interface SongsTabProps {
  selectedSongs: Array<{
    songId: {
      _id: string;
      title: string;
      artist: string;
      album: string | null;
      duration: number | null;
      fileUrl: string;
      artworkUrl: string | null;
    };
    position: number;
    _id: string;
  }>;
  onAddSong: (song: Song) => void;
  onRemoveSong: (songId: string) => void;
}

export function SongsTab({ selectedSongs, onAddSong, onRemoveSong }: SongsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");

  console.log('SongsTab - Selected songs:', selectedSongs);

  const { data: songs = [], isLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: getSongsQuery
  });

  const handleSelectSong = (song: Song) => {
    console.log('Selecting song:', song);
    onAddSong(song);
  };

  const handleRemoveSong = (songId: string) => {
    console.log('Removing song with ID:', songId);
    onRemoveSong(songId);
  };

  const filteredSongs = songs.filter((song: Song) =>
    !selectedSongs.some(s => s.songId._id === song._id) && (
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.artist?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )
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
            placeholder="Şarkı ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Seçilen Şarkılar */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-lg mb-4">Seçilen Şarkılar ({selectedSongs.length})</h3>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {selectedSongs.map((song) => (
                <div
                  key={song._id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-purple-50 border-purple-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                      <Music2 className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{song.songId.title}</h4>
                      <p className="text-sm text-gray-500">{song.songId.artist || 'Bilinmeyen Sanatçı'}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSong(song.songId._id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Tüm Şarkılar */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-lg mb-4">Tüm Şarkılar ({filteredSongs.length})</h3>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {filteredSongs.map((song: Song) => (
                <div
                  key={song._id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSelectSong(song)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <Music2 className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{song.title}</h4>
                      <p className="text-sm text-gray-500">{song.artist || 'Bilinmeyen Sanatçı'}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100"
                  >
                    Seç
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}