import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { usePlaylistMutations } from "./hooks/usePlaylistMutations";
import { toast } from "sonner";
import type { Playlist } from "@/types/api";

interface EditPlaylistDialogProps {
  playlist: Playlist;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditPlaylistDialog({ playlist, open, onOpenChange, onSuccess }: EditPlaylistDialogProps) {
  const [formData, setFormData] = useState({
    name: playlist.name,
    description: playlist.description || "",
    isPublic: playlist.isPublic,
    isHero: playlist.isHero,
    artworkUrl: playlist.artworkUrl || "",
    genre: playlist.genre?._id,
    mood: playlist.mood?._id,
    categories: playlist.categories?.map(cat => cat._id) || [],
    songs: playlist.songs?.map(song => ({ 
      songId: song.songId._id,
      position: song.position 
    })) || []
  });

  const { handleSavePlaylist } = usePlaylistMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await handleSavePlaylist({
        playlistData: formData,
        isEditMode: true,
        existingPlaylist: playlist,
        onSuccess: () => {
          toast.success("Playlist updated successfully");
          onSuccess?.();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update playlist");
        }
      });
    } catch (error) {
      console.error("Error updating playlist:", error);
      toast.error("Failed to update playlist");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Playlist</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter playlist name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter playlist description"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isPublic">Public</Label>
                <div className="text-sm text-gray-500">
                  Make this playlist visible to everyone
                </div>
              </div>
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isHero">Hero Playlist</Label>
                <div className="text-sm text-gray-500">
                  Feature this playlist on the home page
                </div>
              </div>
              <Switch
                id="isHero"
                checked={formData.isHero}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isHero: checked }))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}