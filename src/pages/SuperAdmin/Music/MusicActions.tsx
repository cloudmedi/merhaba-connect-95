import { Button } from "@/components/ui/button";
import { PlaySquare, Trash2 } from "lucide-react";

interface MusicActionsProps {
  selectedCount: number;
  onCreatePlaylist: () => void;
  onDeleteSelected: () => void;
}

export function MusicActions({ selectedCount, onCreatePlaylist, onDeleteSelected }: MusicActionsProps) {
  return (
    <>
      <Button onClick={onCreatePlaylist} variant="outline" className="whitespace-nowrap">
        <PlaySquare className="w-4 h-4 mr-2" />
        Create Playlist ({selectedCount} songs)
      </Button>
      <Button onClick={onDeleteSelected} variant="destructive" className="whitespace-nowrap">
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Selected
      </Button>
    </>
  );
}