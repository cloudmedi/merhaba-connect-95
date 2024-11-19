import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlaylistCardProps {
  title: string;
  tags: string[];
  artwork: string;
  className?: string;
  onPlay?: () => void;
}

export function PlaylistCard({ title, tags, artwork, className, onPlay }: PlaylistCardProps) {
  return (
    <div className={cn("group relative rounded-lg overflow-hidden", className)}>
      <div className="aspect-square">
        <img 
          src={artwork} 
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black hover:bg-white/90"
          onClick={onPlay}
        >
          <Play className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span 
              key={tag}
              className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}