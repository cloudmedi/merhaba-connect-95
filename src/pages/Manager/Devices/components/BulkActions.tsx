import { Button } from "@/components/ui/button";
import { Power, RefreshCw, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface BulkActionsProps {
  selectedDevices: string[];
  onPowerAll: () => void;
  onResetAll: () => void;
  onDeleteAll: () => void;
}

export function BulkActions({
  selectedDevices,
  onPowerAll,
  onResetAll,
  onDeleteAll,
}: BulkActionsProps) {
  const handlePowerAll = () => {
    onPowerAll();
    toast.success(`Power command sent to ${selectedDevices.length} devices`);
  };

  const handleResetAll = () => {
    onResetAll();
    toast.success(`Reset command sent to ${selectedDevices.length} devices`);
  };

  return (
    <div className="flex gap-2 mb-6">
      <Button
        variant="outline"
        onClick={handlePowerAll}
        disabled={selectedDevices.length === 0}
        className="flex items-center gap-2"
      >
        <Power className="h-4 w-4" />
        Power Selected
      </Button>
      <Button
        variant="outline"
        onClick={handleResetAll}
        disabled={selectedDevices.length === 0}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Reset Selected
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            disabled={selectedDevices.length === 0}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Devices</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedDevices.length} selected devices? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteAll}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}