import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserData } from "@/types/auth";
import { UserBasicInfo } from "./UserBasicInfo";
import { UserRoleSelect } from "./UserRoleSelect";
import { LicenseInfo } from "./LicenseInfo";
import { formSchema, defaultValues } from "./formSchema";

interface UserFormProps {
  onSubmit: (data: CreateUserData) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function UserForm({ onSubmit, isSubmitting, onCancel }: UserFormProps) {
  const form = useForm<CreateUserData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <UserBasicInfo form={form} />
        <UserRoleSelect form={form} />
        <LicenseInfo form={form} />

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-[#9b87f5] hover:bg-[#7E69AB]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}