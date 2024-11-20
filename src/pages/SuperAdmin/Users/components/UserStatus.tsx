import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { User } from "@/types/auth";

interface UserStatusProps {
  user: User;
}

export function UserStatus({ user }: UserStatusProps) {
  return (
    <Badge 
      variant={user.isActive ? 'default' : 'destructive'}
      className={user.isActive 
        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
        : 'bg-red-100 text-red-800 hover:bg-red-100'}
    >
      {user.isActive ? (
        <Check className="mr-1 h-3 w-3" />
      ) : (
        <X className="mr-1 h-3 w-3" />
      )}
      {user.isActive ? 'active' : 'blocked'}
    </Badge>
  );
}