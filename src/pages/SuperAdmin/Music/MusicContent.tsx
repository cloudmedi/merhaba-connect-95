import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Trash2, PlaySquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  file: File;
}

export function MusicContent() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newSongs: Song[] = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Unknown Artist",
      duration: "0:00",
      file: file,
    }));

    setSongs((prev) => [...prev, ...newSongs]);
    toast({
      title: "Success",
      description: `${files.length} songs uploaded successfully`,
    });
  };

  const toggleSongSelection = (song: Song) => {
    setSelectedSongs((prev) =>
      prev.some((s) => s.id === song.id)
        ? prev.filter((s) => s.id !== song.id)
        : [...prev, song]
    );
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {songs.map((song) => (
            <div
              key={song.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedSongs.some((s) => s.id === song.id)
                  ? "border-purple-500 bg-purple-50"
                  : "hover:border-gray-300"
              }`}
              onClick={() => toggleSongSelection(song)}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <PlaySquare className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">{song.title}</h3>
                  <p className="text-sm text-gray-500">{song.artist}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}