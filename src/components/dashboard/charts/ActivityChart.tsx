import { Card } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const data = [
  { name: "Pzt", users: 24, playlists: 15 },
  { name: "Sal", users: 30, playlists: 20 },
  { name: "Çar", users: 28, playlists: 18 },
  { name: "Per", users: 32, playlists: 22 },
  { name: "Cum", users: 35, playlists: 25 },
  { name: "Cmt", users: 20, playlists: 12 },
  { name: "Paz", users: 15, playlists: 8 },
];

export function ActivityChart() {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Haftalık Aktivite</h3>
        <p className="text-sm text-muted-foreground">Kullanıcı ve playlist aktiviteleri</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
                      <div className="grid gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {payload[0].payload.name}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] text-muted-foreground">
                            Kullanıcılar: {payload[0].value}
                          </span>
                          <span className="text-[0.70rem] text-muted-foreground">
                            Playlistler: {payload[1].value}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="users" fill="#6E59A5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="playlists" fill="#9b87f5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}