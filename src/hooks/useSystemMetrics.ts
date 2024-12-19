import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface SystemMetric {
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
      console.log('Fetching system metrics...');
      const response = await api.get("/admin/metrics/system");
      console.log('System metrics response:', response.data);
      return response.data;
    },
    refetchInterval: 1000 * 60 * 5, // Her 5 dakikada bir yenile
  });
};