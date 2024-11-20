import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Song {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string[];
  duration?: number;
  file_url: string;
  artwork_url?: string;
  created_at: string;
}

export const useMusicLibrary = () => {
  const [filterGenre, setFilterGenre] = useState<string>("all-genres");
  const [filterPlaylist, setFilterPlaylist] = useState<string>("all-playlists");
  const [sortByRecent, setSortByRecent] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  const { data: songs = [], isLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Song[];
    }
  });

  const filteredSongs = songs
    .filter(song => {
      if (filterGenre !== "all-genres" && !song.genre?.includes(filterGenre)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortByRecent) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
  const paginatedSongs = filteredSongs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    songs: paginatedSongs,
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