import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreateUserData } from "@/types/auth";
import { UserBasicInfo } from "./UserBasicInfo";
import { UserRoleSelect } from "./UserRoleSelect";
import { LicenseInfo } from "./LicenseInfo";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  role: z.enum(["admin", "manager"]),
  license: z.object({
    type: z.enum(["trial", "premium"]),
    startDate: z.string(),
    endDate: z.string(),
    quantity: z.number().min(1)
  })
});

interface UserFormProps {
  onSubmit: (data: CreateUserData) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function UserForm({ onSubmit, isSubmitting, onCancel }: UserFormProps) {
  const form = useForm<CreateUserData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      role: "manager",
      license: {
        type: "trial",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 1
      }
    },
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