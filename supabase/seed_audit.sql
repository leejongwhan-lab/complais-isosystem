-- audits 테이블 생성
CREATE TABLE IF NOT EXISTS audits (
  id                   uuid         DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_number         text         NOT NULL UNIQUE,
  audit_type           text         NOT NULL CHECK (audit_type IN ('system', 'process', 'product')),
  status               text         NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
  auditor_name         text         NOT NULL,
  target_process       text         NOT NULL,
  planned_date         date         NOT NULL,
  completed_date       date,
  conformity_count     integer      NOT NULL DEFAULT 0,
  nonconformity_count  integer      NOT NULL DEFAULT 0,
  observation_count    integer      NOT NULL DEFAULT 0,
  created_at           timestamptz  NOT NULL DEFAULT now(),
  updated_at           timestamptz  NOT NULL DEFAULT now()
);

-- 샘플 데이터 2건
INSERT INTO audits (audit_number, audit_type, status, auditor_name, target_process, planned_date, completed_date, conformity_count, nonconformity_count, observation_count)
VALUES
  ('AUD-2025-01', 'system',  'completed',   '이지영', '전체 프로세스',  '2025-06-10', '2025-06-10', 18, 2, 3),
  ('AUD-2025-02', 'process', 'in_progress', '이지영', '제조공정 전반', '2025-12-14', null,          18, 2, 3)
ON CONFLICT (audit_number) DO NOTHING;
