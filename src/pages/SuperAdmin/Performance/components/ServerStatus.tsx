import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis } from "recharts";
import { Signal, Clock, AlertTriangle } from "lucide-react";
import { useSystemMetrics } from "@/hooks/useSystemMetrics";
import { commonXAxisProps, commonYAxisProps, commonChartProps } from "@/components/charts/ChartConfig";

export function ServerStatus() {
  const { data: metrics = [] } = useSystemMetrics();
  const latestMetric = metrics[0] || {
    server_uptime: 99.9,
    response_time: 145,
    error_rate: 0.1,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Signal className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Server Uptime</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {latestMetric.server_uptime.toFixed(1)}%
                </h3>
                <p className="text-sm text-emerald-600">Last 30 days</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Response Time</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {latestMetric.response_time}ms
                </h3>
                <p className="text-sm text-blue-600">Average</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Error Rate</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {latestMetric.error_rate.toFixed(1)}%
                </h3>
                <p className="text-sm text-orange-600">Last hour</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-white">
        <h3 className="text-lg font-semibold mb-6">Server Performance (24h)</h3>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              responseTime: { color: "#3b82f6" },
            }}
          >
            <AreaChart 
              data={metrics}
              {...commonChartProps}
            >
              <defs>
                <linearGradient id="responseTimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <XAxis 
                {...commonXAxisProps}
                dataKey="measured_at"
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis {...commonYAxisProps} />
              <ChartTooltip />
              <Area
                type="monotone"
                dataKey="response_time"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#responseTimeGradient)"
                {...commonChartProps}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
}
