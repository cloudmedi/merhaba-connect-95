import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreVertical } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CreatePlaylist } from "@/components/playlists/CreatePlaylist";
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
import { useNavigate, Routes, Route } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

// Mock data - In a real app, this would come from an API
const managers = [
  { id: 1, name: "Manager 1", venue: "Sunny Chill House" },
  { id: 2, name: "Manager 2", venue: "Beach Club" },
  { id: 3, name: "Manager 3", venue: "Mountain Resort" },
];

const playlists = [
  {
    id: 1,
    title: "Jazz Hop Cafe",
    venue: "Sunny Chill House",
    assignedTo: ["Manager 1", "Manager 2"],
    status: "Active",
    createdAt: "2024-02-20",
  },
  {
    id: 2,
    title: "Slap House Jam",
    venue: "Sunny Chill House",
    assignedTo: ["Manager 3"],
    status: "Active",
    createdAt: "2024-02-19",
  },
  {
    id: 3,
    title: "Colombia - Salsa",
    venue: "Sunny Chill House",
    assignedTo: ["Manager 1"],
    status: "Inactive",
    createdAt: "2024-02-18",
  },
];

export default function Playlists() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAssignPlaylist = (playlistId: number, managerId: number) => {
    toast({
      title: "Playlist Atandı",
      description: `Playlist, Yönetici ${managerId}'ye atandı`,
    });
  };

  const PlaylistsContent = () => (
    <DashboardLayout 
      title="Playlists" 
      description="Manage and organize your playlists"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button 
            onClick={() => navigate("create")}
            className="bg-[#FFD700] text-black hover:bg-[#E6C200]"
          >
            <Plus className="w-4 h-4 mr-2" /> Yeni Playlist Oluştur
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Search playlists..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playlists.map((playlist) => (
                  <TableRow key={playlist.id}>
                    <TableCell className="font-medium">{playlist.title}</TableCell>
                    <TableCell>{playlist.venue}</TableCell>
                    <TableCell>{playlist.assignedTo.join(", ")}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          playlist.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {playlist.status}
                      </span>
                    </TableCell>
                    <TableCell>{playlist.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {playlists.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                      No playlists added yet. Click "New Playlist" to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );

  return (
    <Routes>
      <Route path="/" element={<PlaylistsContent />} />
      <Route
        path="create"
        element={
          <DashboardLayout 
            title="Create Playlist" 
            description="Create a new playlist"
          >
            <CreatePlaylist />
          </DashboardLayout>
        }
      />
    </Routes>
  );
}
