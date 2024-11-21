import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";

interface MusicHeaderProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MusicHeader({ onUpload }: MusicHeaderProps) {
  return (
    <div className="flex gap-4">
      <Button
        onClick={() => document.getElementById("music-upload")?.click()}
        className="bg-[#FFD700] text-black hover:bg-[#E6C200]"
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload Music
        <input
          id="music-upload"
          type="file"
          accept="audio/*"
          multiple
          className="hidden"
          onChange={onUpload}
        />
      </Button>

      <Button variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        Add Manually
      </Button>
    </div>
  );
}