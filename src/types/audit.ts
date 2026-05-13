export type AuditStatus = 'planned' | 'in_progress' | 'completed';
export type AuditType   = 'system'  | 'process'    | 'product';

export type Audit = {
  id: string;
  audit_number: string;
  audit_type: AuditType;
  status: AuditStatus;
  auditor_name: string;
  target_process: string;
  planned_date: string;
  completed_date: string | null;
  conformity_count: number;
  nonconformity_count: number;
  observation_count: number;
  created_at: string;
  updated_at: string;
};
