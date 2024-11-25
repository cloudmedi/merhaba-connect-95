import { cn } from "@/lib/utils";

interface PlayerArtworkProps {
  artwork: string;
  title: string;
  artist: string;
  className?: string;
}

export function PlayerArtwork({ artwork, title, artist, className }: PlayerArtworkProps) {
  const getOptimizedImageUrl = (url: string) => {
    if (!url || !url.includes('b-cdn.net')) return url;
    return `${url}?width=400&quality=85&format=webp`;
  };

  return (
    <div className={cn("flex items-center gap-5 flex-1 min-w-[200px] max-w-[320px]", className)}>
      <img 
        src={getOptimizedImageUrl(artwork)} 
        alt={title}
        className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
      />
      <div className="min-w-0">
        <h3 className="text-white font-semibold text-base md:text-lg truncate mb-1 hover:text-white/90 transition-colors cursor-default">
          {title}
        </h3>
        <p className="text-white/60 text-sm md:text-base truncate hover:text-white/70 transition-colors cursor-default">
          {artist}
        </p>
      </div>
    </div>
  );
}