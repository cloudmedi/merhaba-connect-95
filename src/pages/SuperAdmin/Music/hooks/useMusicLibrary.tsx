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
  const itemsPerPage = 20;

  const { data: songsData = [], isLoading, refetch } = useQuery({
    queryKey: ['songs', filterGenre, sortByRecent, currentPage],
    queryFn: async () => {
      const response = await axios.get('/api/admin/songs');
      return response.data || [];
    }
  });

  // API'den gelen veriyi Song[] tipine dönüştür
  const songs: Song[] = Array.isArray(songsData) ? songsData : [];

  // Genre'leri güvenli bir şekilde çıkart
  const genres: string[] = Array.from(new Set(
    songs.reduce((acc: string[], song) => {
      if (song.genre && Array.isArray(song.genre)) {
        return [...acc, ...song.genre];
      }
      return acc;
    }, [])
  )).sort();

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