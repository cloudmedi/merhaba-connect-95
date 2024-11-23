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

  // First get total count
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

      if (error) {
        console.error('Error fetching songs count:', error);
        throw error;
      }

      return count || 0;
    }
  });

  // Then get paginated songs
  const { data: songs = [], isLoading, refetch } = useQuery({
    queryKey: ['songs', filterGenre, filterPlaylist, sortByRecent, currentPage],
    queryFn: async () => {
      // Calculate the range. Since Supabase range is inclusive, we subtract 1 from itemsPerPage
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + (itemsPerPage - 1); // Subtract 1 because range is inclusive

      console.log('Fetching songs from:', from, 'to:', to);

      let query = supabase
        .from('songs')
        .select('*');

      if (filterGenre !== "all-genres") {
        query = query.contains('genre', [filterGenre]);
      }

      if (sortByRecent) {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching songs:', error);
        throw error;
      }

      console.log('Fetched songs count:', data?.length);
      return data as Song[];
    }
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  // Ensure current page is valid
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

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