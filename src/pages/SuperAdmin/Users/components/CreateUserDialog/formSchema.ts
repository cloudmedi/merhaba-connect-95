import { z } from "zod";
import { CreateUserData } from "@/types/auth";

export const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").nonempty(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").nonempty(),
  email: z.string().email("Invalid email address").nonempty(),
  companyName: z.string().min(2, "Company name must be at least 2 characters").nonempty(),
  role: z.enum(["admin", "manager"]),
  license: z.object({
    type: z.enum(["trial", "premium"]),
    startDate: z.string().nonempty(),
    endDate: z.string().nonempty(),
    quantity: z.number().min(1)
  })
});

export type FormValues = z.infer<typeof formSchema>;

export const defaultValues: FormValues = {
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
};

export const mapFormToCreateUserData = (values: FormValues): CreateUserData => {
  if (!values.firstName || !values.lastName || !values.email || !values.companyName || !values.role || !values.license) {
    throw new Error("Missing required fields");
  }

  return {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    companyName: values.companyName,
    role: values.role,
    license: {
      type: values.license.type,
      startDate: values.license.startDate,
      endDate: values.license.endDate,
      quantity: values.license.quantity
    }
  };
};