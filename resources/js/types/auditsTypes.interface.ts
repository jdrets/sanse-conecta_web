export interface IAuditsTypes {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface IAuditTypeItems {
  id: number;
  name: string;
  term: string;
  laws: string;
  order: number;
  audit_type_id: number;
  apply: boolean;
  complies: boolean;
  status: string;
  expiry_date: string;
}
