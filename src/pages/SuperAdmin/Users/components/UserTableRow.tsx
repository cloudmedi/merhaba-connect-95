import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/auth";
import { UserAvatar } from "./UserAvatar";
import { UserStatus } from "./UserStatus";
import { UserActions } from "./UserActions";
import { format } from "date-fns";

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onViewHistory: (user: User) => void;
}

export function UserTableRow({ user, onEdit, onDelete, onViewHistory }: UserTableRowProps) {
  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd MMM yyyy');
    } catch {
      return 'N/A';
    }
  };

  const getLicenseType = () => {
    if (!user.license?.type) return 'N/A';
    return user.license.type.charAt(0).toUpperCase() + user.license.type.slice(1);
  };

  return (
    <TableRow className="border-b hover:bg-gray-50">
      <TableCell className="p-4">
        <UserAvatar user={user} />
      </TableCell>
      <TableCell className="p-4">{user.company?.name || 'N/A'}</TableCell>
      <TableCell className="p-4">{user.role}</TableCell>
      <TableCell className="p-4">
        <UserStatus isActive={user.isActive} />
      </TableCell>
      <TableCell className="p-4">
        <Badge 
          variant={user.license?.type === 'premium' ? 'default' : 'secondary'}
          className={
            user.license?.type === 'premium' 
              ? 'bg-[#9b87f5] text-white hover:bg-[#8b77e5]'
              : 'bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20'
          }
        >
          {getLicenseType()}
        </Badge>
      </TableCell>
      <TableCell className="p-4">
        {formatDate(user.license?.end_date)}
      </TableCell>
      <TableCell className="p-4 text-right space-x-1">
        <UserActions 
          user={user}
          onEdit={() => onEdit(user)}
          onDelete={() => onDelete(user)}
          onViewHistory={() => onViewHistory(user)}
        />
      </TableCell>
    </TableRow>
  );
}