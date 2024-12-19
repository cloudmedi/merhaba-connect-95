import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManagerList } from "./ManagerList";
import { Manager } from "../types";

interface AssignManagersContentProps {
  managers: Manager[];
  selectedManagers: Manager[];
  onSelectManager: (manager: Manager) => void;
  isLoading: boolean;
}

export function AssignManagersContent({
  managers,
  selectedManagers,
  onSelectManager,
  isLoading
}: AssignManagersContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("assigned");

  const filteredManagers = activeTab === "assigned" 
    ? selectedManagers
    : managers.filter(m => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return (
          m.email?.toLowerCase().includes(searchLower) ||
          m.firstName?.toLowerCase().includes(searchLower) ||
          m.lastName?.toLowerCase().includes(searchLower)
        );
      });

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="assigned" className="relative">
          Assigned Managers
          {selectedManagers.length > 0 && (
            <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-600">
              {selectedManagers.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="all">All Managers</TabsTrigger>
      </TabsList>

      <TabsContent value="assigned" className="mt-4">
        {selectedManagers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No managers assigned yet
          </div>
        ) : (
          <ManagerList
            managers={filteredManagers}
            selectedManagers={selectedManagers}
            onSelectManager={onSelectManager}
            isLoading={isLoading}
          />
        )}
      </TabsContent>

      <TabsContent value="all" className="mt-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search managers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <ManagerList
          managers={filteredManagers}
          selectedManagers={selectedManagers}
          onSelectManager={onSelectManager}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
}