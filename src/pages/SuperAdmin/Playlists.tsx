import { useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreVertical } from "lucide-react";
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

  return (
    <div className="flex h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Playlists</h1>
            <Button className="bg-[#FFD700] text-black hover:bg-[#E6C200]">
              <Plus className="w-4 h-4 mr-2" /> Create New Playlist
            </Button>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Assign Managers</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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