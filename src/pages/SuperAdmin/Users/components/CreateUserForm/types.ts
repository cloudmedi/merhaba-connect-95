export interface CreateUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  role: "admin" | "manager";
  license: {
    type: "trial" | "premium";
    start_date: string;
    end_date: string;
    quantity: number;
  };
}