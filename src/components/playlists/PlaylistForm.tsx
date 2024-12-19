import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

interface PlaylistFormProps {
  playlistData: {
    title: string;
    description: string;
    artwork: File | null;
    artwork_url?: string;
    selectedGenres: any[];
    selectedMoods: any[];
    selectedCategories: any[];
  };
  setPlaylistData: (data: any) => void;
}

export function PlaylistForm({ playlistData, setPlaylistData }: PlaylistFormProps) {
  const handleArtworkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPlaylistData((prev: any) => {
        console.log('Updating artwork:', file);
        return { ...prev, artwork: file };
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setPlaylistData((prev: any) => {
      console.log(`Updating ${field}:`, value);
      return { ...prev, [field]: value };
    });
  };

  return (
    <div className="space-y-4 w-[300px]">
      <div>
        <label className="text-sm font-medium">Playlist Name</label>
        <Input
          placeholder="Enter playlist name"
          value={playlistData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          placeholder="Enter playlist description"
          value={playlistData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Artwork</label>
        <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
             onClick={() => document.getElementById('artwork-upload')?.click()}>
          {playlistData.artwork ? (
            <img
              src={URL.createObjectURL(playlistData.artwork)}
              alt="Playlist artwork"
              className="w-full h-40 object-cover rounded"
            />
          ) : playlistData.artwork_url ? (
            <img
              src={playlistData.artwork_url}
              alt="Playlist artwork"
              className="w-full h-40 object-cover rounded"
            />
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-gray-500">
              <Upload className="w-8 h-8 mb-2" />
              <span>Upload Artwork</span>
            </div>
          )}
          <input
            id="artwork-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleArtworkUpload}
          />
        </div>
      </div>
    </div>
  );
}