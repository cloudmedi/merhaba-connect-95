import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Music } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data, error } = await supabase
          .from('songs')
          .select('*')
          .ilike('title', `%${searchQuery}%`);

        if (error) throw error;
        setAvailableSongs(data || []);
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [searchQuery]);

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
          <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">Loading songs...</div>
            ) : availableSongs.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No songs found
              </div>
            ) : (
              availableSongs.map(song => (
                <div key={song.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{song.title}</p>
                    <p className="text-sm text-gray-500">{song.artist}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAddSong(song)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Selected Songs ({selectedSongs.length})</h3>
          <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
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