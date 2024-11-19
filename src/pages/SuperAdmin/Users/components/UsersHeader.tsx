import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function UsersHeader() {
  return (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Add User
    </Button>
  );
}