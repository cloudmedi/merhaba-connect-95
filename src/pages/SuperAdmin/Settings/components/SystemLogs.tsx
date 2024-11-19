import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Log {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
  source: string;
}

const mockLogs: Log[] = [
  {
    id: "1",
    timestamp: "2024-02-25 14:30:00",
    level: "info",
    message: "User login successful",
    source: "AuthService",
  },
  {
    id: "2",
    timestamp: "2024-02-25 14:29:00",
    level: "warning",
    message: "High memory usage detected",
    source: "SystemMonitor",
  },
  {
    id: "3",
    timestamp: "2024-02-25 14:28:00",
    level: "error",
    message: "Failed to process payment",
    source: "PaymentService",
  },
];

export function SystemLogs() {
  const [filter, setFilter] = useState<"all" | "info" | "warning" | "error">("all");
  const [logs, setLogs] = useState<Log[]>(mockLogs);

  const filteredLogs = logs.filter(
    (log) => filter === "all" || log.level === filter
  );

  const getLevelColor = (level: Log["level"]) => {
    switch (level) {
      case "info":
        return "text-blue-600 bg-blue-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "error":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">System Logs</h2>
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
        <Button variant="outline" onClick={clearLogs}>
          Clear Logs
        </Button>
      </div>

      <ScrollArea className="h-[600px] rounded-lg border">
        <div className="space-y-2 p-4">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-4 p-3 rounded-lg bg-white border"
            >
              <span
                className={`px-2 py-1 rounded text-xs font-medium uppercase ${getLevelColor(
                  log.level
                )}`}
              >
                {log.level}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{log.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{log.timestamp}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{log.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}