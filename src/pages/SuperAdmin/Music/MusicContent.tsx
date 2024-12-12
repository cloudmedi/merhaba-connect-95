import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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

export function MusicContent() {
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  const itemsPerPage = 20;

  const { data: songs = [], isLoading } = useQuery({
    queryKey: ['songs', currentPage, searchQuery],
    queryFn: async () => {
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

      if (error) throw error;
      return data as Song[];
    }
  });

  // Get total count for pagination
  const { data: totalCount = 0 } = useQuery({
    queryKey: ['songs-count', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('songs')
        .select('*', { count: 'exact', head: true });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    }
  });

  const totalPages = Math.ceil(totalCount / itemsPerPage);

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

  const handleCreatePlaylist = () => {
    if (selectedSongs.length === 0) {
      toast({
        title: "No songs selected",
        description: "Please select at least one song to create a playlist",
        variant: "destructive"
      });
      return;
    }

    navigate("/super-admin/playlists/create", {
      state: { selectedSongs }
    });
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
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
          <div className="flex items-center gap-2">
            <Button onClick={handleCreatePlaylist}>
              Create Playlist ({selectedSongs.length} songs)
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(selectedSongs[0].id)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedSongs.length})
            </Button>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="flex-1 border rounded-lg bg-white overflow-hidden flex flex-col">
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
        <div className="flex-1 overflow-auto">
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

        {/* Pagination */}
        <div className="border-t p-4 bg-white flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} songs
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}