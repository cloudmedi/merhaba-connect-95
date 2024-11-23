export interface Company {
  id: string;
  name: string;
  subscriptionStatus: 'trial' | 'active' | 'expired';
  subscriptionEndsAt?: string;
  trialEndsAt?: string;
  trialStatus?: 'active' | 'expired';
  trialNotificationSent?: {
    '1_day': boolean;
    '3_days': boolean;
    '7_days': boolean;
  };
  maxBranches: number;
  maxDevices: number;
  createdAt: string;
  updatedAt: string;
}

export interface License {
  id: string;
  userId: string;
  type: 'trial' | 'active' | 'expired';
  startDate: string;
  endDate?: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}
