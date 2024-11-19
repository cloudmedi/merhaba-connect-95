import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserSquare2 } from "lucide-react";

// Mock data - Replace with actual API data
const managerActivityData = [
  {
    id: 1,
    manager: "John Doe",
    store: "Sunny Chill House",
    action: "Login",
    timestamp: "2024-02-25 14:30:00",
    details: "Windows Player Login",
  },
  {
    id: 2,
    manager: "Jane Smith",
    store: "Beach Bar",
    action: "Playlist Change",
    timestamp: "2024-02-25 12:00:00",
    details: "Changed to Summer Vibes",
  },
];

export function ManagerActivityReport() {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <UserSquare2 className="h-5 w-5 text-[#9b87f5]" />
          <h2 className="text-lg font-semibold">Manager Activity Logs</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Manager</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managerActivityData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.manager}</TableCell>
                <TableCell>{item.store}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.action === "Login" 
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {item.action}
                  </span>
                </TableCell>
                <TableCell>{item.timestamp}</TableCell>
                <TableCell>{item.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}