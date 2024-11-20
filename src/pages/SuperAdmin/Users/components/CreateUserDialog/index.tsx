import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService } from "@/services/users";
import { UserForm } from "./UserForm";
import { CreateUserData } from "@/types/auth";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: (values: CreateUserData) => userService.createUser(values),
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      if (error.message.includes('already exists')) {
        toast.error("A user with this email already exists");
      } else {
        toast.error("Failed to create user: " + error.message);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. They will receive an email with login instructions.
          </DialogDescription>
        </DialogHeader>
        <UserForm 
          onSubmit={(values) => createUserMutation.mutate(values)}
          isSubmitting={createUserMutation.isPending}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}