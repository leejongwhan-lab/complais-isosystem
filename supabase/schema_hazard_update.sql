-- ── hazard_assessments 컬럼 추가 (KRAS 확장) ─────────────────
ALTER TABLE hazard_assessments
  ADD COLUMN IF NOT EXISTS assessment_type text default 'kras',
  ADD COLUMN IF NOT EXISTS work_step       text,
  ADD COLUMN IF NOT EXISTS hazard_type     text,
  ADD COLUMN IF NOT EXISTS before_likelihood int,
  ADD COLUMN IF NOT EXISTS before_severity   int,
  ADD COLUMN IF NOT EXISTS after_likelihood  int,
  ADD COLUMN IF NOT EXISTS after_severity    int;

-- ── 공정위험성평가 (PHA) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS process_hazard_assessments (
  id                uuid primary key default gen_random_uuid(),
  pha_number        text unique not null,
  process_name      text not null,
  assessment_method text not null,
  node              text,
  deviation         text,
  cause             text,
  consequence       text,
  safeguard         text,
  likelihood        int check (likelihood between 1 and 5),
  severity          int check (severity  between 1 and 5),
  risk_score        int generated always as (likelihood * severity) stored,
  risk_level        text generated always as (
    case
      when likelihood * severity >= 16 then 'critical'
      when likelihood * severity >= 11 then 'high'
      when likelihood * severity >= 6  then 'medium'
      else 'low'
    end
  ) stored,
  recommendation text,
  action_party   text,
  target_date    date,
  status         text default 'open',
  created_at     timestamptz default now()
);

ALTER TABLE process_hazard_assessments DISABLE ROW LEVEL SECURITY;
