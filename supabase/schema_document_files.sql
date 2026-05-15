-- ============================================================
--  document_files — 문서 파일 첨부/업로드 테이블
--  Supabase Storage bucket: 'documents'
-- ============================================================

CREATE TABLE IF NOT EXISTS document_files (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   uuid        REFERENCES companies(id),
  doc_type     text        NOT NULL DEFAULT 'manual',
  file_name    text        NOT NULL,
  file_url     text,
  file_size    bigint      DEFAULT 0,
  file_ext     text,
  description  text,
  version      text        DEFAULT 'R00',
  uploaded_by  text,
  created_at   timestamptz DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_document_files_company  ON document_files(company_id);
CREATE INDEX IF NOT EXISTS idx_document_files_doc_type ON document_files(doc_type);

-- RLS 비활성화 (앱 레이어에서 company_id 필터링)
ALTER TABLE document_files DISABLE ROW LEVEL SECURITY;

-- ── form_templates에 frequency 컬럼 추가 ─────────────────────
-- daily / weekly / monthly / quarterly / annual / adhoc
ALTER TABLE form_templates
ADD COLUMN IF NOT EXISTS frequency text DEFAULT 'adhoc';

-- 주요 서식 frequency 업데이트
UPDATE form_templates SET frequency = 'daily'
WHERE form_code IN ('F-610-05', 'F-520-06', 'F-520-04', 'F-520-05', 'F-520-01', 'F-520-02');

UPDATE form_templates SET frequency = 'weekly'
WHERE form_code IN ('F-510-03', 'F-510-04');

UPDATE form_templates SET frequency = 'monthly'
WHERE form_code IN ('F-510-02', 'F-550-02', 'F-550-04', 'F-520-03');

UPDATE form_templates SET frequency = 'annual'
WHERE form_code IN ('F-150-01', 'F-510-01', 'F-610-04');

-- ── Storage 버킷 ──────────────────────────────────────────────
-- Supabase Dashboard > Storage > New bucket 에서 생성:
--   Bucket name: documents
--   Public: false
