import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Signal, Clock, AlertTriangle, Cpu, Database, HardDrive } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const mockTimeData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: Math.floor(Math.random() * 100) + 100,
}));

const mockResourceData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  cpu: Math.random() * 30 + 20,
  memory: Math.random() * 40 + 30,
  storage: Math.random() * 20 + 60,
}));

const mockApiData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  requests: Math.floor(Math.random() * 2000 + 500),
}));

export default function Performance() {
  return (
    <DashboardLayout
      title="System Performance"
      description="Monitor system health, resource usage, and API performance"
    >
      <div className="space-y-6">
        {/* Status Cards */}
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

        {/* Server Performance Chart */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold mb-6">Server Performance (24h)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTimeData}>
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
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Resource Usage Cards */}
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

        {/* Resource Usage Trends */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold mb-6">Resource Usage Trends (24h)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockResourceData}>
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
                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="memory"
                  stroke="#9333ea"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="storage"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* API Request Volume */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold mb-6">API Request Volume (24h)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockApiData}>
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
                <Bar 
                  dataKey="requests" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Endpoint Performance Table */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4">Endpoint Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Endpoint</th>
                  <th className="text-right py-3 px-4">Avg Response Time</th>
                  <th className="text-right py-3 px-4">Total Requests</th>
                  <th className="text-right py-3 px-4">Error Count</th>
                  <th className="text-right py-3 px-4">Error Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">/api/playlists</td>
                  <td className="text-right py-3 px-4">120ms</td>
                  <td className="text-right py-3 px-4">15,000</td>
                  <td className="text-right py-3 px-4">12</td>
                  <td className="text-right py-3 px-4">0.08%</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">/api/tracks</td>
                  <td className="text-right py-3 px-4">180ms</td>
                  <td className="text-right py-3 px-4">12,000</td>
                  <td className="text-right py-3 px-4">8</td>
                  <td className="text-right py-3 px-4">0.07%</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">/api/users</td>
                  <td className="text-right py-3 px-4">90ms</td>
                  <td className="text-right py-3 px-4">8,000</td>
                  <td className="text-right py-3 px-4">5</td>
                  <td className="text-right py-3 px-4">0.06%</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">/api/auth</td>
                  <td className="text-right py-3 px-4">150ms</td>
                  <td className="text-right py-3 px-4">20,000</td>
                  <td className="text-right py-3 px-4">15</td>
                  <td className="text-right py-3 px-4">0.07%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">/api/settings</td>
                  <td className="text-right py-3 px-4">100ms</td>
                  <td className="text-right py-3 px-4">5,000</td>
                  <td className="text-right py-3 px-4">3</td>
                  <td className="text-right py-3 px-4">0.06%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}