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
  onAssign: (managerIds: string[], scheduledAt?: Date, expiresAt?: Date) => void;
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
      const response = await axios.get('/admin/users?role=manager');
      setManagers(response.data.map((manager: any) => ({
        id: manager._id,
        email: manager.email,
        first_name: manager.firstName,
        last_name: manager.lastName
      })));
    } catch (error: any) {
      console.error("Error fetching managers:", error);
      toast.error(error.message || "Failed to load managers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectManager = (manager: Manager) => {
    setSelectedManagers(prev => {
      const isSelected = prev.some(m => m.id === manager.id);
      if (isSelected) {
        return prev.filter(m => m.id !== manager.id);
      }
      return [...prev, manager];
    });
  };

  const handleAssign = async () => {
    try {
      const assignmentData = {
        managerIds: selectedManagers.map(m => m.id),
        scheduledAt: scheduledAt?.toISOString(),
        expiresAt: expiresAt?.toISOString()
      };

      await axios.post(`/admin/playlists/${playlistId}/assign-managers`, assignmentData);

      const message = selectedManagers.length > 0 
        ? `Playlist assigned to ${selectedManagers.length} managers`
        : "All manager assignments removed";
      
      toast.success(message);
      onAssign(selectedManagers.map(m => m.id), scheduledAt, expiresAt);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error assigning playlist:', error);
      toast.error(error.message || "Failed to assign playlist");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign to Managers</DialogTitle>
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
              Cancel
            </Button>
            <Button onClick={handleAssign}>
              {selectedManagers.length > 0 
                ? `Assign (${selectedManagers.length})`
                : "Remove All Assignments"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}