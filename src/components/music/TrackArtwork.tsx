import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrackArtworkProps {
  artwork?: string;
  title: string;
  onPlay: () => void;
}

export function TrackArtwork({ artwork, title, onPlay }: TrackArtworkProps) {
  return (
    <div className="relative group w-12 h-12">
      <img
        src={artwork || "/placeholder.svg"}
        alt={title}
        className="w-full h-full object-cover rounded group-hover:opacity-75 transition-opacity"
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70"
          onClick={onPlay}
        >
          <Play className="w-4 h-4 text-white" />
        </Button>
      </div>
    </div>
  );
}