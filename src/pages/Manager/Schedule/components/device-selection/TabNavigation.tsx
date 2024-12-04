import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="devices">Cihazlar</TabsTrigger>
        <TabsTrigger value="groups">Gruplar</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}