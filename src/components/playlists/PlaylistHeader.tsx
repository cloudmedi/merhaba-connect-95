import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";

export interface PlaylistHeaderProps {
  // Common props
  onBack?: () => void;
  onCancel?: () => void;
  onCreate?: () => Promise<void>;
  
  // Detail view props
  artworkUrl?: string;
  name?: string;
  genreName?: string;
  moodName?: string;
  songCount?: number;
  duration?: string;
  onPlay?: () => void;
  onPush?: () => void;
  isHero?: boolean;
  id?: string;
  
  // Create/Edit mode props
  isEditMode?: boolean;
}

export function PlaylistHeader({
  // Common props
  onBack,
  onCancel,
  onCreate,
  
  // Detail view props
  artworkUrl,
  name,
  genreName = "Various",
  moodName = "Various",
  songCount,
  duration,
  onPlay,
  onPush,
  isHero,
  
  // Create/Edit mode props
  isEditMode,
}: PlaylistHeaderProps) {
  // If we're in create/edit mode
  if (onCancel && onCreate) {
    return (
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={onCreate}>
          {isEditMode ? "Save Changes" : "Create Playlist"}
        </Button>
      </div>
    );
  }

  // If we're in detail view
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-gray-500">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 hover:text-gray-900 transition-colors text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Media Library
        </button>
      </div>

      <div className="flex items-start gap-8">
        <div className="relative group">
          <img 
            src={artworkUrl || "/placeholder.svg"} 
            alt={name}
            className="w-48 h-48 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {onPlay && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-lg flex items-center justify-center">
              <Button
                size="icon"
                variant="ghost"
                onClick={onPlay}
                className="w-12 h-12 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
              >
                <Play className="w-5 h-5 ml-0.5 text-white" />
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>{genreName}</span>
              <span>•</span>
              <span>{moodName}</span>
              {songCount !== undefined && (
                <>
                  <span>•</span>
                  <span>{songCount} songs</span>
                </>
              )}
              {duration && (
                <>
                  <span>•</span>
                  <span>{duration}</span>
                </>
              )}
              {isHero && (
                <>
                  <span>•</span>
                  <span className="text-purple-600">Featured</span>
                </>
              )}
            </div>
          </div>

          {onPush && (
            <Button 
              onClick={onPush}
              className="bg-purple-600 text-white hover:bg-purple-700 rounded-full px-8"
            >
              Push
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}