export type Document = {
  id: string;
  doc_number: string;
  layer: string;
  process_no: string;
  doc_type: string;
  industry_code: string | null;
  version: string;
  title: string;
  description: string | null;
  status: string;
  owner_name: string | null;
  related_iso: string | null;
  reviewer: string | null;
  approver: string | null;
  review_requested_at: string | null;
  approved_at: string | null;
  obsoleted_at: string | null;
  reject_reason: string | null;
  created_at: string;
  updated_at: string;
  turtle_data?: Record<string, unknown> | null;
};

export type DocumentHistory = {
  id: string;
  document_id: string;
  action: string;
  from_status: string | null;
  to_status: string | null;
  actor_name: string | null;
  note: string | null;
  created_at: string;
};

export type DocumentSection = {
  id: string;
  document_id: string;
  section_order: number;
  section_key: string;
  section_title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
};

export type DocumentVersion = {
  id: string;
  document_id: string;
  version: string;
  changed_by: string | null;
  change_reason: string | null;
  content_snapshot: Record<string, unknown> | null;
  created_at: string;
};

export type DocumentApproval = {
  id: string;
  document_id: string;
  step: number;
  step_name: string;
  approver_name: string | null;
  status: 'pending' | 'approved' | 'rejected';
  comment: string | null;
  acted_at: string | null;
  created_at: string;
};

export type DocumentFile = {
  id: string;
  document_id: string;
  version: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  file_type: string | null;
  uploaded_by: string | null;
  created_at: string;
};
