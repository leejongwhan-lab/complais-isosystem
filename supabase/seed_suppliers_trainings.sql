-- ── suppliers 테이블 ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS suppliers (
  id                   uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name         text        NOT NULL,
  category             text        NOT NULL,
  grade                text        NOT NULL DEFAULT 'C' CHECK (grade IN ('A', 'B', 'C', 'D')),
  total_score          integer     NOT NULL DEFAULT 0,
  quality_score        integer     NOT NULL DEFAULT 0,
  delivery_score       integer     NOT NULL DEFAULT 0,
  price_score          integer     NOT NULL DEFAULT 0,
  cooperation_score    integer     NOT NULL DEFAULT 0,
  iso_certified        boolean     NOT NULL DEFAULT false,
  last_evaluation_date date,
  next_evaluation_date date,
  status               text        NOT NULL DEFAULT 'pending' CHECK (status IN ('approved', 'conditional', 'pending', 'suspended')),
  ceo_name             text,
  address              text,
  contact              text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

-- ── trainings 테이블 ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trainings (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  title            text        NOT NULL,
  type             text        NOT NULL CHECK (type IN ('internal', 'external', 'ojt')),
  status           text        NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
  planned_date     date        NOT NULL,
  actual_date      date,
  total_count      integer     NOT NULL DEFAULT 0,
  completed_count  integer     NOT NULL DEFAULT 0,
  purpose          text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ── 공급자 샘플 4건 ──────────────────────────────────────────
INSERT INTO suppliers (company_name, category, grade, total_score, quality_score, delivery_score, price_score, cooperation_score, iso_certified, last_evaluation_date, next_evaluation_date, status, ceo_name, address, contact)
VALUES
  ('(주)한국정밀', '기계부품', 'A', 92, 95, 88, 90, 96, true,  '2025-06-01', '2026-06-01', 'approved',    '김정밀', '경기도 안산시', '031-000-0001'),
  ('대양산업(주)', '전자부품', 'B', 74, 70, 78, 72, 76, false, '2025-03-15', '2026-03-15', 'conditional', '이대양', '인천시 남동구', '032-000-0002'),
  ('신흥소재',     '원자재',   'C', 58, 55, 60, 62, 56, false, '2024-12-01', '2025-12-01', 'conditional', '박신흥', '경기도 시흥시', '031-000-0003'),
  ('글로벌테크',   '전장부품', 'A', 88, 90, 85, 88, 88, true,  '2025-09-01', '2026-09-01', 'approved',    '최글로', '서울시 강남구', '02-000-0004');

-- ── 교육 샘플 3건 ────────────────────────────────────────────
INSERT INTO trainings (title, type, status, planned_date, actual_date, total_count, completed_count, purpose)
VALUES
  ('2025 품질교육',      'internal', 'completed', '2025-03-15', '2025-03-15', 20, 18, 'ISO 9001 품질경영시스템 인식 향상 및 개정 요건 교육'),
  ('ISO 14001 환경교육', 'external', 'completed', '2025-06-20', '2025-06-20', 15, 15, '환경경영시스템 법규 및 요건 이해'),
  ('CAPA 실무교육',      'internal', 'planned',   '2025-12-20', null,         12,  0,  '시정 및 예방조치 실무 절차 교육');
