export type User = {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked' | 'suspended';
  personalNumber: string;
  phoneNumber: string;
  isEmailVerified?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  // Subscription fields
  subscriptionStatus?: 'active' | 'expired' | 'cancelled' | 'pending';
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  subscriptionDays?: number;
  lastPaymentDate?: string;
  paymentAmount?: number;
  paymentNote?: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type SubscriptionInfo = {
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate?: Date;
  endDate?: Date;
  daysRemaining: number;
  isActive: boolean;
  totalDays?: number;
  lastPayment?: {
    date?: Date;
    amount?: number;
    note?: string;
  };
};

export type GrantSubscriptionRequest = {
  userId: string;
  days: number;
  paymentAmount?: number;
  paymentNote?: string;
};

export type RevokeSubscriptionRequest = {
  userId: string;
  reason?: string;
}; 