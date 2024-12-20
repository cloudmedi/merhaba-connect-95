import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Users } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="devices" className="flex items-center gap-2">
          <Monitor className="w-4 h-4" />
          Cihazlar
        </TabsTrigger>
        <TabsTrigger value="groups" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Gruplar
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}