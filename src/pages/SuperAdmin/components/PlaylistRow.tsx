import { Button } from "@/components/ui/button";
import { MoreVertical, Play, Globe, Lock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { EditPlaylistDialog } from "@/components/playlists/EditPlaylistDialog";
import { useState } from "react";
import axios from "@/lib/axios";
import type { Playlist } from "@/types/api";

interface PlaylistRowProps {
  playlist: Playlist;
  onPlay: (playlist: Playlist) => void;
  onDelete: (id: string) => void;
  onStatusChange: () => void;
}

export function PlaylistRow({ playlist, onPlay, onDelete, onStatusChange }: PlaylistRowProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const getArtworkUrl = (url: string | null | undefined) => {
    if (!url) return "/placeholder.svg";
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (!url.includes('://')) return `https://cloud-media.b-cdn.net/${url}`;
    return "/placeholder.svg";
  };

  const handlePublishToggle = async () => {
    try {
      const response = await axios.put(`/admin/playlists/${playlist._id}`, {
        isPublic: !playlist.isPublic
      });

      if (response.data) {
        toast.success(`Playlist ${playlist.isPublic ? 'unpublished' : 'published'} successfully`);
        onStatusChange();
      }
    } catch (error: any) {
      console.error('Error toggling playlist publish state:', error);
      toast.error(error.message || "Failed to update playlist");
    }
  };

  return (
    <>
      <TableRow key={playlist._id} className="hover:bg-gray-50/50">
        <TableCell>
          <div className="flex items-center gap-4">
            <div className="relative group w-10 h-10">
              <img
                src={getArtworkUrl(playlist.artworkUrl)}
                alt={playlist.name}
                className="w-full h-full object-cover rounded group-hover:opacity-75 transition-opacity"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-6 h-6 rounded-full bg-black/50 hover:bg-black/70"
                  onClick={() => onPlay(playlist)}
                >
                  <Play className="w-3 h-3 text-white" />
                </Button>
              </div>
            </div>
            <span className="font-medium text-gray-900">{playlist.name}</span>
          </div>
        </TableCell>
        <TableCell className="hidden md:table-cell text-gray-600">
          {playlist.company?.name || "N/A"}
        </TableCell>
        <TableCell className="hidden md:table-cell text-gray-600">
          {playlist.profiles?.[0]
            ? `${playlist.profiles[0].firstName} ${playlist.profiles[0].lastName}`
            : "N/A"}
        </TableCell>
        <TableCell>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
              playlist.isPublic
                ? "bg-emerald-100 text-emerald-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {playlist.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {playlist.isPublic ? "Public" : "Private"}
          </span>
        </TableCell>
        <TableCell className="hidden md:table-cell text-gray-600">
          {new Date(playlist.createdAt).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)} className="cursor-pointer">
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePublishToggle} className="cursor-pointer">
                {playlist.isPublic ? "Unpublish" : "Publish"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(playlist._id)} className="text-red-600 cursor-pointer">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <EditPlaylistDialog
        playlist={playlist}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={onStatusChange}
      />
    </>
  );
}