import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ApiMetric {
  id: string;
  endpoint: string;
  response_time: number;
  total_requests: number;
  error_count: number;
  success_rate: number;
  measured_at: string;
}

export const useApiMetrics = () => {
  return useQuery({
    queryKey: ["api-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("api_metrics")
        .select("*")
        .order("measured_at", { ascending: false })
        .limit(24);

      if (error) throw error;
      return data as ApiMetric[];
    },
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};