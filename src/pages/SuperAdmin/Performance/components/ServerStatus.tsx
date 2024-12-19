import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis } from "recharts";
import { Server, TrendingUp, Network } from "lucide-react";
import { useSystemMetrics } from "@/hooks/useSystemMetrics";
import { commonXAxisProps, commonYAxisProps, commonChartProps } from "@/components/charts/ChartConfig";

export function ServerStatus() {
  const { data: metric, isLoading } = useSystemMetrics();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!metric) {
    return <div>No data available</div>;
  }

  // Son 24 saatlik veri için örnek data oluştur
  const chartData = Array.from({ length: 24 }, (_, i) => ({
    time: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toLocaleTimeString(),
    responseTime: metric.response_time,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Server className="h-6 w-6 text-[#6E59A5]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Server Uptime</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {metric.server_uptime.toFixed(1)}%
                </h3>
                <p className="text-sm text-[#6E59A5]">Last 30 days</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Response Time</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {metric.response_time}ms
                </h3>
                <p className="text-sm text-blue-600">Average</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-100 rounded-lg">
              <Network className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Error Rate</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {metric.error_rate.toFixed(1)}%
                </h3>
                <p className="text-sm text-rose-600">Last hour</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-6 text-gray-900">Server Response Time (24h)</h3>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              responseTime: { color: "#6E59A5" },
            }}
          >
            <AreaChart 
              data={chartData}
              {...commonChartProps}
            >
              <defs>
                <linearGradient id="responseTimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6E59A5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6E59A5" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <XAxis 
                {...commonXAxisProps}
                dataKey="time"
              />
              <YAxis {...commonYAxisProps} />
              <ChartTooltip />
              <Area
                type="monotone"
                dataKey="responseTime"
                name="Response Time"
                stroke="#6E59A5"
                strokeWidth={2}
                fill="url(#responseTimeGradient)"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
}