import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SystemHealthTableProps {
  data: any[];
}

export function SystemHealthTable({ data }: SystemHealthTableProps) {
  return (
    <ScrollArea className="h-[600px] rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Health</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>CPU</TableHead>
            <TableHead>Memory</TableHead>
            <TableHead>Storage</TableHead>
            <TableHead>Network</TableHead>
            <TableHead>Last Restart</TableHead>
            <TableHead>Error Logs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.storeName}</TableCell>
              <TableCell>{item.region}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === "online"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.status}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.health === "healthy"
                      ? "bg-green-100 text-green-800"
                      : item.health === "warning"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.health}
                </span>
              </TableCell>
              <TableCell>{item.version}</TableCell>
              <TableCell>{item.cpu}%</TableCell>
              <TableCell>{item.memory}%</TableCell>
              <TableCell>{item.storage}%</TableCell>
              <TableCell>{item.networkLatency}ms</TableCell>
              <TableCell>{item.lastRestart}</TableCell>
              <TableCell>{item.errorLogs}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}