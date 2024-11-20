import { Card } from "@/components/ui/card";
import { DeviceRow } from "./DeviceRow";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

// Mock data for demonstration
const generateMockDevices = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    branchName: `Branch ${i + 1}`,
    location: `Location ${i + 1}`, // Added location
    status: i % 3 === 0 ? "online" : "offline",
    ip: `192.168.1.${100 + i}`,
    lastSeen: "2024-03-20T10:00:00",
    systemInfo: {
      os: "Linux 5.15.0",
      memory: "4GB",
      storage: "64GB",
      version: "1.2.0",
    },
    schedule: {
      powerOn: "08:00",
      powerOff: "22:00",
    },
  }));
};

const mockDevices = generateMockDevices(500);

export function DeviceList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredDevices = mockDevices.filter(
    (device) =>
      device.branchName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || device.status === statusFilter)
  );

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const currentDevices = filteredDevices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search branches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Devices</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
        <ScrollArea className="h-[600px] rounded-lg">
          <div className="space-y-2 p-4">
            {currentDevices.map((device) => (
              <DeviceRow key={device.id} device={device} />
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredDevices.length)} of{" "}
            {filteredDevices.length} devices
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
