export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  role: "admin" | "manager";
  license: {
    type: "trial" | "premium";
    startDate: string;
    endDate: string;
    quantity: number;
  };
}