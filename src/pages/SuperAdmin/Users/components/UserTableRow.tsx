import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { User } from "../types";

interface UserTableRowProps {
  user: User;
}

export function UserTableRow({ user }: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell>
        <Avatar className="h-8 w-8">
          <div className="bg-purple-100 text-purple-600 h-full w-full flex items-center justify-center">
            {(user.first_name?.[0] || user.email[0]).toUpperCase()}
          </div>
        </Avatar>
      </TableCell>
      <TableCell>
        {user.first_name} {user.last_name}
      </TableCell>
      <TableCell>
        {user.email}
      </TableCell>
      <TableCell>
        {user.license?.endDate}
      </TableCell>
      <TableCell>
        <Button onClick={() => handleEdit(user.id)}>Edit</Button>
      </TableCell>
      <TableCell>
        <Button onClick={() => handleDelete(user.id)}>Delete</Button>
      </TableCell>
    </TableRow>
  );
}
