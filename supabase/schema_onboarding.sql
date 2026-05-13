-- ── 회사 정보 ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS companies (
  id              uuid primary key default gen_random_uuid(),
  company_name    text not null,
  business_type   text,
  employee_count  text,
  address         text,
  ceo_name        text,
  management_rep  text,
  -- 적용 표준
  std_iso9001     boolean default true,
  std_iso14001    boolean default false,
  std_iso45001    boolean default false,
  std_iatf        boolean default false,
  std_iso13485    boolean default false,
  -- 플랜
  plan            text default 'starter',
  plan_expires_at timestamptz,
  -- 설정
  logo_url        text,
  created_at      timestamptz default now()
);

-- ── 문서 템플릿 마스터 ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS document_templates (
  id             uuid primary key default gen_random_uuid(),
  template_code  text unique not null,
  standard       text not null,
  layer          text not null,
  process_no     text not null,
  doc_type       text not null,
  industry_code  text,
  version        text default 'R00',
  title          text not null,
  description    text,
  iso_clause     text,
  plan_required  text default 'starter',
  sections       jsonb,
  is_active      boolean default true,
  sort_order     int default 0,
  created_at     timestamptz default now()
);

ALTER TABLE companies          DISABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates DISABLE ROW LEVEL SECURITY;
