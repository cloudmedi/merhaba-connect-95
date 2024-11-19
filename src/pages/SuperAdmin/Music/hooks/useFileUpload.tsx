import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import * as musicMetadata from 'music-metadata-browser';
import { formatDuration } from "@/utils/formatDuration";
import { Song } from "../types";

export const useFileUpload = (setSongs: React.Dispatch<React.SetStateAction<Song[]>>) => {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newSongs: Song[] = [];

    for (const file of Array.from(files)) {
      try {
        const metadata = await musicMetadata.parseBlob(file);
        newSongs.push({
          id: Date.now() + newSongs.length,
          title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
          artist: metadata.common.artist || "Unknown Artist",
          album: metadata.common.album || "Unknown Album",
          genres: metadata.common.genre || [],
          duration: formatDuration(metadata.format.duration || 0),
          file: file,
          uploadDate: new Date(),
          playlists: [],
          artwork: metadata.common.picture?.[0] ? 
            URL.createObjectURL(new Blob([metadata.common.picture[0].data], { type: metadata.common.picture[0].format })) :
            undefined
        });
      } catch (error) {
        console.error("Error parsing metadata:", error);
        newSongs.push({
          id: Date.now() + newSongs.length,
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "Unknown Artist",
          album: "Unknown Album",
          genres: [],
          duration: "0:00",
          file: file,
          uploadDate: new Date(),
          playlists: [],
        });
      }
    }

    setSongs((prev) => [...prev, ...newSongs]);
    toast({
      title: "Success",
      description: `${files.length} songs uploaded successfully`,
    });
  };

  return { handleFileUpload };
};