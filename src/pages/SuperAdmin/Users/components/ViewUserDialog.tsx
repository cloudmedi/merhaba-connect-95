import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ViewUserDialogProps {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    license?: {
      startDate: string;
      endDate: string;
    };
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewUserDialog({ user, open, onOpenChange }: ViewUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div>
          <h3>User Information</h3>
          <p>Name: {user.first_name} {user.last_name}</p>
          <p>Email: {user.email}</p>
        </div>
        <div>
          <h3>License Information</h3>
          <p>Start Date: {user.license?.startDate}</p>
          <p>End Date: {user.license?.endDate}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
