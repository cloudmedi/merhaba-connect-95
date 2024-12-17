import { User } from "../types";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserStatus } from "./UserStatus";
import { UserActions } from "./UserActions";
import { UserAvatar } from "./UserAvatar";
import { format } from "date-fns";

interface UserTableRowProps {
  user: User;
  onStatusChange: () => void;
}

export function UserTableRow({ user, onStatusChange }: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <UserAvatar user={user} />
          <div>
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <span className="capitalize">{user.role}</span>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {user.license.type}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {format(new Date(user.license.endDate), 'dd/MM/yyyy')}
      </TableCell>
      <TableCell>
        <UserStatus isActive={user.isActive} />
      </TableCell>
      <TableCell>
        <UserActions user={user} onStatusChange={onStatusChange} />
      </TableCell>
    </TableRow>
  );
}