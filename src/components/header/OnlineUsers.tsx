import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface OnlineUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  lastSeen: string;
}

interface OnlineUsersProps {
  onlineUsers: OnlineUser[];
}

export function OnlineUsers({ onlineUsers }: OnlineUsersProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <div className="flex -space-x-2">
            {onlineUsers.slice(0, 3).map((onlineUser) => (
              <Avatar key={onlineUser.id} className="h-6 w-6 border-2 border-white">
                <div className="flex h-full w-full items-center justify-center bg-[#9b87f5] text-white text-xs">
                  {onlineUser.firstName?.[0] || onlineUser.email[0].toUpperCase()}
                </div>
              </Avatar>
            ))}
          </div>
          {onlineUsers.length > 3 && (
            <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-[#9b87f5] text-xs text-white flex items-center justify-center">
              +{onlineUsers.length - 3}
            </span>
          )}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Çevrimiçi Yöneticiler</h4>
          <div className="space-y-1">
            {onlineUsers.map((onlineUser) => (
              <div key={onlineUser.id} className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <div className="flex h-full w-full items-center justify-center bg-[#9b87f5] text-white text-xs">
                    {onlineUser.firstName?.[0] || onlineUser.email[0].toUpperCase()}
                  </div>
                </Avatar>
                <span className="text-sm">
                  {onlineUser.firstName && onlineUser.lastName
                    ? `${onlineUser.firstName} ${onlineUser.lastName}`
                    : onlineUser.email}
                </span>
              </div>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}