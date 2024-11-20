import { Music } from "lucide-react";

interface PlaylistBannerProps {
  title: string;
  description: string;
  artwork?: string;
}

export function PlaylistBanner({ title, description, artwork }: PlaylistBannerProps) {
  return (
    <div className="relative bg-red-600 text-white rounded-lg overflow-hidden">
      <div className="relative z-10 p-8 flex items-center gap-6">
        <div className="h-24 w-24 bg-red-500/50 rounded-lg flex items-center justify-center shrink-0">
          {artwork ? (
            <img src={artwork} alt={title} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <Music className="h-12 w-12" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-red-100 text-sm">{description}</p>
        </div>
      </div>
      <div 
        className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-500 opacity-50"
        style={{
          backgroundImage: artwork ? `url(${artwork})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </div>
  );
}