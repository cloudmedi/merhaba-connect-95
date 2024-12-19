import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ManagerList } from "./manager-selection/ManagerList";
import { SchedulingSection } from "./manager-selection/SchedulingSection";
import { AssignManagersContent } from "./manager-selection/AssignManagersContent";
import { Manager } from "./types";
import { toast } from "sonner";
import axios from "@/lib/axios";

interface AssignManagersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (managers: Manager[], scheduledAt?: Date, expiresAt?: Date) => void;
  playlistId: string;
  initialSelectedManagers?: Manager[];
}

export function AssignManagersDialog({ 
  open, 
  onOpenChange, 
  onAssign,
  playlistId,
  initialSelectedManagers = []
}: AssignManagersDialogProps) {
  const [selectedManagers, setSelectedManagers] = useState<Manager[]>(initialSelectedManagers);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [scheduledAt, setScheduledAt] = useState<Date>();
  const [expiresAt, setExpiresAt] = useState<Date>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchManagers();
    }
  }, [open]);

  useEffect(() => {
    if (open && initialSelectedManagers) {
      setSelectedManagers(initialSelectedManagers);
    }
  }, [open, initialSelectedManagers]);

  const fetchManagers = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching managers...');
      const response = await axios.get('/admin/users', {
        params: { role: 'manager' }
      });
      
      console.log('Managers response:', response.data);

      const transformedManagers = response.data.map((manager: any) => ({
        _id: manager._id,
        id: manager._id,
        email: manager.email,
        firstName: manager.firstName,
        lastName: manager.lastName,
        first_name: manager.firstName,
        last_name: manager.lastName
      }));

      setManagers(transformedManagers);
    } catch (error: any) {
      console.error("Error fetching managers:", error);
      toast.error(error.response?.data?.error || "Yöneticiler yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectManager = (manager: Manager) => {
    setSelectedManagers(prev => {
      const isSelected = prev.some(m => m._id === manager._id);
      if (isSelected) {
        return prev.filter(m => m._id !== manager._id);
      }
      return [...prev, manager];
    });
  };

  const handleAssign = async () => {
    try {
      console.log('Assigning managers:', {
        selectedManagers,
        scheduledAt,
        expiresAt
      });

      // Ensure we're sending the correct ID format
      const managerIds = selectedManagers.map(manager => manager._id.toString());
      
      console.log('Sending manager IDs:', managerIds);

      await axios.post(`/admin/playlists/${playlistId}/assign-managers`, {
        managerIds,
        scheduledAt,
        expiresAt
      });

      await onAssign(selectedManagers, scheduledAt, expiresAt);
      toast.success("Yöneticiler başarıyla atandı");
      onOpenChange(false);
    } catch (error: any) {
      console.error('Manager assignment error:', error);
      toast.error(error.response?.data?.error || "Yönetici atama işlemi başarısız oldu");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Yönetici Ata</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <SchedulingSection
            scheduledAt={scheduledAt}
            expiresAt={expiresAt}
            onScheduledAtChange={setScheduledAt}
            onExpiresAtChange={setExpiresAt}
          />

          <AssignManagersContent
            managers={managers}
            selectedManagers={selectedManagers}
            onSelectManager={handleSelectManager}
            isLoading={isLoading}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button onClick={handleAssign}>
              {selectedManagers.length > 0 
                ? `Ata (${selectedManagers.length})`
                : "Tüm Atamaları Kaldır"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}