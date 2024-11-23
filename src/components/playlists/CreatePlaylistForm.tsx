import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

interface CreatePlaylistFormProps {
  playlistData: {
    title: string;
    description: string;
    artwork: File | null;
    artwork_url?: string;
  };
  setPlaylistData: (data: any) => void;
}

export function CreatePlaylistForm({ playlistData, setPlaylistData }: CreatePlaylistFormProps) {
  const handleArtworkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPlaylistData((prev: any) => ({ ...prev, artwork: file }));
    }
  };

  return (
    <div className="w-[300px] space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-700">Playlist Name</label>
        <Input
          placeholder="Enter playlist name"
          value={playlistData.title}
          onChange={(e) => setPlaylistData((prev: any) => ({ ...prev, title: e.target.value }))}
          className="mt-1"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-700">Description</label>
        <Textarea
          placeholder="Enter playlist description"
          value={playlistData.description}
          onChange={(e) => setPlaylistData((prev: any) => ({ ...prev, description: e.target.value }))}
          className="mt-1"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-700">Artwork</label>
        <div 
          className="mt-1 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
          onClick={() => document.getElementById('artwork-upload')?.click()}
        >
          {playlistData.artwork || playlistData.artwork_url ? (
            <img
              src={playlistData.artwork ? URL.createObjectURL(playlistData.artwork) : playlistData.artwork_url}
              alt="Playlist artwork"
              className="w-full h-40 object-cover rounded"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500">
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