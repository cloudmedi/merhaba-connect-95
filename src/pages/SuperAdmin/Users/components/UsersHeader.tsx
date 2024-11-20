import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function UsersHeader() {
  return (
    <Button 
      className="bg-[#9b87f5] hover:bg-[#7E69AB]"
    >
      <Plus className="mr-2 h-4 w-4" />
      Add User
    </Button>
  );
}