import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlaylistForm } from "./PlaylistForm";
import { PlaylistTabs } from "./PlaylistTabs";
import { PlaylistSettings } from "./PlaylistSettings";
import { AssignManagersDialog } from "./AssignManagersDialog";
import { usePlaylistMutations } from "./hooks/usePlaylistMutations";
import { usePlaylistAssignment } from "./hooks/usePlaylistAssignment";
import { Users } from "lucide-react";
import { useState, useEffect } from "react";
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
  const { isAssignDialogOpen, setIsAssignDialogOpen, handleAssignManagers } = 
    usePlaylistAssignment(playlist._id);

  const transformSongs = (songs: any[]) => {
    return songs.map(song => ({
      _id: song.songId._id,
      title: song.songId.title,
      artist: song.songId.artist,
      album: song.songId.album,
      duration: song.songId.duration,
      fileUrl: song.songId.fileUrl,
      artworkUrl: song.songId.artworkUrl
    }));
  };

  const [playlistData, setPlaylistData] = useState({
    name: "",
    description: "",
    artwork: null as File | null,
    artworkUrl: "",
    selectedSongs: [],
    selectedGenres: [],
    selectedCategories: [],
    selectedMoods: [],
    isCatalog: false,
    isPublic: false,
    isHero: false,
    assignedManagers: [] as Manager[]
  });

  useEffect(() => {
    if (playlist) {
      console.log('Loading playlist data:', playlist);
      setPlaylistData({
        name: playlist.name,
        description: playlist.description || "",
        artwork: null,
        artworkUrl: playlist.artworkUrl || "",
        selectedSongs: playlist.songs ? transformSongs(playlist.songs) : [],
        selectedGenres: playlist.genre ? [playlist.genre] : [],
        selectedCategories: playlist.categories || [],
        selectedMoods: playlist.mood ? [playlist.mood] : [],
        isCatalog: false,
        isPublic: playlist.isPublic,
        isHero: playlist.isHero,
        assignedManagers: (playlist.assignedManagers || []).map(id => ({
          _id: id,
          id: id,
          email: "",
          firstName: null,
          lastName: null,
          first_name: null,
          last_name: null
        }))
      });
    }
  }, [playlist]);

  const handleSubmit = async () => {
    try {
      await handleSavePlaylist({
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
      });
    } catch (error) {
      console.error("Error updating playlist:", error);
      toast.error("Failed to update playlist");
    }
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
              <Users className="w-4 h-4 mr-2" />
              {playlistData.assignedManagers.length > 0 
                ? `Assigned to ${playlistData.assignedManagers.length} Manager${playlistData.assignedManagers.length > 1 ? 's' : ''}`
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
              <Button onClick={handleSubmit}>
                Save Changes
              </Button>
            </div>

            <AssignManagersDialog
              open={isAssignDialogOpen}
              onOpenChange={setIsAssignDialogOpen}
              playlistId={playlist._id}
              initialSelectedManagers={playlistData.assignedManagers}
              onAssign={handleAssignManagers}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
