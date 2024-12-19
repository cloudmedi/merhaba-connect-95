import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface ApiMetric {
  endpoint: string;
  responseTime: number;
  statusCode: number;
  method: string;
  timestamp: string;
}

export const useApiMetrics = () => {
  return useQuery({
    queryKey: ["api-metrics"],
    queryFn: async () => {
      const response = await api.get("/admin/metrics/api");
      return response.data;
    },
    refetchInterval: 1000 * 60 * 5,
  });
};