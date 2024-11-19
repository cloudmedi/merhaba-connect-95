import { useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreVertical } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    title: "",
    venue: "",
  });
  const { toast } = useToast();

  const handleAssignPlaylist = (playlistId: number, managerId: number) => {
    toast({
      title: "Playlist Assigned",
      description: `Playlist has been assigned to Manager ${managerId}`,
    });
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylist.title || !newPlaylist.venue) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be an API call
    const playlist = {
      id: playlists.length + 1,
      ...newPlaylist,
      assignedTo: [],
      status: "Active",
      createdAt: new Date().toISOString().split('T')[0],
    };

    toast({
      title: "Success",
      description: "Playlist created successfully",
    });

    setIsCreateDialogOpen(false);
    setNewPlaylist({ title: "", venue: "" });
  };

  return (
    <div className="flex h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Playlists</h1>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[#FFD700] text-black hover:bg-[#E6C200]"
                >
                  <Plus className="w-4 h-4 mr-2" /> Create New Playlist
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Playlist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Playlist Title</label>
                    <Input
                      placeholder="Enter playlist title"
                      value={newPlaylist.title}
                      onChange={(e) => setNewPlaylist(prev => ({...prev, title: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Venue</label>
                    <Input
                      placeholder="Enter venue"
                      value={newPlaylist.venue}
                      onChange={(e) => setNewPlaylist(prev => ({...prev, venue: e.target.value}))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    className="bg-[#FFD700] text-black hover:bg-[#E6C200]"
                    onClick={handleCreatePlaylist}
                  >
                    Create Playlist
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-6 flex gap-4">
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
                        <Dialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DialogTrigger asChild>
                                <DropdownMenuItem>Assign Managers</DropdownMenuItem>
                              </DialogTrigger>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Managers</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              {managers.map((manager) => (
                                <div key={manager.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                                  <div>
                                    <p className="font-medium">{manager.name}</p>
                                    <p className="text-sm text-gray-500">{manager.venue}</p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleAssignPlaylist(playlist.id, manager.id)}
                                  >
                                    Assign
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}