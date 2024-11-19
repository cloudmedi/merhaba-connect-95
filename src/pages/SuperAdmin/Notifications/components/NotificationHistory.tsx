import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, History, AlertCircle, Bell, Info } from "lucide-react";

interface NotificationRecord {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  sentTo: string;
  sentAt: string;
  status: "delivered" | "failed" | "pending";
}

export function NotificationHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState<NotificationRecord[]>([
    {
      id: 1,
      title: "System Maintenance Complete",
      message: "The scheduled maintenance has been completed successfully.",
      type: "success",
      sentTo: "All Users",
      sentAt: "2024-02-25 14:30",
      status: "delivered",
    },
    {
      id: 2,
      title: "New Feature Release",
      message: "We've added new playlist management features.",
      type: "info",
      sentTo: "Store Managers",
      sentAt: "2024-02-24 09:15",
      status: "delivered",
    },
    {
      id: 3,
      title: "Urgent: Server Issues",
      message: "We're experiencing some technical difficulties.",
      type: "error",
      sentTo: "Administrators",
      sentAt: "2024-02-23 18:45",
      status: "failed",
    },
  ]);

  const getIconForType = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "success":
        return <Bell className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <History className="h-5 w-5 text-[#9b87f5]" />
            <h2>Notification History</h2>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <ScrollArea className="h-[400px] rounded-md border">
          <div className="p-4 space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getIconForType(notification.type)}
                      <h3 className="font-medium">{notification.title}</h3>
                    </div>
                    <Badge className={getStatusColor(notification.status)}>
                      {notification.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Sent to: {notification.sentTo}</span>
                    <span>{notification.sentAt}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}