import { AdminNav } from "@/components/AdminNav";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Building2,
  Music2,
  Upload,
  PlaySquare,
  FolderPlus,
} from "lucide-react";

const userEngagementData = [
  { name: "Mon", "Active Users": 150, "New Users": 10 },
  { name: "Tue", "Active Users": 180, "New Users": 12 },
  { name: "Wed", "Active Users": 160, "New Users": 8 },
  { name: "Thu", "Active Users": 190, "New Users": 15 },
  { name: "Fri", "Active Users": 180, "New Users": 20 },
  { name: "Sat", "Active Users": 140, "New Users": 8 },
  { name: "Sun", "Active Users": 120, "New Users": 5 },
];

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

export default function Dashboard() {
  return (
    <div className="flex">
      <AdminNav />
      <main className="flex-1 p-8 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, Admin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow bg-white border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">2,345</h3>
                    <p className="text-xs text-emerald-600 mt-2 flex items-center">
                      ↑ 12% from last month
                    </p>
                  </div>
                  <div className="p-3 bg-[#9b87f5]/10 rounded-full">
                    <Users className="h-6 w-6 text-[#9b87f5]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-white border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Companies</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">45</h3>
                    <p className="text-xs text-emerald-600 mt-2">↑ 5% from last month</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-white border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Tracks</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">3,567</h3>
                    <p className="text-xs text-emerald-600 mt-2">↑ 23% from last month</p>
                  </div>
                  <div className="p-3 bg-pink-100 rounded-full">
                    <Music2 className="h-6 w-6 text-pink-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 hover:shadow-lg transition-shadow bg-white border-none shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Bar dataKey="Active Users" fill="#9b87f5" />
                      <Bar dataKey="New Users" fill="#7E69AB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-white border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20 transition-colors">
                    <Upload className="h-5 w-5" />
                    <span className="text-sm font-medium">Upload Music</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                    <PlaySquare className="h-5 w-5" />
                    <span className="text-sm font-medium">Create Playlist</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 transition-colors">
                    <FolderPlus className="h-5 w-5" />
                    <span className="text-sm font-medium">Add Category</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="hover:shadow-lg transition-shadow bg-white border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <span className="text-sm text-gray-500">Last 24 hours</span>
              </div>
              <ScrollArea className="h-[300px] pr-4">
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
        </div>
      </main>
    </div>
  );
}