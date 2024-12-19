import { Card } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useSystemMetrics } from "@/hooks/useSystemMetrics";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricsChart() {
  const { data: metrics, isLoading } = useSystemMetrics();

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-[300px] w-full" />
      </Card>
    );
  }

  // Örnek veri - gerçek verilerle değiştirilecek
  const data = [
    { name: "00:00", value: 65 },
    { name: "04:00", value: 75 },
    { name: "08:00", value: 85 },
    { name: "12:00", value: 78 },
    { name: "16:00", value: 90 },
    { name: "20:00", value: 95 },
    { name: "23:59", value: 88 },
  ];

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Sistem Performansı</h3>
        <p className="text-sm text-muted-foreground">24 saatlik performans grafiği</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              tickLine={{ stroke: 'currentColor' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              tickLine={{ stroke: 'currentColor' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Zaman
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].payload.name}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Değer
                          </span>
                          <span className="font-bold">
                            {payload[0].value}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6E59A5"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}