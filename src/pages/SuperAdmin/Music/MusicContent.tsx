import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MusicFilters } from "./components/MusicFilters";
import { MusicTable } from "./components/MusicTable";
import { toast } from "sonner";
import type { Song } from "@/types/api";

export function MusicContent() {
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch songs with filtering
  const { data: songs = [], isLoading } = useQuery({
    queryKey: ['songs', currentPage, searchQuery, selectedGenre],
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

      if (selectedGenre !== 'all') {
        query = query.contains('genre', [selectedGenre]);
      }

      const { data, error } = await query;

      if (error) {
        toast(error.message);
        throw error;
      }
      return data as Song[];
    }
  });

  // Get total count for pagination
  const { data: totalCount = 0 } = useQuery({
    queryKey: ['songs-count', searchQuery, selectedGenre],
    queryFn: async () => {
      let query = supabase
        .from('songs')
        .select('*', { count: 'exact', head: true });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (selectedGenre !== 'all') {
        query = query.contains('genre', [selectedGenre]);
      }

      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch unique genres
  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('genre');

      if (error) throw error;

      const allGenres = data
        .flatMap(song => song.genre || [])
        .filter((genre): genre is string => Boolean(genre));

      return Array.from(new Set(allGenres)).sort();
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

      toast.success("Song deleted successfully");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedSongs.length > 0) {
      setSelectedSongs([]);
    } else {
      // Select all filtered songs
      let query = supabase
        .from('songs')
        .select('*');

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (selectedGenre !== 'all') {
        query = query.contains('genre', [selectedGenre]);
      }

      query.then(({ data }) => {
        if (data) {
          setSelectedSongs(data as Song[]);
          toast.success(`Selected ${data.length} songs`);
        }
      });
    }
  };

  return (
    <div className="space-y-8">
      <MusicFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        genres={genres}
        onSelectAll={handleSelectAll}
        selectedCount={selectedSongs.length}
      />

      <MusicTable
        songs={songs}
        selectedSongs={selectedSongs}
        onSelectSong={(song, checked) => {
          if (checked) {
            setSelectedSongs([...selectedSongs, song]);
          } else {
            setSelectedSongs(selectedSongs.filter(s => s.id !== song.id));
          }
        }}
        onSelectAll={(checked) => {
          if (checked) {
            setSelectedSongs(songs);
          } else {
            setSelectedSongs([]);
          }
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        isLoading={isLoading}
        totalCount={totalCount}
        onDelete={handleDelete}
      />
    </div>
  );
}