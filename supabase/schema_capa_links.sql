-- CAPA ↔ 문서 ↔ 심사 연결 + D9 효과성 검증
ALTER TABLE capas
  ADD COLUMN IF NOT EXISTS related_doc_id    uuid REFERENCES documents(id),
  ADD COLUMN IF NOT EXISTS related_audit_id  uuid REFERENCES audits(id),
  ADD COLUMN IF NOT EXISTS effectiveness_due_date   date,
  ADD COLUMN IF NOT EXISTS effectiveness_result     text,
  ADD COLUMN IF NOT EXISTS effectiveness_status     text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS closed_at               timestamptz;

COMMENT ON COLUMN capas.related_doc_id         IS '연관 문서 ID';
COMMENT ON COLUMN capas.related_audit_id        IS '연관 심사 ID';
COMMENT ON COLUMN capas.effectiveness_due_date  IS 'D9 효과성 검증 예정일';
COMMENT ON COLUMN capas.effectiveness_result    IS 'D9 효과성 검증 결과 내용';
COMMENT ON COLUMN capas.effectiveness_status    IS 'D9 상태: pending | verified | failed';
