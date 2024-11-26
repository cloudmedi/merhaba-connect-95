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
import { Plus } from "lucide-react";

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

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
      <img 
        src="/placeholder.svg" 
        alt="No devices" 
        className="w-32 h-32 mb-4 opacity-50"
      />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Cihaz bulunamadı</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">
        İlk cihazınızı ekleyerek başlayın. Tüm cihazlarınızı buradan yönetebilirsiniz.
      </p>
      <Button className="bg-[#6E59A5] hover:bg-[#5A478A] text-white">
        <Plus className="w-4 h-4 mr-2" />
        Yeni Cihaz Ekle
      </Button>
    </div>
  );

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
                    value="auto-groups"
                    className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                  >
                    Otomatik Gruplar
                  </TabsTrigger>
                  <TabsTrigger 
                    value="custom-groups"
                    className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                  >
                    Özel Gruplar
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
                    {filteredDevices.length === 0 ? (
                      <EmptyState />
                    ) : (
                      <DeviceList devices={filteredDevices} />
                    )}
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="auto-groups" className="p-6">
              <DeviceGroups />
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