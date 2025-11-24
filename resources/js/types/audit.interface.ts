import { IClient } from "./client.interface";
import { IAuditsTypes, IAuditTypeItems } from "./auditsTypes.interface";

export interface IAudit {
  id: number;
  client_id: number;
  audit_type_id: number;
  creation_date: string;
  created_at: string;
  updated_at: string;
  client: IClient;
  audit_type: IAuditsTypes;
  items: IAuditItem[];
}

export interface IAuditItem {
  id: number;
  name: string;
  term: string;
  laws: string;
  date: string;
  expiry_date: string;
  documents: string;
  comments: string;
  apply: boolean;
  complies: boolean;
  audit_type_item: IAuditTypeItems;
  status: string;
}
