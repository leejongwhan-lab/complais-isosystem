-- ── env_aspects ─────────────────────────────────────────────
INSERT INTO env_aspects
  (aspect_number, category, activity, aspect, impact, condition, likelihood, severity, is_significant, legal_requirement, control_measure, owner_name)
VALUES
  ('EA-2025-001', '대기',    '도장 공정', '유기용제 사용', 'VOC 대기 배출',  'normal', 3, 4, true,  '대기환경보전법 제16조', '밀폐 작업 + 활성탄 흡착 설비', '환경팀'),
  ('EA-2025-002', '폐기물',  '생산 공정', '포장재 사용',   '폐기물 발생',    'normal', 4, 3, false, '폐기물관리법 제18조',   '분리수거 및 위탁 처리',         '생산팀'),
  ('EA-2025-003', '에너지',  '설비 가동', '전력 사용',     '에너지 소비',    'normal', 5, 2, false, NULL,                    '에너지 절감 설비 도입',         '시설팀');

-- ── hazard_assessments ───────────────────────────────────────
INSERT INTO hazard_assessments
  (hazard_number, work_area, work_type, hazard, risk_factor, current_control, likelihood, severity, additional_control, owner_name, review_date)
VALUES
  ('HA-2025-001', '생산라인',       '프레스 작업',   '협착 위험', '안전가드 미설치', '안전가드 설치',  3, 4, '인터록 장치 추가 설치', '안전팀', '2025-12-31'),
  ('HA-2025-002', '창고',           '지게차 운행',   '충돌 위험', '통행로 미구분',   '통행로 표시',    2, 5, '보행자 경고 시스템 설치', '안전팀', '2025-12-31'),
  ('HA-2025-003', '화학물질 보관',  '화학물질 취급', '누출 위험', '보관 기준 미준수','MSDS 비치',      2, 4, '2차 격납 설비 설치',     '환경팀', '2025-12-31');

-- ── legal_requirements ──────────────────────────────────────
INSERT INTO legal_requirements
  (law_number, category, law_name, article, requirement, applicable_dept, compliance_status, next_review_date)
VALUES
  ('LAW-2025-001', '환경',    '대기환경보전법',  '제16조', '배출시설 허가 및 신고',      '생산부', 'compliant', '2025-12-31'),
  ('LAW-2025-002', '안전보건','산업안전보건법',  '제36조', '위험성평가 실시 및 기록 유지','안전팀', 'compliant', '2025-12-31'),
  ('LAW-2025-003', '화학물질','화학물질관리법',  '제13조', 'MSDS 작성·비치 및 교육',    '생산부', 'compliant', '2025-12-31');

-- ── material_balances ────────────────────────────────────────
INSERT INTO material_balances
  (record_month, material_name, material_type, input_amount, output_amount, unit, loss_amount, notes)
VALUES
  ('2025-04', '이소프로필알코올', '원료',   500.0, 480.0, 'kg', 20.0, '증발 손실'),
  ('2025-04', '완제품',          '제품',  NULL,  1200.0, 'kg', NULL, NULL),
  ('2025-04', '포장 폐기물',     '폐기물', NULL,  85.0,  'kg', NULL, '위탁 처리'),
  ('2025-05', '이소프로필알코올', '원료',   520.0, 498.0, 'kg', 22.0, '증발 손실'),
  ('2025-05', '완제품',          '제품',  NULL,  1350.0, 'kg', NULL, NULL);
