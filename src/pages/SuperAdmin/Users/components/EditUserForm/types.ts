export interface EditUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "manager";
  companyName: string;
  password?: string;
}