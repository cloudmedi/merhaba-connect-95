import { Button } from "@/components/ui/button";
import { PlaySquare, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MusicActionsProps {
  selectedCount: number;
  onCreatePlaylist: () => void;
  onDeleteSelected: () => void;
  onAddGenre: () => void;
  onChangeGenre: () => void;
  onAddPlaylist: () => void;
  onChangePlaylist: () => void;
  onAddMood: () => void;
  onChangeMood: () => void;
  onChangeArtist: () => void;
  onChangeAlbum: () => void;
  onApprove: () => void;
}

export function MusicActions({ 
  selectedCount,
  onCreatePlaylist,
  onDeleteSelected,
  onAddGenre,
  onChangeGenre,
  onAddPlaylist,
  onChangePlaylist,
  onAddMood,
  onChangeMood,
  onChangeArtist,
  onChangeAlbum,
  onApprove
}: MusicActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onCreatePlaylist} variant="outline" className="whitespace-nowrap">
        <PlaySquare className="w-4 h-4 mr-2" />
        Create Playlist ({selectedCount} songs)
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <span>Action</span>
            <MoreHorizontal className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onAddGenre}>
            Add Genre
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onChangeGenre}>
            Change Genre
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onAddPlaylist}>
            Add Playlist
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onChangePlaylist}>
            Change Playlist
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onAddMood}>
            Add Mood
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onChangeMood}>
            Change Mood
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onChangeArtist}>
            Change Artist
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onChangeAlbum}>
            Change Album
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onApprove}>
            Approve (Publish)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDeleteSelected} className="text-red-600">
            Delete Selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}