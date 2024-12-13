import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ManagerList } from "./manager-selection/ManagerList";
import { SchedulingSection } from "./manager-selection/SchedulingSection";
import { AssignManagersContent } from "./manager-selection/AssignManagersContent";
import { Manager } from "./types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/ManagerAuthContext";

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
  const { user } = useAuth();

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

      if (!user?.id) {
        toast.error("No authenticated user found. Please log in again.");
        return;
      }

      const { data: managersData, error: managersError } = await supabase
        .from("profiles")
        .select("id, email, first_name, last_name, role, avatar_url")
        .eq("role", "manager")
        .eq("is_active", true);

      if (managersError) throw managersError;

      setManagers(managersData || []);
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
      // Önce mevcut atamaları temizle
      const { error: deleteError } = await supabase
        .from('playlist_assignments')
        .delete()
        .eq('playlist_id', playlistId);

      if (deleteError) throw deleteError;

      // Yeni atamalar varsa ekle
      if (selectedManagers.length > 0) {
        const assignments = selectedManagers.map(manager => ({
          user_id: manager.id,
          playlist_id: playlistId,
          scheduled_at: scheduledAt?.toISOString() || new Date().toISOString(),
          expires_at: expiresAt?.toISOString() || null,
          notification_sent: false
        }));

        const { error: insertError } = await supabase
          .from('playlist_assignments')
          .insert(assignments);

        if (insertError) throw insertError;
      }

      // Playlist'in assigned_to alanını güncelle
      const { error: updateError } = await supabase
        .from('playlists')
        .update({ assigned_to: selectedManagers.map(m => m.id) })
        .eq('id', playlistId);

      if (updateError) throw updateError;

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
