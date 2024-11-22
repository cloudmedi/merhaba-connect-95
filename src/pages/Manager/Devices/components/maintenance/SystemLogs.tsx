import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface Log {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
  source: string;
}

const logs: Log[] = [
  {
    id: "1",
    timestamp: "2024-02-25 14:30:00",
    level: "info",
    message: "System startup successful",
    source: "System"
  },
  {
    id: "2",
    timestamp: "2024-02-25 14:29:00",
    level: "warning",
    message: "High memory usage detected",
    source: "Monitor"
  },
  {
    id: "3",
    timestamp: "2024-02-25 14:28:00",
    level: "error",
    message: "Failed to connect to update server",
    source: "Updater"
  }
];

export function SystemLogs() {
  const [filter, setFilter] = useState<"all" | "info" | "warning" | "error">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getIcon = (level: Log["level"]) => {
    switch (level) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      (filter === "all" || log.level === filter) &&
      (log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.source.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <ScrollArea className="h-[500px]">
          <div className="p-4 space-y-2">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50"
              >
                {getIcon(log.level)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{log.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{log.timestamp}</span>
                    <Badge variant="outline">{log.source}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}