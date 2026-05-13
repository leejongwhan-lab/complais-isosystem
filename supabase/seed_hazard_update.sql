-- ── 기존 KRAS 레코드 업데이트 ────────────────────────────────
UPDATE hazard_assessments SET
  assessment_type    = 'kras',
  hazard_type        = 'Machine',
  before_likelihood  = 3,
  before_severity    = 4,
  after_likelihood   = 1,
  after_severity     = 2
WHERE hazard_number = 'HA-2025-001';

UPDATE hazard_assessments SET
  assessment_type    = 'kras',
  hazard_type        = 'Media',
  before_likelihood  = 2,
  before_severity    = 5,
  after_likelihood   = 1,
  after_severity     = 3
WHERE hazard_number = 'HA-2025-002';

UPDATE hazard_assessments SET
  assessment_type    = 'kras',
  hazard_type        = 'Management',
  before_likelihood  = 2,
  before_severity    = 4,
  after_likelihood   = 1,
  after_severity     = 2
WHERE hazard_number = 'HA-2025-003';

-- ── 공정위험성평가 (PHA) 샘플 ────────────────────────────────
INSERT INTO process_hazard_assessments
  (pha_number, process_name, assessment_method, node, deviation, cause, consequence, safeguard, likelihood, severity, recommendation, action_party, status)
VALUES
  ('PHA-2025-001', '도장 공정',  'HAZOP',     '희석제 공급라인', '유량 증가', '조절밸브 고장',      'VOC 농도 상승 → 화재 위험', '유량계 설치',  3, 5, '자동차단밸브 추가 설치', '설비팀', 'open'),
  ('PHA-2025-002', '세척 공정',  'What-If',   '세척액 탱크',     '온도 상승', '냉각수 공급 중단',    '세척액 증발 → 작업자 노출', '온도계 설치',  2, 4, '냉각수 유량 알람 설치',   '안전팀', 'open');
