import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/users";
import { toast } from "sonner";

interface LicenseRenewalDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LicenseRenewalDialog({ user, open, onOpenChange }: LicenseRenewalDialogProps) {
  const queryClient = useQueryClient();

  const renewLicenseMutation = useMutation({
    mutationFn: () => userService.renewLicense(user.id),
    onSuccess: () => {
      toast.success("License renewed successfully");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error("Failed to renew license: " + error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renew License</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to renew the license for {user.firstName} {user.lastName}?</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => renewLicenseMutation.mutate()}
              disabled={renewLicenseMutation.isPending}
            >
              {renewLicenseMutation.isPending ? "Renewing..." : "Renew License"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}