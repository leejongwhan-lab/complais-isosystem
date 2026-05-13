-- 사용자 역할
CREATE TABLE IF NOT EXISTS users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  role text default 'user',
  company_id uuid references companies(id),
  is_consultant boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 컨설턴트-고객사 관계
CREATE TABLE IF NOT EXISTS consultant_clients (
  id uuid primary key default gen_random_uuid(),
  consultant_id uuid references users(id),
  company_id uuid references companies(id),
  assigned_at timestamptz default now(),
  status text default 'active'
);

-- 플랜/구독
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  plan text default 'free',
  started_at timestamptz default now(),
  expires_at timestamptz,
  status text default 'active',
  monthly_price integer default 0
);

-- TBM 기록
CREATE TABLE IF NOT EXISTS tbm_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  tbm_date date not null,
  work_location text not null,
  work_content text not null,
  hazards text,
  safety_instructions text,
  weather text,
  temperature text,
  leader_name text not null,
  attendee_count integer default 0,
  created_at timestamptz default now()
);

-- TBM 참석자
CREATE TABLE IF NOT EXISTS tbm_attendees (
  id uuid primary key default gen_random_uuid(),
  tbm_id uuid references tbm_records(id) on delete cascade,
  name text not null,
  signature text,
  signed_at timestamptz default now()
);

-- 익명 제보
CREATE TABLE IF NOT EXISTS anonymous_reports (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  tracking_code text unique not null,
  report_type text not null,
  sub_type text,
  content text not null,
  photo_urls text[],
  status text default 'received',
  handler_id uuid references users(id),
  handler_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 익명 제보 채팅
CREATE TABLE IF NOT EXISTS report_messages (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references anonymous_reports(id),
  sender text not null,
  message text not null,
  created_at timestamptz default now()
);

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE tbm_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE tbm_attendees DISABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE report_messages DISABLE ROW LEVEL SECURITY;

INSERT INTO users (email, name, role, is_consultant)
VALUES ('admin@complais.com', '시스템 관리자', 'admin', false)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, name, role, is_consultant)
VALUES ('consultant@complais.com', '홍길동 컨설턴트', 'consultant', true)
ON CONFLICT (email) DO NOTHING;
