import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BasicInfoSection } from "./CreateUserForm/BasicInfoSection";
import { LicenseSection } from "./CreateUserForm/LicenseSection";
import { createUserFormSchema } from "./CreateUserForm/schema";
import type { CreateUserFormValues } from "./CreateUserForm/types";
import { userService } from "@/services/users";

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
        end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        quantity: 1,
      },
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (values: CreateUserFormValues) => {
      try {
        // Önce şirketi oluştur
        const company = await userService.createCompany({
          name: values.companyName,
          subscriptionStatus: values.license.type,
          subscriptionEndsAt: values.license.end_date
        });

        // Kullanıcıyı oluştur
        const user = await userService.createUser({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          role: values.role,
          companyId: company.id
        });

        // Lisansı oluştur
        await userService.createLicense({
          userId: user.id,
          type: values.license.type,
          startDate: values.license.start_date,
          endDate: values.license.end_date,
          quantity: values.license.quantity
        });

        return { success: true };
      } catch (error: any) {
        console.error('Error creating user:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Kullanıcı başarıyla oluşturuldu");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error("Kullanıcı oluşturulurken hata: " + error.message);
    },
  });

  const onSubmit = (values: CreateUserFormValues) => {
    createUserMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#1A1F2C]">Yeni Kullanıcı Oluştur</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BasicInfoSection form={form} />
            <LicenseSection form={form} />

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button 
                type="submit" 
                className="bg-[#9b87f5] hover:bg-[#7E69AB]"
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? "Oluşturuluyor..." : "Kullanıcı Oluştur"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}