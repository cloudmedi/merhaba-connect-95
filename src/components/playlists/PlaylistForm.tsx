import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface PlaylistFormProps {
  playlistData: {
    _id?: string;  // id yerine _id kullanıyoruz
    title: string;
    description: string;
    artwork: File | null;
    artwork_url: string;
  };
  setPlaylistData: (data: any) => void;
}

export function PlaylistForm({ playlistData, setPlaylistData }: PlaylistFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(playlistData.artwork_url || "");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPlaylistData({ ...playlistData, artwork: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <div className="w-96 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={playlistData.title}
          onChange={(e) => setPlaylistData({ ...playlistData, title: e.target.value })}
          placeholder="Enter playlist title"
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
        <div className="flex items-center gap-4">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Playlist artwork"
              className="w-24 h-24 object-cover rounded"
            />
          )}
          <Button
            type="button"
            variant="outline"
            className="w-24 h-24"
            onClick={() => document.getElementById('artwork-upload')?.click()}
          >
            <Upload className="w-6 h-6" />
          </Button>
          <input
            id="artwork-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}