import { Badge } from "@/components/ui/badge";

interface UserStatusProps {
  isActive: boolean;
}

export function UserStatus({ isActive }: UserStatusProps) {
  return (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className={
        isActive
          ? "bg-green-100 text-green-800 hover:bg-green-200"
          : "bg-red-100 text-red-800 hover:bg-red-200"
      }
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}