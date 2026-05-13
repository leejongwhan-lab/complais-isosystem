-- ── 서식 템플릿 마스터 ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS form_templates (
  id            uuid primary key default gen_random_uuid(),
  form_code     text unique not null,
  form_name     text not null,
  category      text not null,
  process_code  text,
  pattern       text not null,
  iso_clause    text,
  standard      text default 'iso9001',
  plan_required text default 'starter',
  fields        jsonb not null,
  print_layout  jsonb,
  is_active     boolean default true,
  sort_order    int default 0,
  created_at    timestamptz default now()
);

-- ── 서식 작성 기록 ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS form_records (
  id            uuid primary key default gen_random_uuid(),
  record_number text unique not null,
  form_code     text references form_templates(form_code),
  form_name     text not null,
  category      text not null,
  data          jsonb not null default '{}',
  status        text default 'draft',
  created_by    text,
  approved_by   text,
  related_id    uuid,
  related_type  text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

ALTER TABLE form_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE form_records   DISABLE ROW LEVEL SECURITY;
