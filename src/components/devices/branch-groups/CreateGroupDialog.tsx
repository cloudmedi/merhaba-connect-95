import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DeviceSelection } from "@/components/devices/branch-groups/DeviceSelection";
import { Separator } from "@/components/ui/separator";

interface CreateGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export function CreateGroupDialog({ isOpen, onClose, onSuccess }: CreateGroupDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!name.trim()) {
      toast.error("Lütfen grup adı girin");
      return;
    }

    if (selectedDevices.length === 0) {
      toast.error("Lütfen en az bir cihaz seçin");
      return;
    }

    setIsLoading(true);
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
          name,
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
      await onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error("Grup oluşturulurken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setSelectedDevices([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Yeni Grup Oluştur</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Grup Adı</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Grup adı girin"
              />
            </div>

            <div>
              <Label>Açıklama</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Grup açıklaması girin"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label className="mb-4 block">Cihazlar</Label>
            <DeviceSelection
              selectedDevices={selectedDevices}
              onDevicesChange={setSelectedDevices}
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-gray-500">
              {selectedDevices.length} cihaz seçildi
            </p>
            <div className="space-x-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                İptal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Oluşturuluyor..." : "Oluştur"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}