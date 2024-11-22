import { useState } from "react";
import { useDevices } from "./hooks/useDevices";
import { DeviceList } from "./components/DeviceList";
import { DeviceHeader } from "./components/DeviceHeader";
import { DeviceFilters } from "./components/DeviceFilters";
import { DeviceStats } from "./components/DeviceStats";
import { DeviceGroups } from "./components/DeviceGroups";
import { BranchGroupsTab } from "@/components/devices/BranchGroupsTab";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import DataTableLoader from "@/components/loaders/DataTableLoader";

export default function Devices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const { devices, isLoading, error } = useDevices();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Devices</h3>
        <p className="text-sm text-gray-500">Please try refreshing the page.</p>
      </div>
    );
  }

  const filteredDevices = devices?.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || device.status === statusFilter;
    const matchesType = typeFilter === "all" || device.category === typeFilter;
    const matchesLocation = locationFilter === "all" || device.location === locationFilter;

    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  }) || [];

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
      <img 
        src="/placeholder.svg" 
        alt="No devices" 
        className="w-32 h-32 mb-4 opacity-50"
      />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No devices found</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">
        Get started by adding your first device. You can manage all your devices from here.
      </p>
      <Button className="bg-purple-600 hover:bg-purple-700">
        <Plus className="w-4 h-4 mr-2" />
        Add New Device
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 p-6 bg-gray-50/30 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Devices</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your connected devices</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Device
        </Button>
      </div>

      <DeviceStats />
      
      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="mb-4 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="auto-groups">Auto Groups</TabsTrigger>
          <TabsTrigger value="custom-groups">Custom Groups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devices" className="space-y-6">
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
          
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
            <ScrollArea className="h-[calc(100vh-400px)] rounded-lg">
              {isLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                </div>
              ) : filteredDevices.length === 0 ? (
                <EmptyState />
              ) : (
                <DeviceList devices={filteredDevices} />
              )}
            </ScrollArea>
          </Card>
        </TabsContent>
        
        <TabsContent value="auto-groups">
          <DeviceGroups />
        </TabsContent>
        
        <TabsContent value="custom-groups">
          <BranchGroupsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}