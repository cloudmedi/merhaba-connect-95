import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ManagerList } from "./manager-selection/ManagerList";
import { SchedulingSection } from "./manager-selection/SchedulingSection";
import { Manager } from "./types";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface AssignManagersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (managerIds: string[], scheduledAt?: Date, expiresAt?: Date) => void;
  playlistId: string;
}

export function AssignManagersDialog({ 
  open, 
  onOpenChange, 
  onAssign,
  playlistId 
}: AssignManagersDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManagers, setSelectedManagers] = useState<Manager[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [scheduledAt, setScheduledAt] = useState<Date>();
  const [expiresAt, setExpiresAt] = useState<Date>();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      fetchManagers();
    }
  }, [open, searchQuery]);

  const fetchManagers = async () => {
    try {
      setIsLoading(true);

      if (!user?.id) {
        toast.error("No authenticated user found. Please log in again.");
        return;
      }

      // Tüm manager'ları getir, company_id kontrolü olmadan
      let query = supabase
        .from("profiles")
        .select("id, email, first_name, last_name, role, avatar_url")
        .eq("role", "manager")
        .eq("is_active", true);

      // Add search filter if there's a query
      if (searchQuery) {
        query = query.or(`email.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
      }

      const { data: managersData, error: managersError } = await query;

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
    if (selectedManagers.length === 0) {
      toast.error("Please select at least one manager");
      return;
    }

    try {
      // Önce mevcut atamayı temizle
      const { error: deleteError } = await supabase
        .from('playlist_assignments')
        .delete()
        .eq('playlist_id', playlistId);

      if (deleteError) throw deleteError;

      // Yeni atamaları ekle
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

      // Playlist tablosundaki assigned_to alanını güncelle
      const { error: updateError } = await supabase
        .from('playlists')
        .update({ assigned_to: selectedManagers.map(m => m.id) })
        .eq('id', playlistId);

      if (updateError) throw updateError;

      toast.success(`Playlist assigned to ${selectedManagers.length} managers`);
      onAssign(selectedManagers.map(m => m.id), scheduledAt, expiresAt);
      setSelectedManagers([]);
      setScheduledAt(undefined);
      setExpiresAt(undefined);
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search managers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <SchedulingSection
            scheduledAt={scheduledAt}
            expiresAt={expiresAt}
            onScheduledAtChange={setScheduledAt}
            onExpiresAtChange={setExpiresAt}
          />

          <ManagerList
            managers={managers}
            selectedManagers={selectedManagers}
            onSelectManager={handleSelectManager}
            isLoading={isLoading}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={selectedManagers.length === 0}
            >
              Assign ({selectedManagers.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
