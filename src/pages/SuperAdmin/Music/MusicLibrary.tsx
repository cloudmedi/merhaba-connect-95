import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";

interface Song {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string[];
  duration?: number;
  artwork_url?: string;
  file_url: string;
}

export function MusicLibrary() {
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const itemsPerPage = 20;

  const { data: songs = [], isLoading, refetch } = useQuery({
    queryKey: ['songs', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('songs')
        .select('*')
        .range(0, itemsPerPage - 1);

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Song[];
    }
  });

  const handleDelete = async (songId: string) => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Song deleted successfully",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              type="search"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Upload Music
          </Button>
        </div>
        {selectedSongs.length > 0 && (
          <Button variant="destructive" onClick={() => handleDelete(selectedSongs[0].id)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete ({selectedSongs.length})
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-sm font-medium text-gray-500">
          <div className="col-span-1">
            <Checkbox 
              checked={selectedSongs.length === songs.length}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedSongs(songs);
                } else {
                  setSelectedSongs([]);
                }
              }}
            />
          </div>
          <div className="col-span-5">Title</div>
          <div className="col-span-3">Artist</div>
          <div className="col-span-2">Album</div>
          <div className="col-span-1 text-right">Duration</div>
        </div>

        <ScrollArea className="h-[calc(100vh-320px)]">
          <div className="divide-y">
            {songs.map((song) => (
              <div 
                key={song.id}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 group"
              >
                <div className="col-span-1">
                  <Checkbox
                    checked={selectedSongs.some(s => s.id === song.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSongs([...selectedSongs, song]);
                      } else {
                        setSelectedSongs(selectedSongs.filter(s => s.id !== song.id));
                      }
                    }}
                  />
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0">
                    {song.artwork_url && (
                      <img 
                        src={song.artwork_url} 
                        alt={song.title}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <span className="font-medium truncate">{song.title}</span>
                </div>
                <div className="col-span-3 truncate text-gray-600">
                  {song.artist || '-'}
                </div>
                <div className="col-span-2 truncate text-gray-600">
                  {song.album || '-'}
                </div>
                <div className="col-span-1 text-right text-gray-600">
                  {formatDuration(song.duration)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}