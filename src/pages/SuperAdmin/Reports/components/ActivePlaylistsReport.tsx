import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Music2 } from "lucide-react";

// Mock data - Replace with actual API data
const activePlaylistsData = [
  {
    id: 1,
    store: "Sunny Chill House",
    playlist: "Jazz Hop Cafe",
    activeSince: "2024-02-25 14:30:00",
    status: "Playing",
  },
  {
    id: 2,
    store: "Beach Bar",
    playlist: "Summer Vibes",
    activeSince: "2024-02-25 12:00:00",
    status: "Paused",
  },
];

export function ActivePlaylistsReport() {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Music2 className="h-5 w-5 text-[#9b87f5]" />
          <h2 className="text-lg font-semibold">Currently Active Playlists</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store</TableHead>
              <TableHead>Playlist</TableHead>
              <TableHead>Active Since</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activePlaylistsData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.store}</TableCell>
                <TableCell>{item.playlist}</TableCell>
                <TableCell>{item.activeSince}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === "Playing" 
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {item.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}