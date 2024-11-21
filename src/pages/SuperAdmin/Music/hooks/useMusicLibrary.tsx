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
  const itemsPerPage = 100;

  const { data: songs = [], isLoading } = useQuery({
    queryKey: ['songs', filterGenre, filterPlaylist, sortByRecent],
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

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching songs:', error);
        throw error;
      }

      return data as Song[];
    }
  });

  const filteredSongs = songs || [];
  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);

  return {
    songs: filteredSongs,
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
    itemsPerPage
  };
};