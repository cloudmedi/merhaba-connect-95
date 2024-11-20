export interface CreateUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  role: "admin" | "manager";
  license: {
    type: "trial" | "premium";
    startDate: Date;
    endDate: Date;
    quantity: number;
  };
}