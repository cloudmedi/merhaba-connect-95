import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CreatePlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSongs: any[];
}

export function CreatePlaylistDialog({ isOpen, onClose, selectedSongs }: CreatePlaylistDialogProps) {
  const [playlistName, setPlaylistName] = useState("");
  const navigate = useNavigate();

  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) {
      return;
    }

    navigate("/super-admin/playlists/create", {
      state: { 
        selectedSongs,
        playlistName
      }
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            {selectedSongs.length} songs selected
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreatePlaylist} disabled={!playlistName.trim()}>
            Create Playlist
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}