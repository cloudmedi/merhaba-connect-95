import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface PlaylistSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlaylistSelect: (playlist: any) => void;
}

export function PlaylistSelectionDialog({
  open,
  onOpenChange,
  onPlaylistSelect,
}: PlaylistSelectionDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: playlists = [], isLoading } = useQuery({
    queryKey: ['available-playlists', searchQuery],
    queryFn: async () => {
      const { data } = await api.get('/admin/playlists', {
        params: {
          search: searchQuery,
          isPublic: true
        }
      });
      return data;
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Playlist</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <ScrollArea className="h-[300px] mt-4">
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">Loading playlists...</div>
            ) : playlists.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No playlists found</div>
            ) : (
              playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="p-3 flex items-center space-x-3 rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => {
                    onPlaylistSelect(playlist);
                    onOpenChange(false);
                  }}
                >
                  <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0">
                    {playlist.artworkUrl && (
                      <img
                        src={playlist.artworkUrl}
                        alt={playlist.name}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{playlist.name}</p>
                    <p className="text-sm text-gray-500">
                      {playlist.isPublic ? "Public Playlist" : "Company Playlist"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}