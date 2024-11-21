import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { userService } from "@/services/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BasicInfoSection } from "./CreateUserForm/BasicInfoSection";
import { LicenseSection } from "./CreateUserForm/LicenseSection";
import { createUserFormSchema } from "./CreateUserForm/schema";
import type { CreateUserFormValues } from "./CreateUserForm/types";
import { addDays } from "date-fns";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      companyName: "",
      role: "manager",
      license: {
        type: "trial",
        start_date: new Date().toISOString(),
        end_date: addDays(new Date(), 14).toISOString(), // 14 days trial
        quantity: 1,
      },
    },
  });

  const createUserMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      toast.success("User created successfully with 14-day trial period");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error("Failed to create user: " + error.message);
    },
  });

  const onSubmit = (values: CreateUserFormValues) => {
    createUserMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#1A1F2C]">
            Create New User
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BasicInfoSection form={form} />
            <LicenseSection form={form} />

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