import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Song {
  id: string;
  title: string;
  artist?: string | null;
  album?: string | null;
  genre?: string[] | null;
  duration?: number | null;
  file_url: string;
  artwork_url?: string | null;
  created_at: string;
  bunny_id?: string | null;
  created_by?: string | null;
  updated_at?: string | null;
}

export const useMusicLibrary = () => {
  const [filterGenre, setFilterGenre] = useState<string>("all-genres");
  const [filterPlaylist, setFilterPlaylist] = useState<string>("all-playlists");
  const [sortByRecent, setSortByRecent] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // First, get total count of songs
  const { data: totalCount = 0 } = useQuery({
    queryKey: ['songs-count', filterGenre, filterPlaylist],
    queryFn: async () => {
      let query = supabase
        .from('songs')
        .select('*', { count: 'exact', head: true });

      if (filterGenre !== "all-genres") {
        query = query.contains('genre', [filterGenre]);
      }

      const { count, error } = await query;

      if (error) throw error;
      return count || 0;
    }
  });

  // Then fetch paginated songs
  const { data: songs = [], isLoading, refetch } = useQuery({
    queryKey: ['songs', filterGenre, filterPlaylist, sortByRecent, currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + (itemsPerPage - 1);

      let query = supabase
        .from('songs')
        .select('*')
        .range(from, to);

      if (filterGenre !== "all-genres") {
        query = query.contains('genre', [filterGenre]);
      }

      if (sortByRecent) {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('title');
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Song[];
    }
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  return {
    songs,
    isLoading,
    filterGenre,
    setFilterGenre,
    filterPlaylist,
    setFilterPlaylist,
    sortByRecent,
    setSortByRecent,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    totalCount,
    refetch
  };
};