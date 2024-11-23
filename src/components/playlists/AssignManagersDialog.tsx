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
}

export function AssignManagersDialog({ 
  open, 
  onOpenChange, 
  onAssign 
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
  }, [open, searchQuery, user?.id]);

  const fetchManagers = async () => {
    try {
      setIsLoading(true);
      console.log("Current authenticated user:", user); // Debug log

      if (!user?.id) {
        toast.error("No authenticated user found. Please log in again.");
        return;
      }

      // Get the current user's company ID
      const { data: adminProfile, error: profileError } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user.id)
        .single();

      console.log("Admin profile:", adminProfile); // Debug log

      if (profileError) {
        console.error("Profile error:", profileError);
        toast.error("Failed to get company information");
        return;
      }

      if (!adminProfile?.company_id) {
        toast.error("No company associated with your account");
        return;
      }

      // Fetch all managers from the same company
      let query = supabase
        .from("profiles")
        .select("id, email, first_name, last_name, role, avatar_url")
        .eq("company_id", adminProfile.company_id)
        .eq("role", "manager")
        .eq("is_active", true);

      // Add search filter if there's a query
      if (searchQuery) {
        query = query.or(`email.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
      }

      const { data: managersData, error: managersError } = await query;

      console.log("Managers data:", managersData); // Debug log

      if (managersError) {
        console.error("Managers fetch error:", managersError);
        throw managersError;
      }

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

  const handleAssign = () => {
    if (selectedManagers.length === 0) {
      toast.error("Please select at least one manager");
      return;
    }

    onAssign(
      selectedManagers.map(m => m.id),
      scheduledAt,
      expiresAt
    );
    setSelectedManagers([]);
    setScheduledAt(undefined);
    setExpiresAt(undefined);
    onOpenChange(false);
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