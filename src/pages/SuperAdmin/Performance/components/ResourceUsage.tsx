import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import { Cpu, Database, HardDrive } from "lucide-react";

const mockData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  cpu: Math.random() * 30 + 20,
  memory: Math.random() * 40 + 30,
  storage: Math.random() * 20 + 60,
}));

export function ResourceUsage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Cpu className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">CPU Usage</p>
              <h3 className="text-2xl font-bold text-gray-900">45%</h3>
              <Progress value={45} className="h-2 mt-2" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Memory Usage</p>
              <h3 className="text-2xl font-bold text-gray-900">62%</h3>
              <Progress value={62} className="h-2 mt-2" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <HardDrive className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Storage Usage</p>
              <h3 className="text-2xl font-bold text-gray-900">78%</h3>
              <Progress value={78} className="h-2 mt-2" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-white">
        <h3 className="text-lg font-semibold mb-6">Resource Usage Trends (24h)</h3>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              cpu: { color: "#3b82f6" },
              memory: { color: "#9333ea" },
              storage: { color: "#10b981" },
            }}
          >
            <LineChart 
              data={mockData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
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
              <Line
                type="monotone"
                dataKey="cpu"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="memory"
                stroke="#9333ea"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="storage"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
}