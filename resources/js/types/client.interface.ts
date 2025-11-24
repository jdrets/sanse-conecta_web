export interface IClient {
  id: number;
  name: string;
  address: string;
  cadastral_nomenclature: string;
  phone: string;
  cuit: string;
  contact_name: string;
  responsible_email: string;
  environmental_audit_responsible: string;
  safety_audit_responsible: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  user_access: IClientAccess;
}

export interface IClientAccess {
  id: number;
  email: string;
  email_verified_at: string | null;
  role: string;
  client_id: number;
  created_at: string;
  updated_at: string;
}
