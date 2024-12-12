import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BulkPlaylistForm } from "./BulkPlaylistForm";
import type { Genre } from "@/types/api";

interface BulkPlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  genres: Genre[];
}

export function BulkPlaylistDialog({
  open,
  onOpenChange,
  genres,
}: BulkPlaylistDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Bulk Playlist</DialogTitle>
        </DialogHeader>
        <BulkPlaylistForm 
          genres={genres} 
          onClose={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}