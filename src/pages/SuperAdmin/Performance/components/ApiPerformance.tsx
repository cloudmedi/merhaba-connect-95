import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockEndpoints = [
  { endpoint: "/api/playlists", avgResponse: 120, requests: 15000, errors: 12 },
  { endpoint: "/api/tracks", avgResponse: 180, requests: 12000, errors: 8 },
  { endpoint: "/api/users", avgResponse: 90, requests: 8000, errors: 5 },
  { endpoint: "/api/auth", avgResponse: 150, requests: 20000, errors: 15 },
  { endpoint: "/api/settings", avgResponse: 100, requests: 5000, errors: 3 },
];

const mockTimeData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  requests: Math.floor(Math.random() * 1000 + 500),
  errors: Math.floor(Math.random() * 10),
}));

export function ApiPerformance() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">API Request Volume (24h)</h3>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              requests: { color: "#3b82f6" },
              errors: { color: "#ef4444" },
            }}
          >
            <BarChart data={mockTimeData}>
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip />
              <Bar dataKey="requests" fill="#3b82f6" />
              <Bar dataKey="errors" fill="#ef4444" />
            </BarChart>
          </ChartContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Endpoint Performance</h3>
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Endpoint</TableHead>
                <TableHead>Avg Response Time</TableHead>
                <TableHead>Total Requests</TableHead>
                <TableHead>Error Count</TableHead>
                <TableHead>Error Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEndpoints.map((endpoint) => (
                <TableRow key={endpoint.endpoint}>
                  <TableCell className="font-medium">{endpoint.endpoint}</TableCell>
                  <TableCell>{endpoint.avgResponse}ms</TableCell>
                  <TableCell>{endpoint.requests.toLocaleString()}</TableCell>
                  <TableCell>{endpoint.errors}</TableCell>
                  <TableCell>
                    {((endpoint.errors / endpoint.requests) * 100).toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}