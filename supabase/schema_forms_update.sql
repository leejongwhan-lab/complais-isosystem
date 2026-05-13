-- ── form_templates 버전 관리 컬럼 추가 ────────────────────────
ALTER TABLE form_templates
ADD COLUMN IF NOT EXISTS version      text default 'v1.0',
ADD COLUMN IF NOT EXISTS last_updated date,
ADD COLUMN IF NOT EXISTS legal_basis  text;

-- ── env_aspects 유의성 자동계산 컬럼 추가 ─────────────────────
ALTER TABLE env_aspects
ADD COLUMN IF NOT EXISTS condition              text,
ADD COLUMN IF NOT EXISTS scale_score            int,
ADD COLUMN IF NOT EXISTS severity_score         int,
ADD COLUMN IF NOT EXISTS frequency_score        int,
ADD COLUMN IF NOT EXISTS significance_score_new int
  GENERATED ALWAYS AS (
    COALESCE(scale_score, 0) *
    COALESCE(severity_score, 0) *
    COALESCE(frequency_score, 0)
  ) STORED,
ADD COLUMN IF NOT EXISTS is_significant_new boolean
  GENERATED ALWAYS AS (
    COALESCE(scale_score, 0) *
    COALESCE(severity_score, 0) *
    COALESCE(frequency_score, 0) >= 15
    OR COALESCE(legal_requirement, false) = true
  ) STORED,
ADD COLUMN IF NOT EXISTS legal_requirement   boolean default false,
ADD COLUMN IF NOT EXISTS stakeholder_concern boolean default false;

ALTER TABLE env_aspects DISABLE ROW LEVEL SECURITY;
