import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { TablePagination } from "../../Music/components/TablePagination";
import { ExportButtons } from "@/components/ExportButtons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data - Replace with actual API data
const generateMockData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    store: `Store ${i + 1}`,
    region: `Region ${Math.floor(i / 100) + 1}`,
    manager: `Manager ${Math.floor(i / 10) + 1}`,
    playlist: `Playlist ${(i % 5) + 1}`,
    action: i % 2 === 0 ? "Started" : "Stopped",
    timestamp: "2024-02-25 12:00:00",
  }));
};

const playlistHistoryData = generateMockData(1000);

export function PlaylistHistoryReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange, setTimeRange] = useState("today");
  const itemsPerPage = 10;

  const filteredData = playlistHistoryData.filter(
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

  const columns = ["store", "region", "manager", "playlist", "action", "timestamp"];

  return (
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-[#9b87f5]" />
            <h2 className="text-lg font-semibold">Playlist Change History</h2>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search stores, regions, managers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80"
            />
            <ExportButtons
              data={filteredData}
              columns={columns}
              fileName="playlist-history"
            />
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
                <TableHead>Action</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.store}</TableCell>
                  <TableCell>{item.region}</TableCell>
                  <TableCell>{item.manager}</TableCell>
                  <TableCell>{item.playlist}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.action === "Started"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.action}
                    </span>
                  </TableCell>
                  <TableCell>{item.timestamp}</TableCell>
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
