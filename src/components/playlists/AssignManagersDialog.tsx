import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  initialSelectedManagers?: Manager[];
}

export function AssignManagersDialog({ 
  open, 
  onOpenChange, 
  onAssign,
  playlistId,
  initialSelectedManagers = []
}: AssignManagersDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManagers, setSelectedManagers] = useState<Manager[]>(initialSelectedManagers);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [scheduledAt, setScheduledAt] = useState<Date>();
  const [expiresAt, setExpiresAt] = useState<Date>();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assigned");
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      fetchManagers();
    }
  }, [open, searchQuery]);

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

      let query = supabase
        .from("profiles")
        .select("id, email, first_name, last_name, role, avatar_url")
        .eq("role", "manager")
        .eq("is_active", true);

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
      // Önce mevcut atamaları temizle
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

      // Playlist'in assigned_to alanını güncelle
      const { error: updateError } = await supabase
        .from('playlists')
        .update({ assigned_to: selectedManagers.map(m => m.id) })
        .eq('id', playlistId);

      if (updateError) throw updateError;

      toast.success(`Playlist assigned to ${selectedManagers.length} managers`);
      onAssign(selectedManagers.map(m => m.id), scheduledAt, expiresAt);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error assigning playlist:', error);
      toast.error(error.message || "Failed to assign playlist");
    }
  };

  const filteredManagers = activeTab === "assigned" 
    ? selectedManagers
    : managers.filter(m => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return (
          m.email.toLowerCase().includes(searchLower) ||
          m.first_name?.toLowerCase().includes(searchLower) ||
          m.last_name?.toLowerCase().includes(searchLower)
        );
      });

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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="assigned" className="relative">
                Assigned Managers
                {selectedManagers.length > 0 && (
                  <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-600">
                    {selectedManagers.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="all">All Managers</TabsTrigger>
            </TabsList>

            <TabsContent value="assigned" className="mt-4">
              {selectedManagers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No managers assigned yet
                </div>
              ) : (
                <ManagerList
                  managers={filteredManagers}
                  selectedManagers={selectedManagers}
                  onSelectManager={handleSelectManager}
                  isLoading={isLoading}
                />
              )}
            </TabsContent>

            <TabsContent value="all" className="mt-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search managers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <ManagerList
                managers={filteredManagers}
                selectedManagers={selectedManagers}
                onSelectManager={handleSelectManager}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>

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