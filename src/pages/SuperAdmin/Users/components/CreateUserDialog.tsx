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
import { supabase } from "@/integrations/supabase/client";

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
        // 1. Create company first
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: values.companyName,
            subscription_status: values.license.type,
            subscription_ends_at: values.license.end_date
          })
          .select()
          .single();

        if (companyError) throw companyError;

        // 2. Create auth user with firstName and lastName in metadata
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              firstName: values.firstName,
              lastName: values.lastName,
              role: values.role,
              companyId: company.id
            }
          }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('User creation failed');

        // 3. Wait for trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 4. Create license
        const { error: licenseError } = await supabase
          .from('licenses')
          .insert({
            user_id: authData.user.id,
            type: values.license.type,
            start_date: values.license.start_date,
            end_date: values.license.end_date,
            quantity: values.license.quantity
          });

        if (licenseError) throw licenseError;

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