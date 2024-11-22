import { useState } from "react";
import { useDevices } from "./hooks/useDevices";
import { DeviceList } from "./components/DeviceList";
import { DeviceHeader } from "./components/DeviceHeader";
import { DeviceFilters } from "./components/DeviceFilters";
import { DeviceStats } from "./components/DeviceStats";
import { DeviceGroups } from "./components/DeviceGroups";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import DataTableLoader from "@/components/loaders/DataTableLoader";

export default function Devices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const { devices, isLoading, error } = useDevices();

  if (isLoading) return <DataTableLoader />;
  if (error) return <div>Error loading devices</div>;

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || device.status === statusFilter;
    const matchesType = typeFilter === "all" || device.category === typeFilter;
    const matchesLocation = locationFilter === "all" || device.location === locationFilter;

    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <DeviceHeader />
      <DeviceStats />
      <DeviceGroups />
      <DeviceFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        locationFilter={locationFilter}
        onLocationFilterChange={setLocationFilter}
      />
      <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
        <ScrollArea className="h-[calc(100vh-680px)] rounded-lg">
          <DeviceList devices={filteredDevices} />
        </ScrollArea>
      </Card>
    </div>
  );
}