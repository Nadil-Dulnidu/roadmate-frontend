export interface User {
  user_id: number;
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  created_at: Date;
}

export type UserRole = 'ADMIN' | 'RENTER' | 'STAFF' | 'OWNER';
