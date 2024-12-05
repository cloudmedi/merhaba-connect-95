import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { useDevices } from "../../Devices/hooks/useDevices";
import { toast } from "sonner";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreated: () => void;
}

export function CreateGroupDialog({ open, onOpenChange, onGroupCreated }: CreateGroupDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { devices, isLoading } = useDevices();

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      setSearchQuery("");
      setSelectedDevices(new Set());
      setIsSubmitting(false);
    }
  }, [open]);

  const filteredDevices = devices?.filter(device => 
    device.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deviceId)) {
        newSet.delete(deviceId);
      } else {
        newSet.add(deviceId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (filteredDevices.length === selectedDevices.size) {
      setSelectedDevices(new Set());
    } else {
      setSelectedDevices(new Set(filteredDevices.map(d => d.id)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Grup adı gereklidir");
      return;
    }

    try {
      setIsSubmitting(true);

      const { data: group, error: groupError } = await supabase
        .from('branch_groups')
        .insert([{ name, description }])
        .select()
        .single();

      if (groupError) throw groupError;

      if (selectedDevices.size > 0) {
        const assignments = Array.from(selectedDevices).map(deviceId => ({
          group_id: group.id,
          branch_id: deviceId
        }));

        const { error: assignError } = await supabase
          .from('branch_group_assignments')
          .insert(assignments);

        if (assignError) throw assignError;
      }

      toast.success("Grup başarıyla oluşturuldu");
      onGroupCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error("Grup oluşturulurken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Yeni Grup Oluştur</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Grup Adı</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Grup adını girin"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Grup açıklamasını girin"
              />
            </div>

            <div>
              <Label>Cihazlar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cihaz ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 py-2">
            <Checkbox
              id="select-all"
              checked={filteredDevices.length > 0 && filteredDevices.length === selectedDevices.size}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm">
              Tümünü Seç ({selectedDevices.size} / {filteredDevices.length})
            </label>
          </div>

          <ScrollArea className="flex-1 border rounded-md">
            <div className="p-4 space-y-2">
              {isLoading ? (
                <div className="text-center py-4">Yükleniyor...</div>
              ) : filteredDevices.length === 0 ? (
                <div className="text-center py-4">Cihaz bulunamadı</div>
              ) : (
                filteredDevices.map((device) => (
                  <div key={device.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={device.id}
                      checked={selectedDevices.has(device.id)}
                      onCheckedChange={() => handleDeviceSelect(device.id)}
                    />
                    <label htmlFor={device.id} className="text-sm">
                      {device.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Oluşturuluyor..." : "Oluştur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}