import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Manager {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

interface AssignManagersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (managerIds: string[], scheduledAt: Date, expiresAt: Date | null) => void;
}

export function AssignManagersDialog({ open, onOpenChange, onAssign }: AssignManagersDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

Let me now implement the code changes to add manager selection and scheduling features to the playlist assignment system.

<lov-code>
First, let's create a new component for the manager selection dialog:

<lov-write file_path="src/components/playlists/AssignManagersDialog.tsx">
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Manager {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

interface AssignManagersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (managerIds: string[], scheduledAt?: Date, expiresAt?: Date) => void;
}

export function AssignManagersDialog({ open, onOpenChange, onAssign }: AssignManagersDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManagers, setSelectedManagers] = useState<Manager[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [scheduledAt, setScheduledAt] = useState<Date>();
  const [expiresAt, setExpiresAt] = useState<Date>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchManagers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .eq('role', 'manager')
        .ilike('email', `%${searchQuery}%`);

      if (error) throw error;
      setManagers(data || []);
    } catch (error) {
      console.error('Error fetching managers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchManagers();
    }
  }, [open, searchQuery]);

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
    onAssign(
      selectedManagers.map(m => m.id),
      scheduledAt,
      expiresAt
    );
    setSelectedManagers([]);
    setScheduledAt(undefined);
    setExpiresAt(undefined);
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

          <div className="flex gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-medium mb-2">Schedule (Optional)</h4>
              <div className="flex gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {scheduledAt ? format(scheduledAt, 'PPP') : "Schedule date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduledAt}
                      onSelect={setScheduledAt}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {expiresAt ? format(expiresAt, 'PPP') : "Expiry date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={expiresAt}
                      onSelect={setExpiresAt}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[300px] border rounded-md">
            <div className="p-4 space-y-2">
              {isLoading ? (
                <div className="text-center py-4">Loading managers...</div>
              ) : managers.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No managers found</div>
              ) : (
                managers.map((manager) => (
                  <div
                    key={manager.id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => handleSelectManager(manager)}
                  >
                    <Checkbox
                      checked={selectedManagers.some(m => m.id === manager.id)}
                      onCheckedChange={() => handleSelectManager(manager)}
                    />
                    <div>
                      <div className="font-medium">
                        {manager.first_name && manager.last_name
                          ? `${manager.first_name} ${manager.last_name}`
                          : 'Unnamed User'}
                      </div>
                      <div className="text-sm text-gray-500">{manager.email}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

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