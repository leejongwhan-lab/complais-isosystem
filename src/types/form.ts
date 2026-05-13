export type FieldType  = 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea' | 'table';
export type FieldWidth = 'half' | 'full';
export type FormPattern = 'B' | 'C' | 'D';
export type RecordStatus = 'draft' | 'completed' | 'approved';

export type TableColumn = {
  key:    string;
  label:  string;
  width?: number;
};

export type FormField = {
  key:         string;
  label:       string;
  type:        FieldType;
  required?:   boolean;
  options?:    string[];
  columns?:    TableColumn[];
  placeholder?: string;
  width?:      FieldWidth;
};

export type FormTemplate = {
  id:            string;
  form_code:     string;
  form_name:     string;
  category:      string;
  process_code:  string | null;
  pattern:       FormPattern;
  iso_clause:    string | null;
  standard:      string;
  plan_required: string;
  fields:        FormField[];
  print_layout:  Record<string, unknown> | null;
  is_active:     boolean;
  sort_order:    number;
  created_at:    string;
};

export type FormRecord = {
  id:           string;
  record_number: string;
  form_code:    string;
  form_name:    string;
  category:     string;
  data:         Record<string, unknown>;
  status:       RecordStatus;
  created_by:   string | null;
  approved_by:  string | null;
  related_id:   string | null;
  related_type: string | null;
  created_at:   string;
  updated_at:   string;
};

export type FormData = Record<string, string | number | boolean | Record<string, string>[]>;
