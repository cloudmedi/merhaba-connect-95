import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

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
      const response = await axios.get<SystemMetric>("/admin/metrics/system");
      return response.data;
    },
    refetchInterval: 1000 * 60 * 5, // Her 5 dakikada bir yenile
  });
};