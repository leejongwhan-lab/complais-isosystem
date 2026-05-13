-- ============================================================
--  complAIs ISOSystem — Supabase Schema
--  Supabase SQL Editor에서 전체 선택 후 실행
-- ============================================================

-- ── 공통 updated_at 자동 갱신 트리거 함수 ─────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
--  1. 문서 관리 (documents)
-- ============================================================
create table if not exists documents (
  id              uuid        primary key default gen_random_uuid(),
  doc_number      text        unique not null,   -- e.g. C-1P-01
  layer           text        not null           -- C / I / E
                    check (layer in ('C','I','E')),
  process_no      text        not null,          -- 0~9
  doc_type        text        not null           -- M / P / R / F
                    check (doc_type in ('M','P','R','F')),
  industry_code   text,                          -- MFG / AUTO / CON 등 (I레이어)
  version         text        not null default 'R00',
  title           text        not null,
  description     text,
  status          text        not null default 'draft'
                    check (status in ('draft','active','review','obsolete')),
  owner_name      text,
  related_iso     text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create trigger trg_documents_updated_at
  before update on documents
  for each row execute function set_updated_at();

-- ============================================================
--  2. CAPA
-- ============================================================
create table if not exists capas (
  id              uuid        primary key default gen_random_uuid(),
  capa_number     text        unique not null,   -- e.g. CAPA-2025-047
  source          text        not null,          -- 고객클레임 / 내부심사 / 공정불량 등
  grade           text        not null           -- A / B / C
                    check (grade in ('A','B','C')),
  status          text        not null default 'D1'
                    check (status in ('D1','D2','D3','D4','D5','D6','D7','D8','completed')),
  current_step    int         default 1,
  title           text        not null,
  description     text,
  owner_name      text,
  due_date        date,
  related_doc_id  uuid        references documents(id) on delete set null,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create trigger trg_capas_updated_at
  before update on capas
  for each row execute function set_updated_at();

-- ============================================================
--  3. 내부심사 (audits)
-- ============================================================
create table if not exists audits (
  id                  uuid        primary key default gen_random_uuid(),
  audit_number        text        unique not null,   -- e.g. AUD-2025-02
  audit_type          text        not null           -- system / process / product
                        check (audit_type in ('system','process','product')),
  status              text        not null default 'planned'
                        check (status in ('planned','in_progress','completed')),
  auditor_name        text,
  target_process      text,
  planned_date        date,
  actual_date         date,
  conformity_count    int         default 0,
  nonconformity_count int         default 0,
  observation_count   int         default 0,
  created_at          timestamptz default now()
);

-- ============================================================
--  4. 공급자 (suppliers)
-- ============================================================
create table if not exists suppliers (
  id              uuid        primary key default gen_random_uuid(),
  company_name    text        not null,
  category        text,
  grade           text                             -- A / B / C / D
                    check (grade in ('A','B','C','D') or grade is null),
  score           int,
  iso_certified   boolean     default false,
  status          text        default 'approved'
                    check (status in ('approved','conditional','pending','suspended')),
  last_eval_date  date,
  next_eval_date  date,
  created_at      timestamptz default now()
);

-- ============================================================
--  5. 교육훈련 (trainings)
-- ============================================================
create table if not exists trainings (
  id              uuid        primary key default gen_random_uuid(),
  title           text        not null,
  training_type   text                             -- internal / external
                    check (training_type in ('internal','external') or training_type is null),
  planned_date    date,
  actual_date     date,
  total_count     int         default 0,
  completed_count int         default 0,
  status          text        default 'planned'
                    check (status in ('planned','in_progress','completed','cancelled')),
  created_at      timestamptz default now()
);

-- ============================================================
--  Row Level Security (기본 비활성 — 필요 시 활성화)
-- ============================================================
-- alter table documents  enable row level security;
-- alter table capas      enable row level security;
-- alter table audits     enable row level security;
-- alter table suppliers  enable row level security;
-- alter table trainings  enable row level security;
