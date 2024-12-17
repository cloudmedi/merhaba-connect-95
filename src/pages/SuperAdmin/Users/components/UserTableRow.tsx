import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "../types";

interface UserTableRowProps {
  user: User;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export function UserTableRow({ user, onEdit, onDelete }: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell>
        <Avatar className="h-8 w-8">
          <div className="bg-purple-100 text-purple-600 h-full w-full flex items-center justify-center">
            {(user.firstName?.[0] || user.email[0]).toUpperCase()}
          </div>
        </Avatar>
      </TableCell>
      <TableCell>
        {user.firstName} {user.lastName}
      </TableCell>
      <TableCell>
        {user.email}
      </TableCell>
      <TableCell>
        {user.license?.endDate}
      </TableCell>
      <TableCell>
        <Button onClick={() => onEdit(user.id)}>Edit</Button>
      </TableCell>
      <TableCell>
        <Button onClick={() => onDelete(user.id)}>Delete</Button>
      </TableCell>
    </TableRow>
  );
}