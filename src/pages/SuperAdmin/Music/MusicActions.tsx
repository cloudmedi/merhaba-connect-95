import { Button } from "@/components/ui/button";
import { PlaySquare, Trash2 } from "lucide-react";

interface MusicActionsProps {
  selectedCount: number;
  onCreatePlaylist: () => void;
  onDeleteSelected: () => void;
}

export function MusicActions({ selectedCount, onCreatePlaylist, onDeleteSelected }: MusicActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="mb-6 flex gap-4">
      <Button onClick={onCreatePlaylist} variant="outline">
        <PlaySquare className="w-4 h-4 mr-2" />
        Create Playlist ({selectedCount} songs)
      </Button>
      <Button onClick={onDeleteSelected} variant="destructive">
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Selected
      </Button>
    </div>
  );
}