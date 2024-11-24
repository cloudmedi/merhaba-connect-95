import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, PlaySquare, Users } from "lucide-react";

const recentActivities = [
  {
    id: 1,
    type: "upload",
    title: "New Track Uploaded",
    description: "Summer Mix track added to library",
    user: "John Doe",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "playlist",
    title: "Playlist Created",
    description: "Workout Mix 2024 created",
    user: "Jane Smith",
    time: "15 min ago",
  },
  {
    id: 3,
    type: "user",
    title: "New User Added",
    description: "Mike Johnson joined the team",
    user: "Admin",
    time: "1 hour ago",
  },
];

export function RecentActivities() {
  return (
    <Card className="hover:shadow-lg transition-shadow bg-white border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <span className="text-sm text-gray-500">Last 24 hours</span>
        </div>
        <ScrollArea className="h-[300px] pr-4 scrollbar-hide">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 rounded-full bg-[#9b87f5]/10">
                  {activity.type === "upload" && (
                    <Upload className="h-4 w-4 text-[#9b87f5]" />
                  )}
                  {activity.type === "playlist" && (
                    <PlaySquare className="h-4 w-4 text-[#9b87f5]" />
                  )}
                  {activity.type === "user" && (
                    <Users className="h-4 w-4 text-[#9b87f5]" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-400">
                      by {activity.user}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}