export type EnvCategory      = '대기' | '수질' | '폐기물' | '에너지' | '토양' | '소음';
export type EnvCondition     = 'normal' | 'abnormal' | 'emergency';
export type ComplianceStatus = 'compliant' | 'non_compliant' | 'na';
export type MaterialType     = '원료' | '제품' | '폐기물' | '폐수' | '대기';
export type LegalCategory    = '환경' | '안전보건' | '화학물질';
export type RiskLevel        = 'critical' | 'high' | 'medium' | 'low';
export type AssessmentType   = 'kras' | 'pha';
export type PHAStatus        = 'open' | 'in_progress' | 'closed';

export type EnvAspect = {
  id: string;
  aspect_number: string;
  category: EnvCategory;
  activity: string;
  aspect: string;
  impact: string;
  condition: EnvCondition;
  likelihood: number;
  severity: number;
  significance_score: number;
  is_significant: boolean;
  legal_requirement: string | null;
  control_measure: string | null;
  owner_name: string | null;
  created_at: string;
};

export type HazardAssessment = {
  id: string;
  hazard_number: string;
  assessment_type: AssessmentType;
  work_area: string;
  work_type: string;
  work_step: string | null;
  hazard_type: string | null;
  hazard: string;
  risk_factor: string | null;
  current_control: string | null;
  likelihood: number;
  severity: number;
  risk_score: number;
  risk_level: RiskLevel;
  before_likelihood: number | null;
  before_severity: number | null;
  after_likelihood: number | null;
  after_severity: number | null;
  additional_control: string | null;
  residual_likelihood: number | null;
  residual_severity: number | null;
  owner_name: string | null;
  review_date: string | null;
  created_at: string;
};

export type ProcessHazardAssessment = {
  id: string;
  pha_number: string;
  process_name: string;
  assessment_method: string;
  node: string | null;
  deviation: string | null;
  cause: string | null;
  consequence: string | null;
  safeguard: string | null;
  likelihood: number;
  severity: number;
  risk_score: number;
  risk_level: RiskLevel;
  recommendation: string | null;
  action_party: string | null;
  target_date: string | null;
  status: PHAStatus;
  created_at: string;
};

export type MaterialBalance = {
  id: string;
  record_month: string;
  material_name: string;
  material_type: MaterialType;
  input_amount: number | null;
  output_amount: number | null;
  unit: string;
  loss_amount: number | null;
  notes: string | null;
  created_at: string;
};

export type LegalRequirement = {
  id: string;
  law_number: string;
  category: LegalCategory;
  law_name: string;
  article: string | null;
  requirement: string;
  applicable_dept: string | null;
  compliance_status: ComplianceStatus;
  next_review_date: string | null;
  notes: string | null;
  created_at: string;
};
