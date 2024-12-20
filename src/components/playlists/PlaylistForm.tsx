import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface PlaylistFormProps {
  playlistData: {
    name: string;
    description: string;
    artwork: File | null;
    artworkUrl: string;
    selectedSongs: Array<{
      songId: {
        _id: string;
        title: string;
        artist: string;
        album: string | null;
        duration: number | null;
        fileUrl: string;
        artworkUrl: string | null;
      };
      position: number;
      _id: string;
    }>;
    selectedGenres: any[];
    selectedCategories: any[];
    selectedMoods: any[];
    isCatalog: boolean;
    isPublic: boolean;
    isHero: boolean;
    assignedManagers: any[];
  };
  setPlaylistData: (data: any) => void;
  isEditMode?: boolean;
}

export function PlaylistForm({ playlistData, setPlaylistData, isEditMode }: PlaylistFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(playlistData.artworkUrl || "");

  console.log('PlaylistForm - Current playlist data:', playlistData);
  console.log('PlaylistForm - Selected songs:', playlistData.selectedSongs);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPlaylistData({ ...playlistData, artwork: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveArtwork = () => {
    setPlaylistData({ ...playlistData, artwork: null, artworkUrl: "" });
    setPreviewUrl("");
  };

  return (
    <div className="w-96 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={playlistData.name}
          onChange={(e) => setPlaylistData({ ...playlistData, name: e.target.value })}
          placeholder="Enter playlist name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={playlistData.description}
          onChange={(e) => setPlaylistData({ ...playlistData, description: e.target.value })}
          placeholder="Enter playlist description"
        />
      </div>

      <div className="space-y-2">
        <Label>Artwork</Label>
        <div className="flex flex-col gap-4">
          {(previewUrl || playlistData.artworkUrl) && (
            <div className="relative w-full aspect-square">
              <img
                src={previewUrl || playlistData.artworkUrl}
                alt="Playlist artwork"
                className="w-full h-full object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemoveArtwork}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          <div className="flex items-center justify-center w-full">
            <label className="w-full cursor-pointer">
              <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Click to upload artwork</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}