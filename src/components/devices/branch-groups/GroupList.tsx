import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Edit, Trash2, MoreVertical, Eye, RefreshCw, Clock, StopCircle } from "lucide-react";
import { useState } from "react";
import { DeleteGroupDialog } from "./DeleteGroupDialog";
import { EditGroupDialog } from "./EditGroupDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Group {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

interface GroupListProps {
  groups: Group[];
  onRefresh: () => Promise<void>;
}

export function GroupList({ groups, onRefresh }: GroupListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const handleDeleteClick = (group: Group) => {
    console.log('Delete clicked for group:', group);
    setSelectedGroup(group);
    setDeleteDialogOpen(true);
  };

  const handleResetDevices = async (groupId: string) => {
    try {
      const { data: assignments, error: assignmentsError } = await supabase
        .from('branch_group_assignments')
        .select('branch_id')
        .eq('group_id', groupId);

      if (assignmentsError) throw assignmentsError;

      const branchIds = assignments.map(a => a.branch_id);

      const { error: devicesError } = await supabase
        .from('devices')
        .update({
          status: 'restarting',
          last_seen: new Date().toISOString()
        })
        .in('branch_id', branchIds);

      if (devicesError) throw devicesError;
      toast.success('Gruptaki cihazlar yeniden başlatılıyor');
    } catch (error) {
      console.error('Error resetting group devices:', error);
      toast.error('Cihazlar yeniden başlatılırken bir hata oluştu');
    }
  };

  const handleEmergencyStop = async (groupId: string) => {
    try {
      const { data: assignments, error: assignmentsError } = await supabase
        .from('branch_group_assignments')
        .select('branch_id')
        .eq('group_id', groupId);

      if (assignmentsError) throw assignmentsError;

      const branchIds = assignments.map(a => a.branch_id);

      const { error: devicesError } = await supabase
        .from('devices')
        .update({
          status: 'emergency_stop',
          last_seen: new Date().toISOString()
        })
        .in('branch_id', branchIds);

      if (devicesError) throw devicesError;
      toast.success('Gruptaki cihazlarda müzik acil olarak durduruldu');
    } catch (error) {
      console.error('Error emergency stopping group devices:', error);
      toast.error('Müzik durdurulurken bir hata oluştu');
    }
  };

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {groups.map((group) => {
          const createdAt = group.created_at 
            ? formatDistanceToNow(new Date(group.created_at), { addSuffix: true, locale: tr }) 
            : '';

          return (
            <div
              key={group.id}
              className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-base">{group.name}</h3>
                  </div>
                  {group.description && (
                    <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                  )}
                  <span className="text-xs text-gray-500 block mt-2">
                    {createdAt} oluşturuldu
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => {
                        setSelectedGroup(group);
                        setEditDialogOpen(true);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleResetDevices(group.id)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Cihazları Resetle
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEmergencyStop(group.id)} className="text-red-600">
                        <StopCircle className="h-4 w-4 mr-2" />
                        Acil Müzik Durdur
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteClick(group)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DeleteGroupDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedGroup(null);
        }}
        groupId={selectedGroup?.id || null}
        onDeleted={onRefresh}
      />

      <EditGroupDialog
        isOpen={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedGroup(null);
        }}
        group={selectedGroup}
        onSuccess={onRefresh}
      />
    </ScrollArea>
  );
}