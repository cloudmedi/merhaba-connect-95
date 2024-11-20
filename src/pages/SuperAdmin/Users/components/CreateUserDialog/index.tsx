import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { userService } from "@/services/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateUserData } from "@/types/auth";
import { UserBasicInfo } from "./UserBasicInfo";
import { UserRoleSelect } from "./UserRoleSelect";
import { LicenseInfo } from "./LicenseInfo";
import { formSchema, FormValues, defaultValues } from "./formSchema";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const createUserMutation = useMutation({
    mutationFn: (values: CreateUserData) => {
      return userService.createUser(values);
    },
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to create user: " + error.message);
    },
  });

  const onSubmit = (values: FormValues) => {
    // Ensure all required fields are present before submitting
    const userData: CreateUserData = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      companyName: values.companyName,
      role: values.role,
      license: {
        type: values.license.type,
        startDate: values.license.startDate,
        endDate: values.license.endDate,
        quantity: values.license.quantity
      }
    };
    createUserMutation.mutate(userData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create User</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserBasicInfo form={form} />
            <UserRoleSelect form={form} />
            <LicenseInfo form={form} />

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#9b87f5] hover:bg-[#7E69AB]"
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}