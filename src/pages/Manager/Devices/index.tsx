import { DeviceHeader } from "./components/DeviceHeader";
import { DeviceStats } from "./components/DeviceStats";
import { DeviceList } from "./components/DeviceList";
import { DeviceFilters } from "./components/DeviceFilters";
import { useState } from "react";
import { useDevices } from "./hooks/useDevices";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BranchGroupsTab } from "@/components/devices/BranchGroupsTab";

export default function Devices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const { devices, isLoading, error } = useDevices();

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-screen text-red-600">
      Cihazlar yüklenirken bir hata oluştu
    </div>
  );

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || device.status === statusFilter;
    const matchesType = typeFilter === "all" || device.category === typeFilter;
    const matchesLocation = locationFilter === "all" || device.location === locationFilter;

    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <DeviceHeader />
        <DeviceStats />
        
        <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm">
          <Tabs defaultValue="devices" className="w-full">
            <div className="border-b">
              <div className="px-6 pt-4">
                <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500">
                  <TabsTrigger 
                    value="devices"
                    className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                  >
                    Cihazlar
                  </TabsTrigger>
                  <TabsTrigger 
                    value="custom-groups"
                    className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                  >
                    Gruplar
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <TabsContent value="devices" className="p-6">
              <div className="space-y-6">
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
                
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
                  <ScrollArea className="h-[calc(100vh-480px)] rounded-lg">
                    <DeviceList devices={filteredDevices} />
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="custom-groups" className="p-6">
              <BranchGroupsTab />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}