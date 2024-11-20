import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserData } from "@/types/auth";
import { UserBasicInfo } from "./UserBasicInfo";
import { UserRoleSelect } from "./UserRoleSelect";
import { LicenseInfo } from "./LicenseInfo";
import { formSchema, FormValues, defaultValues } from "./formSchema";
import { Loader2 } from "lucide-react";

interface UserFormProps {
  onSubmit: (data: CreateUserData) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function UserForm({ onSubmit, isSubmitting, onCancel }: UserFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange"
  });

  const handleSubmit = (data: FormValues) => {
    const userData: CreateUserData = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      role: data.role,
      license: {
        type: data.license.type,
        startDate: data.license.startDate,
        endDate: data.license.endDate,
        quantity: data.license.quantity
      }
    };
    
    onSubmit(userData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-6">
          <UserBasicInfo form={form} />
          <UserRoleSelect form={form} />
          <LicenseInfo form={form} />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-[#9b87f5] hover:bg-[#7E69AB]"
            disabled={isSubmitting || !form.formState.isValid}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create User'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}