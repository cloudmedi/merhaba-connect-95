import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Branch } from "@/pages/Manager/Announcements/types";
import { GroupForm } from "./GroupForm";
import { DeviceSelection } from "./DeviceSelection";

interface CreateGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  branches: Branch[];
}

export function CreateGroupDialog({ isOpen, onClose, onSuccess, branches }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Lütfen grup adı girin");
      return;
    }

    if (selectedDevices.length === 0) {
      toast.error("Lütfen en az bir cihaz seçin");
      return;
    }

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

      // Get branch IDs for selected devices
      const { data: deviceData, error: deviceError } = await supabase
        .from('devices')
        .select('branch_id')
        .in('id', selectedDevices)
        .not('branch_id', 'is', null);

      if (deviceError) throw deviceError;

      // Create branch group assignments
      const branchIds = deviceData
        .map(d => d.branch_id)
        .filter((id): id is string => id !== null);

      if (branchIds.length > 0) {
        const { error: assignError } = await supabase
          .from('branch_group_assignments')
          .insert(
            branchIds.map(branchId => ({
              branch_id: branchId,
              group_id: group.id
            }))
          );

        if (assignError) throw assignError;
      }

      toast.success("Grup başarıyla oluşturuldu");
      onSuccess?.();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error("Grup oluşturulurken bir hata oluştu");
    }
  };

  const resetForm = () => {
    setGroupName("");
    setDescription("");
    setSelectedDevices([]);
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

          <DeviceSelection
            devices={branches}
            selectedDevices={selectedDevices}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setSelectedDevices={setSelectedDevices}
          />

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {selectedDevices.length} cihaz seçildi
            </p>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button onClick={handleCreateGroup}>
                Grup Oluştur
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}