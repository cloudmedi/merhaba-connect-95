import { z } from "zod";

export const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").nonempty("First name is required"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").nonempty("Last name is required"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  companyName: z.string().min(2, "Company name must be at least 2 characters").nonempty("Company name is required"),
  role: z.enum(["admin", "manager"]),
  license: z.object({
    type: z.enum(["trial", "premium"]),
    startDate: z.string().nonempty("Start date is required"),
    endDate: z.string().nonempty("End date is required"),
    quantity: z.number().min(1, "Quantity must be at least 1")
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