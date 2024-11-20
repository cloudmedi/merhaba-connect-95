import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/types/auth";
import { format } from "date-fns";

interface ViewUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return format(date, 'dd MMM yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

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
              <p className="mt-1">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Email</h4>
              <p className="mt-1">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Company</h4>
              <p className="mt-1">{user.company?.name || 'N/A'}</p>
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
              <p className="mt-1 capitalize">{user.license?.type || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">License Start Date</h4>
              <p className="mt-1">
                {formatDate(user.license?.startDate)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">License End Date</h4>
              <p className="mt-1">
                {formatDate(user.license?.endDate)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Created At</h4>
              <p className="mt-1">
                {formatDate(user.createdAt)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Updated At</h4>
              <p className="mt-1">
                {formatDate(user.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}