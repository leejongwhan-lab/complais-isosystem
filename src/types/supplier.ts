export type SupplierStatus = 'approved' | 'conditional' | 'pending' | 'suspended';
export type SupplierGrade  = 'A' | 'B' | 'C' | 'D';

export type Supplier = {
  id: string;
  company_name: string;
  category: string;
  grade: SupplierGrade;
  total_score: number;
  quality_score: number;
  delivery_score: number;
  price_score: number;
  cooperation_score: number;
  iso_certified: boolean;
  last_evaluation_date: string | null;
  next_evaluation_date: string | null;
  status: SupplierStatus;
  ceo_name: string | null;
  address: string | null;
  contact: string | null;
  created_at: string;
  updated_at: string;
};
