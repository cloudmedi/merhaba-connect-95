import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateUserDialog } from "./CreateUserDialog";

export function UsersHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        className="bg-[#9b87f5] hover:bg-[#7E69AB]"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add User
      </Button>
      <CreateUserDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
