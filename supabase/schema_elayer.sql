-- ── 환경영향평가 (ISO 14001) ────────────────────────────────
CREATE TABLE env_aspects (
  id uuid primary key default gen_random_uuid(),
  aspect_number text unique not null,
  category text not null,
  activity text not null,
  aspect text not null,
  impact text not null,
  condition text default 'normal',
  likelihood int check (likelihood between 1 and 5),
  severity int check (severity between 1 and 5),
  significance_score int generated always as (likelihood * severity) stored,
  is_significant boolean default false,
  legal_requirement text,
  control_measure text,
  owner_name text,
  created_at timestamptz default now()
);

-- ── 위험성평가 (ISO 45001) ───────────────────────────────────
CREATE TABLE hazard_assessments (
  id uuid primary key default gen_random_uuid(),
  hazard_number text unique not null,
  work_area text not null,
  work_type text not null,
  hazard text not null,
  risk_factor text,
  current_control text,
  likelihood int check (likelihood between 1 and 5),
  severity int check (severity between 1 and 5),
  risk_score int generated always as (likelihood * severity) stored,
  risk_level text generated always as (
    case
      when likelihood * severity >= 16 then 'critical'
      when likelihood * severity >= 11 then 'high'
      when likelihood * severity >= 6  then 'medium'
      else 'low'
    end
  ) stored,
  additional_control text,
  residual_likelihood int,
  residual_severity int,
  owner_name text,
  review_date date,
  created_at timestamptz default now()
);

-- ── 물질수지표 ──────────────────────────────────────────────
CREATE TABLE material_balances (
  id uuid primary key default gen_random_uuid(),
  record_month text not null,
  material_name text not null,
  material_type text not null,
  input_amount numeric,
  output_amount numeric,
  unit text not null,
  loss_amount numeric,
  notes text,
  created_at timestamptz default now()
);

-- ── 환경/안전 법규등록부 ─────────────────────────────────────
CREATE TABLE legal_requirements (
  id uuid primary key default gen_random_uuid(),
  law_number text unique not null,
  category text not null,
  law_name text not null,
  article text,
  requirement text not null,
  applicable_dept text,
  compliance_status text default 'compliant',
  next_review_date date,
  notes text,
  created_at timestamptz default now()
);

ALTER TABLE env_aspects         DISABLE ROW LEVEL SECURITY;
ALTER TABLE hazard_assessments  DISABLE ROW LEVEL SECURITY;
ALTER TABLE material_balances   DISABLE ROW LEVEL SECURITY;
ALTER TABLE legal_requirements  DISABLE ROW LEVEL SECURITY;
