import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/auth";
import { UserAvatar } from "./UserAvatar";
import { UserStatus } from "./UserStatus";
import { UserActions } from "./UserActions";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, PlayCircle } from "lucide-react";

interface UserTableRowProps {
  user: User;
}

export function UserTableRow({ user }: UserTableRowProps) {
  const { data: assignmentCounts } = useQuery({
    queryKey: ['user-assignments', user.id],
    queryFn: async () => {
      const [playlistResult, scheduleResult] = await Promise.all([
        supabase
          .from('playlist_assignments')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id),
        supabase
          .from('schedule_events')
          .select('*', { count: 'exact' })
          .eq('created_by', user.id)
      ]);

      return {
        playlists: playlistResult.count || 0,
        schedules: scheduleResult.count || 0
      };
    }
  });

  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd MMM yyyy');
    } catch {
      return 'N/A';
    }
  };

  const getLicenseType = () => {
    if (!user.license?.type) return 'N/A';
    return user.license.type.charAt(0).toUpperCase() + user.license.type.slice(1);
  };

  return (
    <TableRow className="border-b hover:bg-gray-50">
      <TableCell className="p-4">
        <UserAvatar user={user} />
      </TableCell>
      <TableCell className="p-4">{user.company?.name || 'N/A'}</TableCell>
      <TableCell className="p-4">
        <div className="flex flex-col gap-1">
          <span>{user.role}</span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <PlayCircle className="w-3 h-3" />
              <span>{assignmentCounts?.playlists || 0} playlists</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{assignmentCounts?.schedules || 0} schedules</span>
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="p-4">
        <UserStatus user={user} />
      </TableCell>
      <TableCell className="p-4">
        <Badge 
          variant={user.license?.type === 'premium' ? 'default' : 'secondary'}
          className={
            user.license?.type === 'premium' 
              ? 'bg-[#9b87f5] text-white hover:bg-[#8b77e5]'
              : 'bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20'
          }
        >
          {getLicenseType()}
        </Badge>
      </TableCell>
      <TableCell className="p-4">
        {formatDate(user.license?.end_date)}
      </TableCell>
      <TableCell className="p-4 text-right space-x-1">
        <UserActions user={user} />
      </TableCell>
    </TableRow>
  );
}