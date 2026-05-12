export type Role = 'CUSTOMER' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  avatarUrl: string | null;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}
