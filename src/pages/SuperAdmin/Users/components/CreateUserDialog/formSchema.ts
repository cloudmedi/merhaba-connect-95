import * as z from "zod";

export const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").required(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").required(),
  email: z.string().email("Invalid email address").required(),
  companyName: z.string().min(2, "Company name must be at least 2 characters").required(),
  role: z.enum(["admin", "manager"]).required(),
  license: z.object({
    type: z.enum(["trial", "premium"]).required(),
    startDate: z.string().required(),
    endDate: z.string().required(),
    quantity: z.number().min(1).required()
  }).required()
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