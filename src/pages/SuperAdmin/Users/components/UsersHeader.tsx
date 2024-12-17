import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { CreateUserDialog } from "./CreateUserDialog";

export function UsersHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add User
      </Button>
      <CreateUserDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}