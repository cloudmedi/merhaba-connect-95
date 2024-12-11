import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreatePlaylist } from "@/components/playlists/CreatePlaylist";

interface CreatePlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSongs: any[];
}

export function CreatePlaylistDialog({ isOpen, onClose, selectedSongs }: CreatePlaylistDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1200px] h-[80vh]">
        <CreatePlaylist />
      </DialogContent>
    </Dialog>
  );
}