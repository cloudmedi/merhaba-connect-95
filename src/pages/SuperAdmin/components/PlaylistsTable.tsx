import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaylistRow } from "./PlaylistRow";
import { useQueryClient } from "@tanstack/react-query";

interface PlaylistsTableProps {
  playlists: any[];
  onPlay: (playlist: any) => void;
  onEdit: (playlist: any) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function PlaylistsTable({ playlists, onPlay, onEdit, onDelete, isLoading }: PlaylistsTableProps) {
  const queryClient = useQueryClient();

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

  const handleStatusChange = () => {
    queryClient.invalidateQueries({ queryKey: ['playlists'] });
  };

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
                <PlaylistRow
                  key={playlist.id}
                  playlist={playlist}
                  onPlay={onPlay}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={handleStatusChange}
                />
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