import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserTableRow } from "./UserTableRow";

// Mock data - Replace with actual API call
const mockUsers = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane@example.com",
    company: "Tech Solutions",
    role: "Member",
    status: "active" as const,
    license: "trial" as const,
    expiry: "15.03.2024"
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    company: "Acme Corp",
    role: "Admin",
    status: "active" as const,
    license: "premium" as const,
    expiry: "31.12.2024"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    company: "Digital Labs",
    role: "Member",
    status: "blocked" as const,
    license: "trial" as const,
    expiry: "15.02.2024"
  }
];

export function UsersTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NAME</TableHead>
            <TableHead>COMPANY</TableHead>
            <TableHead>ROLE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>LICENSE</TableHead>
            <TableHead>EXPIRY</TableHead>
            <TableHead className="text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockUsers.map((user) => (
            <UserTableRow key={user.id} user={user} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}