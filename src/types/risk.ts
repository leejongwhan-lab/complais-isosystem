export type RiskLevel    = 'critical' | 'high' | 'medium' | 'low';
export type RiskType     = 'risk' | 'opportunity';
export type RiskResponse = 'accept' | 'mitigate' | 'transfer' | 'avoid';
export type RiskStatus   = 'open' | 'in_progress' | 'closed';
export type ReviewStatus = 'planned' | 'completed';

export type Risk = {
  id: string;
  risk_number: string;
  type: RiskType;
  category: string;
  title: string;
  description: string | null;
  likelihood: number;
  impact: number;
  risk_score: number;
  risk_level: RiskLevel;
  response: RiskResponse;
  action_plan: string | null;
  owner_name: string | null;
  due_date: string | null;
  status: RiskStatus;
  related_capa_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ManagementReview = {
  id: string;
  review_number: string;
  review_date: string;
  chairperson: string | null;
  attendees: string | null;
  status: ReviewStatus;
  input_audit_results: string | null;
  input_customer_feedback: string | null;
  input_process_performance: string | null;
  input_nonconformities: string | null;
  input_risk_opportunities: string | null;
  output_improvement: string | null;
  output_resource_needs: string | null;
  output_policy_changes: string | null;
  created_at: string;
};
