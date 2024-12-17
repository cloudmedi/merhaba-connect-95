import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useUserActions } from "./hooks/useUserActions";

interface LicenseRenewalDialogProps {
  user: { id: string; name: string; license?: { endDate: string } };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LicenseRenewalDialog({ user, open, onOpenChange }: LicenseRenewalDialogProps) {
  const [endDate, setEndDate] = useState(user.license?.endDate || "");
  const { handleRenewLicense } = useUserActions();

  const handleSubmit = async () => {
    try {
      await handleRenewLicense(user.id, { endDate });
      onOpenChange(false);
    } catch (error) {
      console.error('Error renewing license:', error);
      toast.error("Failed to renew license");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renew License for {user.name}</DialogTitle>
        </DialogHeader>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>
        <div className="mt-4">
          <Button onClick={handleSubmit}>Renew License</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}