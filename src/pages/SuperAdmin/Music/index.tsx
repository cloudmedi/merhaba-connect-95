import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Trash2 } from "lucide-react";

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

export default function MusicLibrary() {
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const { data: totalCount = 0 } = useQuery({
    queryKey: ['songs-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('songs')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    }
  });

  const { data: songs = [], isLoading } = useQuery({
    queryKey: ['songs', currentPage, searchQuery],
    queryFn: async () => {
      console.log('Fetching songs for page:', currentPage);
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from('songs')
        .select('*')
        .range(from, to)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      console.log('Fetched songs:', data?.length);

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

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="p-8 h-screen flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Music Library</h1>
        <p className="text-sm text-gray-500">Manage and organize your music collection</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
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

      {/* Table Container with Fixed Height */}
      <div className="flex-1 border rounded-lg bg-white overflow-hidden flex flex-col min-h-0">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 text-sm font-medium text-gray-500 border-b sticky top-0">
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

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="min-h-0">
            {songs.map((song) => (
              <div 
                key={song.id}
                className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-gray-50 border-b last:border-b-0"
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

        {/* Pagination */}
        <div className="border-t p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing {songs.length} of {totalCount} songs
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}