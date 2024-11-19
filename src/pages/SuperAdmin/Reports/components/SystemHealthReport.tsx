import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Signal, AlertTriangle, Clock } from "lucide-react";
import { useState } from "react";
import { TablePagination } from "../../Music/components/TablePagination";
import { ExportButtons } from "@/components/ExportButtons";

interface PlayerStatus {
  id: string;
  storeName: string;
  region: string;
  status: "online" | "offline";
  lastSeen: string;
  version: string;
  health: "healthy" | "warning" | "critical";
  cpu: number;
  memory: number;
  storage: number;
  networkLatency: number;
  lastRestart: string;
  errorLogs: number;
}

// Mock data generator for demonstration
const generateMockData = (count: number): PlayerStatus[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `store-${i + 1}`,
    storeName: `Store ${i + 1}`,
    region: `Region ${Math.floor(i / 100) + 1}`,
    status: Math.random() > 0.2 ? "online" : "offline",
    lastSeen: Math.random() > 0.2 ? "Active now" : `${Math.floor(Math.random() * 24)} hours ago`,
    version: "1.2.0",
    health: Math.random() > 0.8 ? "critical" : Math.random() > 0.6 ? "warning" : "healthy",
    cpu: Math.floor(Math.random() * 100),
    memory: Math.floor(Math.random() * 100),
    storage: Math.floor(Math.random() * 100),
    networkLatency: Math.floor(Math.random() * 200),
    lastRestart: "2024-02-25 12:00:00",
    errorLogs: Math.floor(Math.random() * 10),
  }));
};

export function SystemHealthReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [healthFilter, setHealthFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const playerStatuses = generateMockData(1000);

  const filteredData = playerStatuses.filter(
    (item) =>
      (item.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.region.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (healthFilter === "all" || item.health === healthFilter) &&
      (statusFilter === "all" || item.status === statusFilter)
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredData.slice(startIndex, endIndex);

  const columns = [
    "storeName",
    "region",
    "status",
    "health",
    "version",
    "cpu",
    "memory",
    "storage",
    "networkLatency",
    "lastRestart",
    "errorLogs",
  ];

  return (
    <Card>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Online Status</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {playerStatuses.filter((p) => p.status === "online").length}/{playerStatuses.length}
                  </h3>
                  <p className="text-xs text-emerald-600 mt-2">
                    {Math.round((playerStatuses.filter((p) => p.status === "online").length / playerStatuses.length) * 100)}% connected
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Signal className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">System Health</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {playerStatuses.filter((p) => p.health === "healthy").length}/{playerStatuses.length}
                  </h3>
                  <p className="text-xs text-emerald-600 mt-2">
                    {Math.round((playerStatuses.filter((p) => p.health === "healthy").length / playerStatuses.length) * 100)}% healthy
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Critical Issues</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {playerStatuses.filter((p) => p.health === "critical").length}
                  </h3>
                  <p className="text-xs text-red-600 mt-2">
                    Requires immediate attention
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Average Uptime</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">99.9%</h3>
                  <p className="text-xs text-emerald-600 mt-2">Last 30 days</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full md:w-auto">
            <Select value={healthFilter} onValueChange={setHealthFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by health" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Health Status</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Input
              placeholder="Search stores or regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80"
            />
            <ExportButtons
              data={filteredData}
              columns={columns}
              fileName="system-health-report"
            />
          </div>
        </div>

        <ScrollArea className="h-[600px] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Last Restart</TableHead>
                <TableHead>Error Logs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.storeName}</TableCell>
                  <TableCell>{item.region}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "online"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.health === "healthy"
                          ? "bg-green-100 text-green-800"
                          : item.health === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.health}
                    </span>
                  </TableCell>
                  <TableCell>{item.version}</TableCell>
                  <TableCell>{item.cpu}%</TableCell>
                  <TableCell>{item.memory}%</TableCell>
                  <TableCell>{item.storage}%</TableCell>
                  <TableCell>{item.networkLatency}ms</TableCell>
                  <TableCell>{item.lastRestart}</TableCell>
                  <TableCell>{item.errorLogs}</TableCell>
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
