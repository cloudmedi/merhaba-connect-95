import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Song {
  id: string;
  title: string;
  artist?: string | null;
  album?: string | null;
  genre?: string[] | null;
  duration?: number | null;
  file_url: string;
  created_at: string;
  bunny_id?: string | null;
  created_by?: string | null;
  updated_at?: string | null;
}

export const useMusicLibrary = () => {
  const [filterGenre, setFilterGenre] = useState<string>("all");
  const [sortByRecent, setSortByRecent] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { data: songs = [], isLoading, refetch } = useQuery({
    queryKey: ['songs', filterGenre, sortByRecent, currentPage],
    queryFn: async () => {
      const response = await axios.get('/api/admin/songs');
      return response.data as Song[];
    }
  });

  // Fetch unique genres from songs, safely handling undefined/null values
  const genres: string[] = Array.from(
    new Set(
      songs
        .filter(song => Array.isArray(song.genre) && song.genre.length > 0)
        .reduce((acc: string[], song) => [...acc, ...(song.genre || [])], [])
    )
  ).sort();

  const totalCount = songs.length;
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