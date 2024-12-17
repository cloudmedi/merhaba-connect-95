import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { createUserFormSchema } from "./schema";
import { BasicInfoSection } from "./BasicInfoSection";
import { LicenseSection } from "./LicenseSection";
import type { CreateUserFormValues } from "./types";

interface CreateUserFormProps {
  onSuccess: () => void;
}

export function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit = async (data: CreateUserFormValues) => {
    try {
      setIsLoading(true);
      // API call would go here
      console.log("Form data:", data);
      toast.success("User created successfully");
      onSuccess();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoSection form={form} />
        <LicenseSection form={form} />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}