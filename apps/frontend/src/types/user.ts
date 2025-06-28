export type User = {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
  personalNumber: string;
  phoneNumber: string;
  isEmailVerified?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
}; 