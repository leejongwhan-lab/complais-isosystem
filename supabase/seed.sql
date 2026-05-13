INSERT INTO documents (doc_number, layer, process_no, doc_type, industry_code, version, title, status, owner_name, related_iso) VALUES
('C-0M-00', 'C', '0', 'M', null, 'R04', 'IMS 통합경영시스템 매뉴얼', 'active', '김민준', '4~10'),
('C-1P-01', 'C', '1', 'P', null, 'R02', '경영계획 및 운영관리 프로세스', 'active', '이지영', '6.2'),
('C-1P-04', 'C', '1', 'P', null, 'R01', '내부심사 프로세스', 'review', '박현수', '9.2'),
('I-5P-MFG-01', 'I', '5', 'P', 'MFG', 'R01', '공정관리 프로세스 (제조)', 'active', '오재원', '8.5.1'),
('I-3R-AUTO-01', 'I', '3', 'R', 'AUTO', 'R02', 'FMEA 작성 지침서 (자동차)', 'draft', '신예린', '8.3'),
('E-8P-01', 'E', '8', 'P', null, 'R01', '환경 운영 관리 프로세스', 'active', '최우진', '8.1'),
('C-7P-01', 'C', '7', 'P', null, 'R03', '표준 문서 관리 프로세스', 'review', '김민준', '7.5')
ON CONFLICT (doc_number) DO NOTHING;

INSERT INTO capas (capa_number, source, grade, status, current_step, title, owner_name, due_date) VALUES
('CAPA-2025-047', '고객 클레임', 'A', 'D4', 4, '포장 완충재 두께 미비', '김민준', '2025-12-14'),
('CAPA-2025-046', '내부심사 지적', 'B', 'D2', 2, '문서 승인 절차 미준수', '이지영', '2025-12-30'),
('CAPA-2025-045', '공정 불량', 'B', 'D3', 3, '외관 불량 3건 발생', '박현수', '2026-01-05'),
('CAPA-2025-044', '측정기 교정', 'C', 'completed', 8, '교정 주기 초과', '오재원', '2025-11-30'),
('CAPA-2025-043', '작업표준서', 'C', 'completed', 8, '작업표준서 개정 지연', '신예린', '2025-11-20')
ON CONFLICT (capa_number) DO NOTHING;

INSERT INTO suppliers (company_name, category, grade, score, iso_certified, status, last_eval_date, next_eval_date) VALUES
('㈜한국정밀', '금속 가공품', 'A', 92, true, 'approved', '2025-09-15', '2026-03-15'),
('서울화학㈜', '화학 원료', 'B', 78, false, 'approved', '2025-08-20', '2026-02-20'),
('대성포장', '포장재', 'C', 61, false, 'conditional', '2025-07-10', '2025-12-20'),
('현대물류서비스', '물류·운송', 'A', 88, true, 'approved', '2025-10-05', '2026-04-05'),
('미래전자부품', '전자 부품', null, null, false, 'pending', null, '2025-12-30')
ON CONFLICT DO NOTHING;
