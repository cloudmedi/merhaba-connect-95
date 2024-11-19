import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Signal, AlertTriangle, Clock } from "lucide-react";

const mockData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  uptime: Math.random() * 10 + 90,
  responseTime: Math.random() * 100 + 100,
  errorRate: Math.random() * 2,
}));

export function ServerStatus() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Server Uptime</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">99.9%</h3>
              <p className="text-xs text-emerald-600 mt-2">Last 30 days</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <Signal className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Response Time</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">145ms</h3>
              <p className="text-xs text-emerald-600 mt-2">Average</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Error Rate</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">0.1%</h3>
              <p className="text-xs text-emerald-600 mt-2">Last hour</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Server Performance (24h)</h3>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              uptime: { color: "#10b981" },
              responseTime: { color: "#3b82f6" },
              errorRate: { color: "#f97316" },
            }}
          >
            <AreaChart data={mockData}>
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip />
              <Area
                type="monotone"
                dataKey="uptime"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="responseTime"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="errorRate"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
}