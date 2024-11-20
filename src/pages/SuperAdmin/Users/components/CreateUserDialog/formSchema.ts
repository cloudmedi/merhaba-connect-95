import { z } from "zod";
import { CreateUserData } from "@/types/auth";

const licenseSchema = z.object({
  type: z.enum(['trial', 'premium']),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  quantity: z.number().min(1, "At least 1 license is required")
}).required();

export const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").nonempty("First name is required"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").nonempty("Last name is required"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  companyName: z.string().min(2, "Company name must be at least 2 characters").nonempty("Company name is required"),
  role: z.enum(['admin', 'manager']),
  license: licenseSchema
}).required();

// This ensures the schema matches CreateUserData exactly
export type FormValues = z.infer<typeof formSchema>;

// Verify at compile time that FormValues matches CreateUserData
type VerifyType = FormValues extends CreateUserData ? true : false;
type VerifyReverse = CreateUserData extends FormValues ? true : false;
// If there's a type error here, the schemas don't match
const _typeCheck: [VerifyType, VerifyReverse] = [true, true];

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