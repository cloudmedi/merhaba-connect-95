import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/types/auth";
import { format } from "date-fns";

interface ViewUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewUserDialog({ user, open, onOpenChange }: ViewUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">User Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
              <p className="mt-1">{`${user.firstName} ${user.lastName}`}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Email</h4>
              <p className="mt-1">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Company</h4>
              <p className="mt-1">{user.companyName || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Role</h4>
              <p className="mt-1 capitalize">{user.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <p className="mt-1">{user.isActive ? 'Active' : 'Inactive'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">License</h4>
              <p className="mt-1 capitalize">{user.license || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">License Expiry</h4>
              <p className="mt-1">
                {user.expiryDate 
                  ? format(new Date(user.expiryDate), 'dd MMM yyyy')
                  : 'N/A'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Last Login</h4>
              <p className="mt-1">
                {user.lastLoginAt 
                  ? format(new Date(user.lastLoginAt), 'dd MMM yyyy HH:mm')
                  : 'Never'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Created At</h4>
              <p className="mt-1">
                {format(new Date(user.createdAt), 'dd MMM yyyy')}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Updated At</h4>
              <p className="mt-1">
                {format(new Date(user.updatedAt), 'dd MMM yyyy')}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}