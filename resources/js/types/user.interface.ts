export interface IUser {
  id: number;
  email: string;
  role: UserRole;
  client_id: number | null;
  name?: string;
  phone?: string | null;
  address?: string | null;
  publication_max?: number;
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  CLIENT_OPERATOR = "client_operator",
  OPERATOR = "operator",
}
