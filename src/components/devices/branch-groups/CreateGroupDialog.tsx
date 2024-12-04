import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Branch } from "@/pages/Manager/Announcements/types";
import { GroupForm } from "./GroupForm";
import { BranchSelection } from "./BranchSelection";

interface CreateGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  branches: Branch[];
}

export function CreateGroupDialog({ isOpen, onClose, onSuccess, branches }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Lütfen grup adı girin");
      return;
    }

    if (selectedBranches.length === 0) {
      toast.error("Lütfen en az bir şube seçin");
      return;
    }

    setIsCreating(true);

    try {
      // Get user's profile for company_id
      const { data: { user } } = await supabase.auth.getUser();
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user?.id)
        .single();

      if (!userProfile?.company_id) {
        toast.error("Şirket bilgisi bulunamadı");
        return;
      }

      // Create the group
      const { data: group, error: groupError } = await supabase
        .from('branch_groups')
        .insert({
          name: groupName,
          description,
          company_id: userProfile.company_id,
          created_by: user?.id
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Create branch group assignments
      const { error: assignError } = await supabase
        .from('branch_group_assignments')
        .insert(
          selectedBranches.map(branchId => ({
            branch_id: branchId,
            group_id: group.id
          }))
        );

      if (assignError) throw assignError;

      toast.success("Grup başarıyla oluşturuldu");
      onSuccess?.();
      resetForm();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error("Grup oluşturulurken bir hata oluştu");
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setGroupName("");
    setDescription("");
    setSelectedBranches([]);
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Grup Oluştur</DialogTitle>
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
              <Button variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button 
                onClick={handleCreateGroup}
                disabled={isCreating}
              >
                {isCreating ? 'Oluşturuluyor...' : 'Grup Oluştur'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}