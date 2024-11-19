import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockTimeData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  requests: Math.floor(Math.random() * 1000 + 500),
  errors: Math.floor(Math.random() * 10),
}));

const mockEndpoints = [
  { endpoint: "/api/playlists", avgResponse: 120, requests: 15000, errors: 12 },
  { endpoint: "/api/tracks", avgResponse: 180, requests: 12000, errors: 8 },
  { endpoint: "/api/users", avgResponse: 90, requests: 8000, errors: 5 },
  { endpoint: "/api/auth", avgResponse: 150, requests: 20000, errors: 15 },
  { endpoint: "/api/settings", avgResponse: 100, requests: 5000, errors: 3 },
];

export function ApiPerformance() {
  return (
    <div className="space-y-6">
      {/* API İstek Hacmi Grafiği */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">API İstek Hacmi (24s)</h3>
        <div className="h-[400px]"> {/* Grafik yüksekliğini artırdık */}
          <ChartContainer
            config={{
              requests: { color: "#8B5CF6", label: "İstekler" },
              errors: { color: "#EF4444", label: "Hatalar" },
            }}
          >
            <BarChart 
              data={mockTimeData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                interval={2}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                width={60}
              />
              <ChartTooltip />
              <Bar 
                dataKey="requests" 
                fill="#8B5CF6" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar 
                dataKey="errors" 
                fill="#EF4444" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </Card>

      {/* Endpoint Performans Tablosu */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Endpoint Performansı</h3>
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Endpoint</TableHead>
                <TableHead className="text-right">Ort. Yanıt Süresi</TableHead>
                <TableHead className="text-right">Toplam İstek</TableHead>
                <TableHead className="text-right">Hata Sayısı</TableHead>
                <TableHead className="text-right">Hata Oranı</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEndpoints.map((endpoint) => (
                <TableRow key={endpoint.endpoint}>
                  <TableCell className="font-medium">{endpoint.endpoint}</TableCell>
                  <TableCell className="text-right">{endpoint.avgResponse}ms</TableCell>
                  <TableCell className="text-right">{endpoint.requests.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{endpoint.errors}</TableCell>
                  <TableCell className="text-right">
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