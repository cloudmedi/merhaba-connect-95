import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History } from "lucide-react";

// Mock data - Replace with actual API data
const playlistHistoryData = [
  {
    id: 1,
    store: "Sunny Chill House",
    playlist: "Jazz Hop Cafe",
    action: "Started",
    timestamp: "2024-02-25 14:30:00",
    manager: "John Doe",
  },
  {
    id: 2,
    store: "Beach Bar",
    playlist: "Summer Vibes",
    action: "Paused",
    timestamp: "2024-02-25 12:00:00",
    manager: "Jane Smith",
  },
];

export function PlaylistHistoryReport() {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <History className="h-5 w-5 text-[#9b87f5]" />
          <h2 className="text-lg font-semibold">Playlist Change History</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store</TableHead>
              <TableHead>Playlist</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Manager</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playlistHistoryData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.store}</TableCell>
                <TableCell>{item.playlist}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.action === "Started" 
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {item.action}
                  </span>
                </TableCell>
                <TableCell>{item.timestamp}</TableCell>
                <TableCell>{item.manager}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}