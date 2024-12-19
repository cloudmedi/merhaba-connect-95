import { Button } from "@/components/ui/button";
import { MoreVertical, Play, Globe, Lock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createPlaylistAssignmentNotification } from "@/utils/notifications";

// MongoDB yapısına uygun interface
interface PlaylistRowProps {
  playlist: {
    _id: string;  // MongoDB'de _id kullanılır
    name: string;
    artworkUrl?: string;  // MongoDB'deki field adı
    createdAt: string;    // MongoDB'de camelCase kullanılır
    isPublic: boolean;    // MongoDB'de camelCase kullanılır
    company?: { 
      name: string;
      _id: string;
    };
    profiles?: { 
      firstName: string;  // MongoDB'de camelCase kullanılır
      lastName: string;   // MongoDB'de camelCase kullanılır
      _id: string;
    }[];
  };
  onPlay: (playlist: any) => void;
  onEdit: (playlist: any) => void;
  onDelete: (id: string) => void;
  onStatusChange: () => void;
}

export function PlaylistRow({ playlist, onPlay, onEdit, onDelete, onStatusChange }: PlaylistRowProps) {
  const { toast } = useToast();
  
  const getArtworkUrl = (url: string | null | undefined) => {
    if (!url) return "/placeholder.svg";
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (!url.includes('://')) return `https://cloud-media.b-cdn.net/${url}`;
    return "/placeholder.svg";
  };

  const handleEdit = () => {
    console.log('Editing playlist:', playlist);
    if (!playlist || !playlist._id) {
      console.error('Invalid playlist data for editing:', playlist);
      toast({
        title: "Error",
        description: "Cannot edit playlist: Invalid playlist data",
        variant: "destructive",
      });
      return;
    }
    onEdit({
      _id: playlist._id,
      name: playlist.name,
      artworkUrl: playlist.artworkUrl,
      isPublic: playlist.isPublic,
    });
  };

  const handlePublishToggle = async () => {
    try {
      // Supabase'e gönderirken field adlarını Supabase formatına çeviriyoruz
      const { error } = await supabase
        .from('playlists')
        .update({ 
          is_public: !playlist.isPublic  // Supabase'de snake_case kullanılır
        })
        .eq('id', playlist._id);  // Supabase'de 'id' kullanılır

      if (error) throw error;

      if (!playlist.isPublic) {
        const { data: managers, error: managersError } = await supabase
          .from('profiles')
          .select('id')  // Supabase'de 'id' kullanılır
          .eq('role', 'manager');

        if (managersError) throw managersError;

        for (const manager of managers) {
          await createPlaylistAssignmentNotification(
            manager.id,
            playlist.name,
            playlist._id,
            playlist.artworkUrl
          );
        }
      }

      toast({
        title: "Success",
        description: `Playlist ${playlist.isPublic ? 'unpublished' : 'published'} successfully`,
      });

      onStatusChange();
    } catch (error: any) {
      console.error('Error toggling playlist publish state:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update playlist",
        variant: "destructive",
      });
    }
  };

  return (
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
            <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
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
  );
}