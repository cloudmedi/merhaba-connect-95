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
import DataTableLoader from "@/components/loaders/DataTableLoader";
import { useTranslation } from "react-i18next";

export default function Devices() {
  const { t } = useTranslation();
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

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed">
      <img 
        src="/placeholder.svg" 
        alt="No devices" 
        className="w-32 h-32 mb-4 opacity-50"
      />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('devices.noDevicesFound')}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">
        {t('devices.noDevicesDescription')}
      </p>
      <Button>
        <Plus className="w-4 h-4 mr-2" />
        {t('devices.addDevice')}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <DeviceHeader />
      <DeviceStats />
      
      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="devices">{t('devices.tabs.devices')}</TabsTrigger>
          <TabsTrigger value="auto-groups">{t('devices.tabs.autoGroups')}</TabsTrigger>
          <TabsTrigger value="custom-groups">{t('devices.tabs.customGroups')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devices">
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
            
            <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
              <ScrollArea className="h-[calc(100vh-680px)] rounded-lg">
                {filteredDevices.length === 0 ? (
                  <EmptyState />
                ) : (
                  <DeviceList devices={filteredDevices} />
                )}
              </ScrollArea>
            </Card>
          </div>
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