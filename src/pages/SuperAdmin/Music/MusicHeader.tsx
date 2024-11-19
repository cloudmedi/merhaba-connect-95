import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface MusicHeaderProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MusicHeader({ onUpload }: MusicHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Music Library</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your music collection</p>
      </div>
      <div>
        <Button
          onClick={() => document.getElementById("music-upload")?.click()}
          className="bg-[#FFD700] text-black hover:bg-[#E6C200]"
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
          onChange={onUpload}
        />
      </div>
    </div>
  );
}