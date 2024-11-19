import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Trash2, PlaySquare, Music2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import * as musicMetadata from 'music-metadata-browser';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  genres: string[];
  duration: string;
  file: File;
}

export function MusicContent() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newSongs: Song[] = [];

    for (const file of Array.from(files)) {
      try {
        const metadata = await musicMetadata.parseBlob(file);
        console.log('Metadata extracted:', metadata);
        
        newSongs.push({
          id: Date.now() + newSongs.length,
          title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
          artist: metadata.common.artist || "Unknown Artist",
          album: metadata.common.album || "Unknown Album",
          genres: metadata.common.genre || [],
          duration: formatDuration(metadata.format.duration || 0),
          file: file,
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
        });
      }
    }

    setSongs((prev) => [...prev, ...newSongs]);
    toast({
      title: "Success",
      description: `${files.length} songs uploaded successfully`,
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSongs(songs);
    } else {
      setSelectedSongs([]);
    }
  };

  const handleSelectSong = (song: Song, checked: boolean) => {
    if (checked) {
      setSelectedSongs((prev) => [...prev, song]);
    } else {
      setSelectedSongs((prev) => prev.filter((s) => s.id !== song.id));
    }
  };

  const handleCreatePlaylist = () => {
    navigate("/super-admin/playlists/create", {
      state: { selectedSongs },
    });
  };

  const handleDeleteSelected = () => {
    setSongs((prev) =>
      prev.filter((song) => !selectedSongs.some((s) => s.id === song.id))
    );
    setSelectedSongs([]);
    toast({
      title: "Success",
      description: "Selected songs deleted successfully",
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Music Library</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => document.getElementById("music-upload")?.click()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Music
          </Button>
          <input
            id="music-upload"
            type="file"
            accept="audio/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {selectedSongs.length > 0 && (
        <div className="mb-6 flex gap-4">
          <Button onClick={handleCreatePlaylist} variant="outline">
            <PlaySquare className="w-4 h-4 mr-2" />
            Create Playlist ({selectedSongs.length} songs)
          </Button>
          <Button onClick={handleDeleteSelected} variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-200px)] rounded-md border">
        {songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Music2 className="w-12 h-12 mb-2" />
            <p>No songs uploaded yet</p>
            <p className="text-sm">Upload some music to get started</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedSongs.length === songs.length}
                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Album</TableHead>
                <TableHead>Genres</TableHead>
                <TableHead className="text-right">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {songs.map((song) => (
                <TableRow
                  key={song.id}
                  className={`cursor-pointer ${
                    selectedSongs.some((s) => s.id === song.id)
                      ? "bg-purple-50"
                      : ""
                  }`}
                >
                  <TableCell>
                    <Checkbox 
                      checked={selectedSongs.some((s) => s.id === song.id)}
                      onCheckedChange={(checked) => handleSelectSong(song, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{song.title}</TableCell>
                  <TableCell>{song.artist}</TableCell>
                  <TableCell>{song.album}</TableCell>
                  <TableCell>{song.genres.join(", ") || "-"}</TableCell>
                  <TableCell className="text-right">{song.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </ScrollArea>
    </div>
  );
}