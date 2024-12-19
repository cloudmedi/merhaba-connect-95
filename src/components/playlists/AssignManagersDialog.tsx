import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ManagerList } from "./manager-selection/ManagerList";
import { AssignManagersContent } from "./manager-selection/AssignManagersContent";
import { Manager } from "./types";
import axios from "@/lib/axios";

interface AssignManagersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onManagersSelected: (managers: Manager[]) => void;
  initialSelectedManagers?: Manager[];
}

export function AssignManagersDialog({ 
  open, 
  onOpenChange,
  onManagersSelected,
  initialSelectedManagers = []
}: AssignManagersDialogProps) {
  const [selectedManagers, setSelectedManagers] = useState<Manager[]>(initialSelectedManagers);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      console.log('Dialog opened with initial managers:', initialSelectedManagers);
      const validManagers = (initialSelectedManagers || []).filter(manager => 
        manager && (manager._id || manager.id)
      );
      setSelectedManagers(validManagers);
      fetchManagers();
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

      const transformedManagers = (response.data || [])
        .filter((manager: any) => manager && manager._id)
        .map((manager: any) => ({
          _id: manager._id,
          id: manager._id,
          email: manager.email || '',
          firstName: manager.firstName || '',
          lastName: manager.lastName || ''
        }));

      setManagers(transformedManagers);
    } catch (error: any) {
      console.error("Error fetching managers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    onManagersSelected(selectedManagers);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Managers</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <AssignManagersContent
            managers={managers}
            selectedManagers={selectedManagers}
            onSelectManager={(manager) => {
              setSelectedManagers(prev => {
                const isSelected = prev.some(m => m._id === manager._id);
                if (isSelected) {
                  return prev.filter(m => m._id !== manager._id);
                }
                return [...prev, manager];
              });
            }}
            isLoading={isLoading}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Confirm Selection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}