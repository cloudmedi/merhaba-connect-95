import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DeviceRow } from "./DeviceRow";
import { DeviceStats } from "./DeviceStats";
import { DeviceFilters } from "./DeviceFilters";
import { BulkActions } from "./BulkActions";
import { TablePagination } from "@/pages/SuperAdmin/Music/components/TablePagination";
import { useToast } from "@/components/ui/use-toast";
import { DeviceGroupDialog } from "./DeviceGroupDialog";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

// Mock data generation
const generateMockDevices = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    branchName: `Branch ${i + 1}`,
    location: `Region ${Math.floor(i / 100) + 1}`,
    category: i % 3 === 0 ? "player" : i % 3 === 1 ? "display" : "controller",
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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [deviceGroups, setDeviceGroups] = useState<Array<{
    id: string;
    name: string;
    deviceIds: string[];
    description?: string;
  }>>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: '', direction: 'asc' });
  
  const itemsPerPage = 10;

  const filteredDevices = mockDevices.filter(
    (device) =>
      (device.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || device.status === statusFilter) &&
      (categoryFilter === "all" || device.category === categoryFilter) &&
      (locationFilter === "all" || device.location.toLowerCase().includes(locationFilter.toLowerCase()))
  );

  const totalItems = filteredDevices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentDevices = filteredDevices.slice(startIndex, endIndex);

  const handleCreateGroup = (group: { name: string; description: string; deviceIds: string[] }) => {
    const newGroup = {
      id: crypto.randomUUID(),
      ...group
    };
    
    setDeviceGroups(prev => [...prev, newGroup]);
    toast({
      title: "Success",
      description: `Created group "${group.name}" with ${group.deviceIds.length} devices`,
    });
  };

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="space-y-4">
      <DeviceStats
        totalDevices={mockDevices.length}
        onlineDevices={mockDevices.filter(d => d.status === "online").length}
        offlineDevices={mockDevices.length - mockDevices.filter(d => d.status === "online").length}
        lastUpdated={new Date().toLocaleString()}
      />

      <div className="flex items-center justify-between gap-4">
        <DeviceFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          locationFilter={locationFilter}
          onLocationFilterChange={setLocationFilter}
          onExport={() => {}}
          data={filteredDevices}
          columns={[]}
        />
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsGroupDialogOpen(true)}
            disabled={selectedDevices.length === 0}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Create Group ({selectedDevices.length})
          </Button>
          <BulkActions
            selectedDevices={selectedDevices}
            onPowerAll={() => toast({ title: "Success", description: "Power command sent" })}
            onResetAll={() => toast({ title: "Success", description: "Reset command sent" })}
            onDeleteAll={() => {
              setSelectedDevices([]);
              toast({ title: "Success", description: "Devices deleted" });
            }}
          />
        </div>
      </div>

      <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
        <ScrollArea className="h-[600px] rounded-lg">
          <div className="space-y-2 p-4">
            {currentDevices.map((device) => (
              <DeviceRow
                key={device.id}
                device={device}
                isSelected={selectedDevices.includes(device.id)}
                onSelect={(checked) => {
                  setSelectedDevices(prev =>
                    checked
                      ? [...prev, device.id]
                      : prev.filter(id => id !== device.id)
                  );
                }}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            ))}
          </div>
        </ScrollArea>
        
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
        />
      </Card>

      <DeviceGroupDialog
        isOpen={isGroupDialogOpen}
        onClose={() => setIsGroupDialogOpen(false)}
        selectedDevices={selectedDevices}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
}
