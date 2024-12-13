import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/auth";

interface UserAvatarProps {
  user: User;
}

export function UserAvatar({ user }: UserAvatarProps) {
  const getInitials = () => {
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={user.avatar_url || ''} />
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
  );
}