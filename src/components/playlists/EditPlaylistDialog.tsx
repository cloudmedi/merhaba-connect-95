import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlaylistForm } from "./PlaylistForm";
import { PlaylistTabs } from "./PlaylistTabs";
import { PlaylistSettings } from "./PlaylistSettings";
import { AssignManagersDialog } from "./AssignManagersDialog";
import { usePlaylistMutations } from "./hooks/usePlaylistMutations";
import { toast } from "sonner";
import type { Playlist } from "@/types/api";
import type { Manager } from "./types";

interface EditPlaylistDialogProps {
  playlist: Playlist;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditPlaylistDialog({ playlist, open, onOpenChange, onSuccess }: EditPlaylistDialogProps) {
  const { handleSavePlaylist } = usePlaylistMutations();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  const [playlistData, setPlaylistData] = useState({
    name: playlist.name,
    description: playlist.description || "",
    artwork: null as File | null,
    artworkUrl: playlist.artworkUrl || "",
    selectedSongs: playlist.songs || [],
    selectedGenres: playlist.genre ? [playlist.genre] : [],
    selectedCategories: playlist.categories || [],
    selectedMoods: playlist.mood ? [playlist.mood] : [],
    isCatalog: false,
    isPublic: playlist.isPublic,
    isHero: playlist.isHero,
    assignedManagers: [] as Manager[]
  });

  useEffect(() => {
    if (open && playlist.assignedManagers) {
      // Convert string[] to Manager[]
      const managers = playlist.assignedManagers.map(manager => {
        if (typeof manager === 'string') {
          return {
            _id: manager,
            id: manager,
            email: '',
            firstName: '',
            lastName: ''
          };
        }
        return manager;
      });
      
      setPlaylistData(prev => ({
        ...prev,
        assignedManagers: managers
      }));
    }
  }, [open, playlist.assignedManagers]);

  const handleManagerSelection = (selectedManagers: Manager[]) => {
    console.log('Selected managers:', selectedManagers);
    setPlaylistData(prev => ({
      ...prev,
      assignedManagers: selectedManagers
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Edit Playlist</DialogTitle>
        </DialogHeader>

        <div className="flex gap-6">
          <PlaylistForm 
            playlistData={playlistData} 
            setPlaylistData={setPlaylistData}
            isEditMode={true}
          />
          
          <div className="flex-1 space-y-6">
            <PlaylistSettings
              playlistData={playlistData}
              setPlaylistData={setPlaylistData}
            />

            <Button
              onClick={() => setIsAssignDialogOpen(true)}
              className="w-full bg-purple-100 text-purple-600 hover:bg-purple-200"
              size="lg"
            >
              {playlistData.assignedManagers.length > 0 
                ? `${playlistData.assignedManagers.length} Manager${playlistData.assignedManagers.length > 1 ? 's' : ''} Selected`
                : "Assign to Managers"}
            </Button>

            <PlaylistTabs
              playlistData={playlistData}
              setPlaylistData={setPlaylistData}
            />

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleSavePlaylist({
                playlistData,
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
              })}>
                Save Changes
              </Button>
            </div>

            <AssignManagersDialog
              open={isAssignDialogOpen}
              onOpenChange={setIsAssignDialogOpen}
              initialSelectedManagers={playlistData.assignedManagers}
              onManagersSelected={handleManagerSelection}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}