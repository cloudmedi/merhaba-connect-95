import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/auth";
import { UserAvatar } from "./UserAvatar";
import { UserStatus } from "./UserStatus";
import { UserActions } from "./UserActions";

interface UserTableRowProps {
  user: User;
}

export function UserTableRow({ user }: UserTableRowProps) {
  return (
    <TableRow className="border-b hover:bg-gray-50">
      <TableCell className="p-4">
        <UserAvatar user={user} />
      </TableCell>
      <TableCell className="p-4">{user.company?.name || 'N/A'}</TableCell>
      <TableCell className="p-4">{user.role}</TableCell>
      <TableCell className="p-4">
        <UserStatus user={user} />
      </TableCell>
      <TableCell className="p-4">
        <Badge 
          variant="secondary"
          className="bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20"
        >
          {user.license?.type || 'N/A'}
        </Badge>
      </TableCell>
      <TableCell className="p-4">{user.license?.endDate || 'N/A'}</TableCell>
      <TableCell className="p-4 text-right space-x-1">
        <UserActions user={user} />
      </TableCell>
    </TableRow>
  );
}