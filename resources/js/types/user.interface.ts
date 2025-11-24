export interface IUser {
  id: number;
  email: string;
  role: UserRole;
  client_id: number | null;
}

export enum UserRole {
  ADMIN = "admin",
  CLIENT_OPERATOR = "client_operator",
  OPERATOR = "operator",
}
