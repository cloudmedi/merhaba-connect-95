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
  fileUrl: string;
  artworkUrl?: string | null;
  createdAt: string;
  bunnyId?: string | null;
  createdBy?: string | null;
  updatedAt?: string | null;
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

  // Fetch unique genres from songs
  const genres: string[] = Array.from(
    new Set(songs.flatMap(song => song.genre || []))
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