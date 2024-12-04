import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Edit, Trash2, Users } from "lucide-react";
import { useState } from "react";
import type { Branch } from "@/pages/Manager/Announcements/types";
import { DeleteGroupDialog } from "./DeleteGroupDialog";
import { EditGroupDialog } from "./EditGroupDialog";

interface BranchGroup {
  id: string;
  name: string;
  description?: string;
  branch_group_assignments?: {
    branches: {
      id: string;
      name: string;
      location?: string;
    };
  }[];
  created_at?: string;
}

interface GroupListProps {
  groups: BranchGroup[];
  onRefresh: () => Promise<void>;
  branches: Branch[];
}

export function GroupList({ groups, onRefresh, branches }: GroupListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<BranchGroup | null>(null);

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {groups.map((group) => {
          const branchCount = group.branch_group_assignments?.length || 0;
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
                    <Badge variant="secondary" className="ml-2">
                      <Users className="w-3 h-3 mr-1" />
                      {branchCount} şube
                    </Badge>
                  </div>
                  {group.description && (
                    <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                  )}
                  <span className="text-xs text-gray-500 block mt-2">
                    {createdAt} oluşturuldu
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedGroup(group);
                      setEditDialogOpen(true);
                    }}
                    className="text-gray-500 hover:text-gray-900"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedGroup(group);
                      setDeleteDialogOpen(true);
                    }}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
        branches={branches}
        onSuccess={onRefresh}
      />
    </ScrollArea>
  );
}