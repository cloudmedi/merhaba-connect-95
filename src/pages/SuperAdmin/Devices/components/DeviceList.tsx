import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TablePagination } from "@/pages/SuperAdmin/Music/components/TablePagination";
import { useDevices } from "../hooks/useDevices";
import DataTableLoader from "@/components/loaders/DataTableLoader";
import { Badge } from "@/components/ui/badge";

export function DeviceList() {
  const [currentPage, setCurrentPage] = useState(1);
  const { devices, isLoading, error } = useDevices();
  const itemsPerPage = 10;

  if (isLoading) {
    return <DataTableLoader />;
  }

  if (error) {
    return <div>Error loading devices</div>;
  }

  const totalItems = devices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentDevices = devices.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
        <ScrollArea className="h-[600px] rounded-lg">
          <div className="space-y-2 p-4">
            {currentDevices.map((device) => (
              <Card key={device.id} className="p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{device.name}</h3>
                      <Badge 
                        variant={device.status === "online" ? "default" : "secondary"}
                        className={device.status === "online" ? "bg-green-500/10 text-green-500" : ""}
                      >
                        {device.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {device.branches?.company?.name} - {device.branches?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last seen: {new Date(device.last_seen || '').toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
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