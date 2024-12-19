import { Card } from "@/components/ui/card";
import { Users, Music2, PlayCircle, Activity, ArrowUp, ArrowDown } from "lucide-react";
import { useSystemMetrics } from "@/hooks/useSystemMetrics";
import { Skeleton } from "@/components/ui/skeleton";

export function SystemStats() {
  const { data: metrics, isLoading } = useSystemMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-32" />
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Aktif Kullanıcılar",
      value: metrics?.activeUsers || 0,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Toplam Müzik",
      value: metrics?.totalSongs || 0,
      change: "+5%",
      trend: "up",
      icon: Music2,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Aktif Çalma Listeleri",
      value: metrics?.activePlaylists || 0,
      change: "-3%",
      trend: "down",
      icon: PlayCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Sistem Performansı",
      value: `${metrics?.systemHealth || 0}%`,
      change: "+8%",
      trend: "up",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="relative overflow-hidden group hover:shadow-lg transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#6E59A5] to-[#9b87f5] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </Card>
          );
        })}
      </div>
    </div>
  );
}