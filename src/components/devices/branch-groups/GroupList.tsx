import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteGroupDialog } from "./DeleteGroupDialog";
import { EditGroupDialog } from "./EditGroupDialog";

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
        onSuccess={onRefresh}
      />
    </ScrollArea>
  );
}