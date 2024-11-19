import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Music2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { TablePagination } from "../../Music/components/TablePagination";

// Mock data - Replace with actual API data
const generateMockData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    store: `Store ${i + 1}`,
    region: `Region ${Math.floor(i / 100) + 1}`,
    manager: `Manager ${Math.floor(i / 10) + 1}`,
    playlist: `Playlist ${(i % 5) + 1}`,
    activeSince: "2024-02-25 14:30:00",
    status: i % 3 === 0 ? "Playing" : i % 3 === 1 ? "Paused" : "Offline",
  }));
};

const activePlaylistsData = generateMockData(1000);

export function ActivePlaylistsReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = activePlaylistsData.filter(
    (item) =>
      item.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.playlist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Music2 className="h-5 w-5 text-[#9b87f5]" />
            <h2 className="text-lg font-semibold">Currently Active Playlists</h2>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Search stores, regions, managers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80"
            />
            <Button variant="outline">Export CSV</Button>
          </div>
        </div>

        <ScrollArea className="h-[600px] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Playlist</TableHead>
                <TableHead>Active Since</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.store}</TableCell>
                  <TableCell>{item.region}</TableCell>
                  <TableCell>{item.manager}</TableCell>
                  <TableCell>{item.playlist}</TableCell>
                  <TableCell>{item.activeSince}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "Playing"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Paused"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
        />
      </div>
    </Card>
  );
}