-- ── 문서 워크플로우 컬럼 추가 ──────────────────────────────────
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS reviewer              text,
ADD COLUMN IF NOT EXISTS approver              text,
ADD COLUMN IF NOT EXISTS review_requested_at   timestamptz,
ADD COLUMN IF NOT EXISTS approved_at           timestamptz,
ADD COLUMN IF NOT EXISTS obsoleted_at          timestamptz,
ADD COLUMN IF NOT EXISTS reject_reason         text,
ADD COLUMN IF NOT EXISTS version               text default 'R00';

-- ── 변경 이력 테이블 ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS document_history (
  id          uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  action      text not null,
  from_status text,
  to_status   text,
  actor_name  text,
  note        text,
  created_at  timestamptz default now()
);

ALTER TABLE document_history DISABLE ROW LEVEL SECURITY;
