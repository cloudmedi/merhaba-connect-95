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
  const [filterGenre, setFilterGenre] = useState<string>("all");
  const [sortByRecent, setSortByRecent] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Sabit sayfa başına öğe sayısı

  // First, get total count of songs
  const { data: totalCount = 0 } = useQuery({
    queryKey: ['songs-count', filterGenre],
    queryFn: async () => {
      let query = supabase
        .from('songs')
        .select('*', { count: 'exact', head: true });

      if (filterGenre !== "all") {
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

  // Then fetch paginated songs
  const { data: songs = [], isLoading, refetch } = useQuery({
    queryKey: ['songs', filterGenre, sortByRecent, currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from('songs')
        .select('*')
        .range(from, to);

      if (filterGenre !== "all") {
        query = query.contains('genre', [filterGenre]);
      }

      if (sortByRecent) {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('title');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching songs:', error);
        throw error;
      }

      return data as Song[];
    }
  });

  // Fetch unique genres from songs
  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('genre');

      if (error) {
        console.error('Error fetching genres:', error);
        throw error;
      }

      // Extract unique genres from all songs
      const allGenres = data
        .flatMap(song => song.genre || [])
        .filter((genre): genre is string => Boolean(genre));

      return Array.from(new Set(allGenres)).sort();
    }
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  return {
    songs,
    isLoading,
    filterGenre,
    setFilterGenre,
    sortByRecent,
    setSortByRecent,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    totalCount,
    refetch,
    genres
  };
};