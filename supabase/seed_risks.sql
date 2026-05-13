INSERT INTO risks (risk_number, type, category, title, likelihood, impact, response, owner_name, due_date, status)
VALUES
  ('RISK-2025-001', 'risk', '품질', '주요 공급자 납기 지연', 3, 4, 'mitigate', '김민준', '2026-03-01', 'open'),
  ('RISK-2025-002', 'risk', '경영', '핵심 인력 이탈',         4, 3, 'mitigate', '이지영', '2026-06-01', 'open'),
  ('RISK-2025-003', 'risk', '품질', '고객 요구사항 변경',     4, 5, 'accept',   '박현수', '2026-01-31', 'in_progress'),
  ('RISK-2025-004', 'risk', '기술', '설비 노후화',             4, 2, 'mitigate', '오재원', '2026-02-28', 'open'),
  ('RISK-2025-005', 'risk', '환경', '환경법규 강화',           2, 3, 'accept',   '최우진', '2026-06-30', 'open');

INSERT INTO management_reviews (review_number, review_date, chairperson, attendees, status)
VALUES
  ('MR-2025-01', '2025-12-01', '최고경영자', '김민준, 이지영, 박현수, 오재원', 'completed');
