export interface CreateUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "manager";
  companyName: string;
  license: {
    type: "trial" | "premium";
    start_date: string;
    end_date: string;
    quantity: number;
  };
}