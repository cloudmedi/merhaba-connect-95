import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Edit, Trash2, Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GroupForm } from "./GroupForm";
import { BranchSelection } from "./BranchSelection";
import type { Branch } from "@/pages/Manager/Announcements/types";

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
  onRefresh: () => void;
  branches: Branch[];
}

export function GroupList({ groups, onRefresh, branches }: GroupListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<BranchGroup | null>(null);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = async () => {
    if (!selectedGroup) return;

    try {
      // First delete all assignments
      const { error: assignmentError } = await supabase
        .from('branch_group_assignments')
        .delete()
        .eq('group_id', selectedGroup.id);

      if (assignmentError) throw assignmentError;

      // Then delete the group
      const { error: groupError } = await supabase
        .from('branch_groups')
        .delete()
        .eq('id', selectedGroup.id);

      if (groupError) throw groupError;

      toast.success("Grup başarıyla silindi");
      onRefresh();
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error("Grup silinirken bir hata oluştu");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedGroup(null);
    }
  };

  const handleEdit = async () => {
    if (!selectedGroup) return;

    try {
      // Update group details
      const { error: groupError } = await supabase
        .from('branch_groups')
        .update({
          name: groupName,
          description: description
        })
        .eq('id', selectedGroup.id);

      if (groupError) throw groupError;

      // Delete existing assignments
      const { error: deleteError } = await supabase
        .from('branch_group_assignments')
        .delete()
        .eq('group_id', selectedGroup.id);

      if (deleteError) throw deleteError;

      // Create new assignments
      if (selectedBranches.length > 0) {
        const { error: assignError } = await supabase
          .from('branch_group_assignments')
          .insert(
            selectedBranches.map(branchId => ({
              branch_id: branchId,
              group_id: selectedGroup.id
            }))
          );

        if (assignError) throw assignError;
      }

      toast.success("Grup başarıyla güncellendi");
      onRefresh();
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error("Grup güncellenirken bir hata oluştu");
    }
  };

  const openEditDialog = (group: BranchGroup) => {
    setSelectedGroup(group);
    setGroupName(group.name);
    setDescription(group.description || "");
    setSelectedBranches(group.branch_group_assignments?.map(assignment => assignment.branches.id) || []);
    setEditDialogOpen(true);
  };

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
                    onClick={() => openEditDialog(group)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Grubu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu grubu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve grup içindeki tüm şube bağlantıları silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Grubu Düzenle</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <GroupForm
              groupName={groupName}
              description={description}
              setGroupName={setGroupName}
              setDescription={setDescription}
            />

            <BranchSelection
              branches={branches}
              selectedBranches={selectedBranches}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setSelectedBranches={setSelectedBranches}
            />

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {selectedBranches.length} şube seçildi
              </p>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  İptal
                </Button>
                <Button onClick={handleEdit}>
                  Kaydet
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
}