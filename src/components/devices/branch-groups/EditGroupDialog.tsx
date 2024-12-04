import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GroupForm } from "./GroupForm";
import { BranchSelection } from "./BranchSelection";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Branch } from "@/pages/Manager/Announcements/types";

interface EditGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  group: {
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
  } | null;
  branches: Branch[];
  onSuccess: () => Promise<void>;
}

export function EditGroupDialog({ isOpen, onClose, group, branches, onSuccess }: EditGroupDialogProps) {
  const [groupName, setGroupName] = useState(group?.name || "");
  const [description, setDescription] = useState(group?.description || "");
  const [selectedBranches, setSelectedBranches] = useState<string[]>(
    group?.branch_group_assignments?.map(assignment => assignment.branches.id) || []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = async () => {
    if (!group) return;
    setIsSubmitting(true);

    try {
      // Update group details
      const { error: groupError } = await supabase
        .from('branch_groups')
        .update({
          name: groupName,
          description: description
        })
        .eq('id', group.id);

      if (groupError) throw groupError;

      // Delete existing assignments
      const { error: deleteError } = await supabase
        .from('branch_group_assignments')
        .delete()
        .eq('group_id', group.id);

      if (deleteError) throw deleteError;

      // Create new assignments
      if (selectedBranches.length > 0) {
        const { error: assignError } = await supabase
          .from('branch_group_assignments')
          .insert(
            selectedBranches.map(branchId => ({
              branch_id: branchId,
              group_id: group.id
            }))
          );

        if (assignError) throw assignError;
      }

      toast.success("Grup başarıyla güncellendi");
      await onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error("Grup güncellenirken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                İptal
              </Button>
              <Button onClick={handleEdit} disabled={isSubmitting}>
                {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}