import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";
import type { Device } from "../hooks/types";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  devices: Device[];
}

export function CreateGroupDialog({ open, onOpenChange, onSuccess, devices }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (device.branches?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(filteredDevices.map(d => d.id));
    }
  };

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
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Grup Oluştur</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Grup Adı</Label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Grup adı girin"
              />
            </div>

            <div>
              <Label>Açıklama</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Açıklama girin"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cihaz ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={handleSelectAll}
                className="whitespace-nowrap"
              >
                {selectedDevices.length === filteredDevices.length ? "Seçimi Kaldır" : "Tümünü Seç"}
              </Button>
            </div>

            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                {filteredDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                    onClick={() => {
                      setSelectedDevices(prev => 
                        prev.includes(device.id) 
                          ? prev.filter(id => id !== device.id)
                          : [...prev, device.id]
                      );
                    }}
                  >
                    <Checkbox
                      checked={selectedDevices.includes(device.id)}
                      onCheckedChange={() => {
                        setSelectedDevices(prev => 
                          prev.includes(device.id) 
                            ? prev.filter(id => id !== device.id)
                            : [...prev, device.id]
                        );
                      }}
                    />
                    <div>
                      <p className="font-medium text-sm">{device.name}</p>
                      {device.branches?.name && (
                        <p className="text-sm text-gray-500">{device.branches.name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {selectedDevices.length} cihaz seçildi
            </p>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
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