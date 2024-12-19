import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface SystemMetric {
  id: string;
  cpu_usage: number;
  memory_usage: number;
  storage_usage: number;
  server_uptime: number;
  response_time: number;
  error_rate: number;
  activeUsers: number;
  totalSongs: number;
  activePlaylists: number;
  systemHealth: number;
  timestamp: string;
}

export const useSystemMetrics = () => {
  return useQuery({
    queryKey: ["system-metrics"],
    queryFn: async () => {
      const [metricsResponse, statsResponse] = await Promise.all([
        api.get("/admin/reports/system-metrics", {
          params: {
            startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString()
          }
        }),
        api.get("/admin/metrics/system")
      ]);

      const metrics = metricsResponse.data as SystemMetric[];
      const stats = statsResponse.data;

      // En son metriği döndür ve stats verilerini ekle
      return {
        ...metrics[0],
        activeUsers: stats.activeUsers,
        totalSongs: stats.totalSongs,
        activePlaylists: stats.activePlaylists,
        systemHealth: stats.systemHealth
      } as SystemMetric;
    },
    refetchInterval: 1000 * 60 * 5, // Her 5 dakikada bir yenile
  });
};