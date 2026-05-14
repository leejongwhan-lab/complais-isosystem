export type CapaStatus = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8' | 'completed';
export type EffectivenessStatus = 'pending' | 'verified' | 'failed';

export type Capa = {
  id: string;
  capa_number: string;
  source: string;
  grade: 'A' | 'B' | 'C';
  status: CapaStatus;
  current_step: number;
  title: string;
  description: string | null;
  owner_name: string | null;
  due_date: string | null;
  related_doc_id: string | null;
  related_audit_id: string | null;
  effectiveness_due_date: string | null;
  effectiveness_result: string | null;
  effectiveness_status: EffectivenessStatus;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
};
