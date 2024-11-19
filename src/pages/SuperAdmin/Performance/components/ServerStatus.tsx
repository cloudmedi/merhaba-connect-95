import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis } from "recharts";
import { Signal, Clock, AlertTriangle } from "lucide-react";

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
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Signal className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Server Uptime</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900">99.9%</h3>
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
                <h3 className="text-2xl font-bold text-gray-900">145ms</h3>
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
                <h3 className="text-2xl font-bold text-gray-900">0.1%</h3>
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
              uptime: { color: "#10b981" },
              responseTime: { color: "#3b82f6" },
              errorRate: { color: "#f97316" },
            }}
          >
            <AreaChart 
              data={mockData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="responseTimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={{ stroke: '#94a3b8' }}
              />
              <YAxis 
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={{ stroke: '#94a3b8' }}
              />
              <ChartTooltip />
              <Area
                type="monotone"
                dataKey="responseTime"
                stroke="#3b82f6"
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