import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserBasicInfo } from "./UserBasicInfo";
import { UserRoleSelect } from "./UserRoleSelect";
import { LicenseInfo } from "./LicenseInfo";
import { formSchema, FormValues, defaultValues } from "./formSchema";
import { Loader2 } from "lucide-react";

interface UserFormProps {
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function UserForm({ onSubmit, isSubmitting, onCancel }: UserFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange"
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <UserBasicInfo form={form} />
          <UserRoleSelect form={form} />
          <LicenseInfo form={form} />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onCancel} type="button">
            İptal
          </Button>
          <Button 
            type="submit" 
            className="bg-[#9b87f5] hover:bg-[#7E69AB]"
            disabled={isSubmitting || !form.formState.isValid}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              'Kullanıcı Oluştur'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}