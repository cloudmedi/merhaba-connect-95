import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, History, Lock, Key, RotateCcw, Trash } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  status: 'active' | 'blocked';
  license: 'trial' | 'premium';
  expiry: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane@example.com",
    company: "Tech Solutions",
    role: "Member",
    status: "active",
    license: "trial",
    expiry: "15.03.2024"
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    company: "Acme Corp",
    role: "Admin",
    status: "active",
    license: "premium",
    expiry: "31.12.2024"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    company: "Digital Labs",
    role: "Member",
    status: "blocked",
    license: "trial",
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
            <TableHead>EMAIL</TableHead>
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
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.company}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge 
                  variant={user.status === 'active' ? 'default' : 'destructive'}
                  className={user.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                >
                  {user.license}
                </Badge>
              </TableCell>
              <TableCell>{user.expiry}</TableCell>
              <TableCell className="text-right space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <History className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Lock className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Key className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}