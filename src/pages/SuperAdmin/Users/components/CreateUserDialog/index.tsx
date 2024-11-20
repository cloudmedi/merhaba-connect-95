import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService } from "@/services/users";
import { UserForm } from "./UserForm";
import { FormValues, mapFormToCreateUserData } from "./formSchema";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const userData = mapFormToCreateUserData(values);
      return userService.createUser(userData);
    },
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error("Failed to create user: " + error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create User</DialogTitle>
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