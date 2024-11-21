import { Button } from "@/components/ui/button";
import { PlaySquare, Trash2 } from "lucide-react";

interface MusicActionsProps {
  selectedCount: number;
  onCreatePlaylist: () => void;
  onDeleteSelected: () => void;
}

export function MusicActions({ 
  selectedCount,
  onCreatePlaylist,
  onDeleteSelected,
}: MusicActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={onCreatePlaylist} 
        variant="outline" 
        className="whitespace-nowrap hover:bg-[#9b87f5] hover:text-white"
      >
        <PlaySquare className="w-4 h-4 mr-2" />
        Create Playlist ({selectedCount} songs)
      </Button>
      
      <Button 
        onClick={onDeleteSelected} 
        variant="outline" 
        className="text-red-600 hover:bg-red-600 hover:text-white"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Selected
      </Button>
    </div>
  );
}