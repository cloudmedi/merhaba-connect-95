import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface ApiMetric {
  id: string;
  endpoint: string;
  response_time: number;
  total_requests: number;
  error_count: number;
  success_rate: number;
  method: string;
  timestamp: string;
}

export const useApiMetrics = () => {
  return useQuery({
    queryKey: ["api-metrics"],
    queryFn: async () => {
      const response = await api.get("/admin/reports/api-metrics", {
        params: {
          startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Son 24 saat
          endDate: new Date().toISOString()
        }
      });
      return response.data as ApiMetric[];
    },
    refetchInterval: 1000 * 60 * 5, // Her 5 dakikada bir yenile
  });
};