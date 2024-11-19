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
  Users2,
  Library,
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

export default function SuperAdmin() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold">2,345</h3>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-green-500 mt-2">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Companies</p>
                <h3 className="text-2xl font-bold">45</h3>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-green-500 mt-2">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tracks</p>
                <h3 className="text-2xl font-bold">3,567</h3>
              </div>
              <Music2 className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-green-500 mt-2">+23% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-6 flex items-start space-x-4">
            <Upload className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-semibold">Upload Music</h3>
              <p className="text-sm text-muted-foreground">Add new tracks to library</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardContent className="p-6 flex items-start space-x-4">
            <PlaySquare className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold">Create Playlist</h3>
              <p className="text-sm text-muted-foreground">Organize your music</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50">
          <CardContent className="p-6 flex items-start space-x-4">
            <FolderPlus className="h-6 w-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold">New Category</h3>
              <p className="text-sm text-muted-foreground">Organize content</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardContent className="p-6 flex items-start space-x-4">
            <Users2 className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold">Manage Teams</h3>
              <p className="text-sm text-muted-foreground">Handle permissions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardContent className="p-6 flex items-start space-x-4">
            <Library className="h-6 w-6 text-purple-600" />
            <div>
              <h3 className="font-semibold">Music Library</h3>
              <p className="text-sm text-muted-foreground">Browse all tracks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Engagement Chart */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Engagement</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userEngagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Active Users" fill="#8884d8" />
                <Bar dataKey="New Users" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <span className="text-sm text-muted-foreground">Last 24 hours</span>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    {activity.type === "upload" && <Upload className="h-4 w-4 text-primary" />}
                    {activity.type === "playlist" && <PlaySquare className="h-4 w-4 text-primary" />}
                    {activity.type === "user" && <Users className="h-4 w-4 text-primary" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">by {activity.user}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}