import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DeviceRow } from "./DeviceRow";
import { DeviceStats } from "./DeviceStats";
import { DeviceFilters } from "./DeviceFilters";
import { BulkActions } from "./BulkActions";
import { TablePagination } from "@/pages/SuperAdmin/Music/components/TablePagination";
import { DeviceGroupManagement, DeviceGroup } from "./DeviceGroupManagement";
import { useDevices } from "../hooks/useDevices";
import { DataTableLoader } from "@/components/loaders/DataTableLoader";

export function DeviceList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deviceGroups, setDeviceGroups] = useState<DeviceGroup[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: '', direction: 'asc' });
  
  const { devices, isLoading, error, updateDevice, deleteDevice } = useDevices();
  const itemsPerPage = 10;

  const handleBulkPower = async () => {
    for (const id of selectedDevices) {
      await updateDevice.mutateAsync({
        id,
        status: 'online'
      });
    }
  };

  const handleBulkReset = async () => {
    for (const id of selectedDevices) {
      await updateDevice.mutateAsync({
        id,
        status: 'offline'
      });
    }
  };

  const handleBulkDelete = async () => {
    for (const id of selectedDevices) {
      await deleteDevice.mutateAsync(id);
    }
    setSelectedDevices([]);
  };

  const filteredDevices = devices.filter(
    (device) =>
      (device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.branch?.location?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || device.status === statusFilter) &&
      (categoryFilter === "all" || device.category === categoryFilter) &&
      (locationFilter === "all" || device.branch?.location?.toLowerCase().includes(locationFilter.toLowerCase()))
  );

  const sortedDevices = [...filteredDevices].sort((a: any, b: any) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalItems = sortedDevices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentDevices = sortedDevices.slice(startIndex, endIndex);

  const onlineDevices = devices.filter(d => d.status === "online").length;
  const offlineDevices = devices.length - onlineDevices;

  const handleCreateGroup = (group: DeviceGroup) => {
    setDeviceGroups(prev => [...prev, group]);
  };

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (isLoading) {
    return <DataTableLoader />;
  }

  if (error) {
    return <div>Error loading devices</div>;
  }

  return (
    <div className="space-y-4">
      <DeviceStats
        totalDevices={devices.length}
        onlineDevices={onlineDevices}
        offlineDevices={offlineDevices}
        lastUpdated={new Date().toLocaleString()}
      />

      <div className="flex items-center justify-between gap-4 flex-wrap">
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
        
        <div className="flex items-center gap-2 flex-wrap">
          <DeviceGroupManagement onCreateGroup={handleCreateGroup} />
          <BulkActions
            selectedDevices={selectedDevices}
            onPowerAll={handleBulkPower}
            onResetAll={handleBulkReset}
            onDeleteAll={handleBulkDelete}
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
    </div>
  );
}