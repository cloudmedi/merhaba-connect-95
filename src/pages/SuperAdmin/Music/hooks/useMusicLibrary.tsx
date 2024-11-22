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
  const itemsPerPage = 20; // Changed to 20 items per page

  const { data: songs = [], isLoading } = useQuery({
    queryKey: ['songs', filterGenre, filterPlaylist, sortByRecent, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('songs')
        .select('*');

      if (filterGenre !== "all-genres") {
        query = query.contains('genre', [filterGenre]);
      }

      if (sortByRecent) {
        query = query.order('created_at', { ascending: false });
      }

      // Add pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching songs:', error);
        throw error;
      }

      return data as Song[];
    }
  });

  // Get total count for pagination
  const { data: totalCount = 0 } = useQuery({
    queryKey: ['songs-count', filterGenre, filterPlaylist],
    queryFn: async () => {
      let query = supabase
        .from('songs')
        .select('id', { count: 'exact' });

      if (filterGenre !== "all-genres") {
        query = query.contains('genre', [filterGenre]);
      }

      const { count, error } = await query;

      if (error) {
        console.error('Error fetching songs count:', error);
        throw error;
      }

      return count || 0;
    }
  });

  const totalPages = Math.ceil(totalCount / itemsPerPage);

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
    totalCount
  };
};