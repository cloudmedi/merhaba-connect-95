import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface LicenseRenewalDialogProps {
  user: { id: string; firstName: string; lastName: string; license?: { endDate: string } };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { startDate: string; endDate: string }) => Promise<void>;
}

export function LicenseRenewalDialog({ user, open, onOpenChange, onSubmit }: LicenseRenewalDialogProps) {
  const [endDate, setEndDate] = useState(user.license?.endDate || "");

  const handleSubmit = async () => {
    try {
      await onSubmit({ startDate: new Date().toISOString(), endDate });
      onOpenChange(false);
      toast.success("License renewed successfully");
    } catch (error) {
      console.error('Error renewing license:', error);
      toast.error("Failed to renew license");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renew License for {user.firstName} {user.lastName}</DialogTitle>
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