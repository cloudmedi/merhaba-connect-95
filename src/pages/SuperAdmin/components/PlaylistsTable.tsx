import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import { TrackArtwork } from "@/components/music/TrackArtwork";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PlaylistsTableProps {
  playlists: any[];
  onPlay: (playlist: any) => void;
  onEdit: (playlist: any) => void;
}

export function PlaylistsTable({ playlists, onPlay, onEdit }: PlaylistsTableProps) {
  return (
    <Card className="bg-white border-none shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px] font-medium">Title</TableHead>
              <TableHead className="font-medium">Venue</TableHead>
              <TableHead className="font-medium">Assigned To</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Created At</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playlists.map((playlist) => (
              <TableRow key={playlist.id} className="hover:bg-gray-50/50">
                <TableCell>
                  <div className="flex items-center gap-4">
                    <TrackArtwork
                      artwork={playlist.artwork}
                      title={playlist.title}
                      onPlay={() => onPlay(playlist)}
                    />
                    <span className="font-medium text-gray-900">{playlist.title}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{playlist.venue}</TableCell>
                <TableCell className="text-gray-600">
                  {playlist.assignedTo.join(", ")}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      playlist.status === "Active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {playlist.status}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600">{playlist.createdAt}</TableCell>
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
                      <DropdownMenuItem className="text-red-600 cursor-pointer">
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
      </CardContent>
    </Card>
  );
}