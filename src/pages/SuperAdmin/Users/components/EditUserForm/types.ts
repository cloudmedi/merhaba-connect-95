export interface EditUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  role: "super_admin" | "manager";
  companyName: string;
  password?: string;
}