import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserSquare2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { TablePagination } from "../../Music/components/TablePagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExportButtons } from "@/components/ExportButtons";

// Mock data - Replace with actual API data
const generateMockData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    manager: `Manager ${Math.floor(i / 10) + 1}`,
    store: `Store ${i + 1}`,
    region: `Region ${Math.floor(i / 100) + 1}`,
    action: i % 3 === 0 ? "Login" : i % 3 === 1 ? "Playlist Change" : "Settings Update",
    timestamp: "2024-02-25 12:00:00",
    details: i % 3 === 0 
      ? "Windows Player Login" 
      : i % 3 === 1 
      ? "Changed to Summer Vibes" 
      : "Updated volume settings",
    ipAddress: `192.168.${Math.floor(i / 255)}.${i % 255}`,
  }));
};

const managerActivityData = generateMockData(1000);

export function ManagerActivityReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange, setTimeRange] = useState("today");
  const [actionFilter, setActionFilter] = useState("all");
  const itemsPerPage = 10;

  const filteredData = managerActivityData.filter(
    (item) =>
      (item.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.details.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (actionFilter === "all" || item.action === actionFilter)
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredData.slice(startIndex, endIndex);

  const columns = [
    "manager",
    "store",
    "region",
    "action",
    "details",
    "ipAddress",
    "timestamp"
  ];

  return (
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <UserSquare2 className="h-5 w-5 text-[#9b87f5]" />
            <h2 className="text-lg font-semibold">Manager Activity Logs</h2>
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
              placeholder="Search managers, stores, regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80"
            />
            <ExportButtons
              data={filteredData}
              columns={columns}
              fileName="manager-activity"
            />
          </div>
        </div>

        <ScrollArea className="h-[600px] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Manager</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.manager}</TableCell>
                  <TableCell>{item.store}</TableCell>
                  <TableCell>{item.region}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.action === "Login"
                          ? "bg-blue-100 text-blue-800"
                          : item.action === "Playlist Change"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {item.action}
                    </span>
                  </TableCell>
                  <TableCell>{item.details}</TableCell>
                  <TableCell>{item.ipAddress}</TableCell>
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
