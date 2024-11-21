import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SystemMetric {
  id: string;
  server_uptime: number;
  response_time: number;
  error_rate: number;
  cpu_usage: number;
  memory_usage: number;
  storage_usage: number;
  measured_at: string;
}

export const useSystemMetrics = () => {
  return useQuery({
    queryKey: ["system-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_metrics")
        .select("*")
        .order("measured_at", { ascending: false })
        .limit(24);

      if (error) throw error;
      return data as SystemMetric[];
    },
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};