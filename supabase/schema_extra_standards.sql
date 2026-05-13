-- ── companies 표준 컬럼 추가 ──────────────────────────────────
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS std_iso50001 boolean default false,
ADD COLUMN IF NOT EXISTS std_iso37001 boolean default false,
ADD COLUMN IF NOT EXISTS std_iso37301 boolean default false,
ADD COLUMN IF NOT EXISTS std_iso27001 boolean default false;

-- ── ISO 50001 에너지 기록 ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS energy_records (
  id            uuid primary key default gen_random_uuid(),
  record_month  text not null,
  energy_type   text not null,  -- 전력/가스/유류/기타
  amount        numeric not null,
  unit          text not null,  -- kWh/Nm3/L
  cost          numeric,
  memo          text,
  created_at    timestamptz default now()
);

-- ── ISO 37001 부패리스크 ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS bribery_risks (
  id              uuid primary key default gen_random_uuid(),
  risk_number     text unique not null,
  category        text not null,  -- 조달/영업/인허가/채용/기타
  title           text not null,
  description     text,
  likelihood      int check (likelihood between 1 and 5),
  impact          int check (impact between 1 and 5),
  risk_score      int generated always as (likelihood * impact) stored,
  risk_level      text generated always as (
    case
      when likelihood * impact >= 16 then 'critical'
      when likelihood * impact >= 11 then 'high'
      when likelihood * impact >=  6 then 'medium'
      else 'low'
    end
  ) stored,
  control_measure text,
  owner_name      text,
  status          text default 'open',
  created_at      timestamptz default now()
);

-- ── ISO 37001 선물·접대 신고 ───────────────────────────────────
CREATE TABLE IF NOT EXISTS gift_reports (
  id             uuid primary key default gen_random_uuid(),
  report_number  text unique not null,
  report_date    date not null,
  reporter_name  text not null,
  gift_type      text not null,  -- 선물/접대/기부/기타
  provider       text not null,
  amount         numeric,
  description    text,
  action         text default 'reported',  -- reported/returned/approved/rejected
  approver       text,
  created_at     timestamptz default now()
);

-- ── ISO 37301 준법의무 ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS compliance_obligations (
  id                 uuid primary key default gen_random_uuid(),
  obligation_number  text unique not null,
  category           text not null,  -- 환경/안전/노동/공정거래/개인정보/기타
  law_name           text not null,
  article            text,
  requirement        text not null,
  applicable_dept    text,
  compliance_status  text default 'compliant',
  next_review_date   date,
  owner_name         text,
  created_at         timestamptz default now()
);

-- ── ISO 27001 정보자산 ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS information_assets (
  id               uuid primary key default gen_random_uuid(),
  asset_number     text unique not null,
  asset_name       text not null,
  asset_type       text not null,  -- 하드웨어/소프트웨어/데이터/서비스/인원
  location         text,
  owner_name       text,
  classification   text default 'internal',  -- public/internal/confidential/secret
  likelihood       int check (likelihood between 1 and 5),
  impact           int check (impact between 1 and 5),
  risk_score       int generated always as (likelihood * impact) stored,
  control_measure  text,
  status           text default 'active',
  created_at       timestamptz default now()
);

ALTER TABLE energy_records         DISABLE ROW LEVEL SECURITY;
ALTER TABLE bribery_risks          DISABLE ROW LEVEL SECURITY;
ALTER TABLE gift_reports           DISABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_obligations DISABLE ROW LEVEL SECURITY;
ALTER TABLE information_assets     DISABLE ROW LEVEL SECURITY;
