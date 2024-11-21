import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical, Play } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Playlist {
  id: string;
  name: string;
  description?: string;
  artwork_url?: string;
  created_at: string;
  is_public: boolean;
  company?: {
    name: string;
  };
  profiles?: {
    first_name: string;
    last_name: string;
  }[];
}

interface PlaylistsTableProps {
  playlists: Playlist[];
  onPlay: (playlist: Playlist) => void;
  onEdit: (playlist: Playlist) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function PlaylistsTable({ playlists, onPlay, onEdit, onDelete, isLoading }: PlaylistsTableProps) {
  const { toast } = useToast();

  const getArtworkUrl = (url: string | null | undefined) => {
    if (!url) return "/placeholder.svg";
    
    // If it's already a Bunny CDN URL or any other full URL, return it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    return "/placeholder.svg";
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', id);

      if (error) throw error;

      onDelete(id);
      toast({
        title: "Success",
        description: "Playlist deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting playlist:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete playlist",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white border-none shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
            <div className="h-20 bg-gray-100 rounded animate-pulse" />
            <div className="h-20 bg-gray-100 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-none shadow-sm">
      <CardContent className="p-0">
        <ScrollArea className="w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[200px] font-medium">Title</TableHead>
                <TableHead className="min-w-[150px] hidden md:table-cell font-medium">Venue</TableHead>
                <TableHead className="min-w-[200px] hidden md:table-cell font-medium">Created By</TableHead>
                <TableHead className="min-w-[100px] font-medium">Status</TableHead>
                <TableHead className="min-w-[120px] hidden md:table-cell font-medium">Created At</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playlists.map((playlist) => (
                <TableRow key={playlist.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="relative group w-10 h-10">
                        <img
                          src={getArtworkUrl(playlist.artwork_url)}
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
                      ? `${playlist.profiles[0].first_name} ${playlist.profiles[0].last_name}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        playlist.is_public
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {playlist.is_public ? "Public" : "Private"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-600">
                    {new Date(playlist.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                          onClick={() => onEdit(playlist)}
                          className="cursor-pointer"
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(playlist.id)}
                          className="text-red-600 cursor-pointer"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {playlists.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 py-8"
                  >
                    No playlists added yet. Click "New Playlist" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}