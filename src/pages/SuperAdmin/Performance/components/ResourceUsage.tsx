import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import { Cpu, Database, Memory } from "lucide-react";
import { useSystemMetrics } from "@/hooks/useSystemMetrics";
import { commonXAxisProps, commonYAxisProps, commonChartProps } from "@/components/charts/ChartConfig";

export function ResourceUsage() {
  const { data: metrics = [] } = useSystemMetrics();
  const latestMetric = metrics[0] || {
    cpu_usage: 45,
    memory_usage: 62,
    storage_usage: 78,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Cpu className="h-6 w-6 text-[#6E59A5]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">CPU Usage</p>
              <h3 className="text-2xl font-bold text-gray-900">{latestMetric.cpu_usage.toFixed(1)}%</h3>
              <Progress value={latestMetric.cpu_usage} className="h-2 mt-2" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Memory className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Memory Usage</p>
              <h3 className="text-2xl font-bold text-gray-900">{latestMetric.memory_usage.toFixed(1)}%</h3>
              <Progress value={latestMetric.memory_usage} className="h-2 mt-2" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Database className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Storage Usage</p>
              <h3 className="text-2xl font-bold text-gray-900">{latestMetric.storage_usage.toFixed(1)}%</h3>
              <Progress value={latestMetric.storage_usage} className="h-2 mt-2" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-6 text-gray-900">Resource Usage Trends (24h)</h3>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              cpu: { color: "#6E59A5" },
              memory: { color: "#3b82f6" },
              storage: { color: "#10b981" },
            }}
          >
            <LineChart 
              data={metrics}
              {...commonChartProps}
            >
              <XAxis 
                {...commonXAxisProps}
                dataKey="measured_at"
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis {...commonYAxisProps} />
              <ChartTooltip />
              <Line
                type="monotone"
                dataKey="cpu_usage"
                stroke="#6E59A5"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                {...commonChartProps}
              />
              <Line
                type="monotone"
                dataKey="memory_usage"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                {...commonChartProps}
              />
              <Line
                type="monotone"
                dataKey="storage_usage"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                {...commonChartProps}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
}