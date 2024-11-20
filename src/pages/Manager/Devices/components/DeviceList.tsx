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

// Mock data for demonstration
const generateMockDevices = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    branchName: `Branch ${i + 1}`,
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
      <div className="flex gap-4">
        <Input
          placeholder="Search branches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
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

      <Card className="p-6">
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {currentDevices.map((device) => (
              <DeviceRow key={device.id} device={device} />
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex items-center justify-between mt-4 border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredDevices.length)} of{" "}
            {filteredDevices.length} devices
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}