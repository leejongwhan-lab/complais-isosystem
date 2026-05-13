INSERT INTO document_templates
  (template_code, standard, layer, process_no, doc_type, title, iso_clause, plan_required, sort_order, sections)
VALUES

('C-0M-00-TPL', 'iso9001', 'C', '0', 'M',
'IMS 통합경영시스템 매뉴얼', '4~10', 'starter', 1,
'[
  {"key":"company_overview","title":"1. 조직 개요","placeholder":"조직명, 주요 제품·서비스, 이해관계자, 운영 위치..."},
  {"key":"policy","title":"2. 경영방침","placeholder":"조직의 방침, 목표, 준수 의지..."},
  {"key":"scope","title":"3. 적용 범위","placeholder":"적용 표준, 적용 사업장, 제외 조항 및 사유..."},
  {"key":"process_map","title":"4. 프로세스 구성","placeholder":"핵심 프로세스, 지원 프로세스, 상호관계..."},
  {"key":"responsibility","title":"5. 책임과 권한","placeholder":"최고경영자, 관리책임자, 각 부서 역할..."},
  {"key":"doc_structure","title":"6. 문서 체계","placeholder":"매뉴얼-프로세스-지침서-서식 등 문서 체계..."}
]'::jsonb),

('C-1P-01-TPL', 'iso9001', 'C', '130', 'P',
'경영계획 및 운영관리 프로세스', '6.1/6.2', 'starter', 2,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"경영목표 달성을 위한 사업계획 수립 및 운영관리..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"전사 모든 부서의 연간 사업계획 수립 및 실적 관리..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"KPI, BSC, 성과지표 등 주요 용어 정의..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"경영대리인: 전체 계획 총괄, 각 부서장: 부서별 계획 수립..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 경영방침 및 목표 수립 2) 부서별 세부계획 수립 3) 실적 모니터링..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"성과지표 목록, 경영검토 프로세스..."},
  {"key":"records","title":"7. 기록","placeholder":"연간 사업계획서, 월간 실적 보고서..."}
]'::jsonb),

('C-1P-02-TPL', 'iso9001', 'C', '110', 'P',
'리스크 및 기회 관리 프로세스', '6.1', 'starter', 3,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"경영시스템 운영 중 발생 가능한 리스크를 사전에 식별하고 관리..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"전사 모든 프로세스의 리스크 및 기회 관리..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"리스크, 기회, 위험도, 발생가능성, 영향도..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"경영대리인: 리스크 관리 총괄, 각 프로세스 오너: 리스크 식별..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 리스크 식별 2) 리스크 평가(5×5 매트릭스) 3) 대응방안 수립..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"리스크 등록부, 시정조치 프로세스..."},
  {"key":"records","title":"7. 기록","placeholder":"리스크 평가서, 대응 계획서..."}
]'::jsonb),

('C-1P-03-TPL', 'iso9001', 'C', '150', 'P',
'내부심사 프로세스', '9.2', 'starter', 4,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"경영시스템이 계획대로 실행되고 있는지 독립적으로 검증..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"IMS 적용 범위 내 모든 프로세스 및 부서..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"내부심사, 심사원, 적합, 부적합, 관찰사항..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"경영대리인: 심사 계획 승인, 심사원: 심사 실시, 피심사 부서장: 협조..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 연간 심사계획 수립 2) 세부계획 작성 3) 체크리스트 작성 4) 현장심사..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"심사 체크리스트, 시정조치 프로세스..."},
  {"key":"records","title":"7. 기록","placeholder":"연간 심사계획서, 심사 보고서, 부적합 보고서..."}
]'::jsonb),

('C-1P-04-TPL', 'iso9001', 'C', '170', 'P',
'시정조치 프로세스 (CAPA)', '10.2', 'starter', 5,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"부적합의 원인을 제거하고 재발을 방지하여 경영시스템의 지속적 개선..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"내부심사 지적, 고객 불만, 운영상 이슈 등 모든 부적합..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"부적합, 시정조치, 예방조치, 근본원인, 8D..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"품질담당: CAPA 등록 및 관리, 해당 부서장: 원인분석 및 대책 수립..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 부적합 접수 2) 원인분석(5-Why/특성요인도) 3) 대책 수립 4) 실행 5) 효과 확인..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"부적합 관리 프로세스, 내부심사 프로세스..."},
  {"key":"records","title":"7. 기록","placeholder":"CAPA 대장, 시정조치 보고서, 효과성 평가서..."}
]'::jsonb),

('C-4P-01-TPL', 'iso9001', 'C', '420', 'P',
'공급자 관리 프로세스', '8.4', 'starter', 6,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"외부 제공자의 역량과 성과를 평가하여 안정적인 서비스·제품 제공 기반을 확보..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"조직의 품질, 납기, 규제 준수에 영향을 미치는 모든 외부 제공자..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"외부 제공자, 협력사, 평가기준, 승인, 재평가..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"구매담당: 등록 및 계약 관리, 관련 부서: 평가 참여, 승인권자: 최종 승인..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 외부 제공자 선정 2) 초기 평가 3) 승인 및 등록 4) 정기 재평가 5) 성과 미달 시 조치..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"평가 기준서, 계약 검토 기준, 변경관리 절차..."},
  {"key":"records","title":"7. 기록","placeholder":"등록대장, 평가 결과, 개선 요청 기록..."}
]'::jsonb),

('C-7P-01-TPL', 'iso9001', 'C', '760', 'P',
'표준 문서 관리 프로세스', '7.5', 'starter', 7,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"경영시스템 관련 문서를 체계적으로 작성, 검토, 승인, 배포 및 관리..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"IMS 관련 모든 문서화된 정보..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"문서, 기록, 개정, 배포, 폐기, 관리본, 비관리본..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"문서 작성자: 초안 작성, 부서장: 검토, 경영대리인: 최종 승인..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 문서 작성 2) 검토 및 승인 3) 배포 4) 개정 관리 5) 폐기..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"기록 관리 프로세스, 문서 관리 대장..."},
  {"key":"records","title":"7. 기록","placeholder":"문서 관리 대장, 배포 기록, 개정 이력..."}
]'::jsonb),

('C-7P-02-TPL', 'iso9001', 'C', '720', 'P',
'교육훈련 프로세스', '7.2', 'starter', 8,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"업무 수행에 필요한 역량을 갖춘 인원을 확보하고 지속적으로 개발..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"전 임직원의 교육훈련 계획 수립 및 실시..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"역량, 적격성, OJT, 교육 효과성 평가..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"인사담당: 교육 계획 수립 및 관리, 부서장: 부서별 교육 실시, 경영대리인: 승인..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 교육 수요 파악 2) 연간 교육계획 수립 3) 교육 실시 4) 효과성 평가..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"자격 관리 대장, 교육계획서..."},
  {"key":"records","title":"7. 기록","placeholder":"교육계획서, 교육일지, 효과성 평가서..."}
]'::jsonb),

('E-8P-01-TPL', 'iso14001', 'E', '810', 'P',
'환경운영관리 프로세스', '8.1', 'pro', 9,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"환경경영시스템 요구사항을 충족하기 위한 운영 프로세스 수립 및 관리..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"환경측면이 있는 모든 활동, 서비스, 현장 운영..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"환경측면, 환경영향, 중요환경측면, 운영 기준..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"환경담당: 환경측면 파악 및 관리, 각 부서장: 운영 기준 준수..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 환경측면 파악 2) 환경영향 평가 3) 중요환경측면 결정 4) 운영 기준 수립..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"환경영향평가서, 환경목표 추진계획..."},
  {"key":"records","title":"7. 기록","placeholder":"환경영향등록부, 모니터링 기록..."}
]'::jsonb),

('E-9P-01-TPL', 'iso45001', 'S', '820', 'P',
'안전보건 운영관리 프로세스', '8.1', 'pro', 10,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"위험요인을 제거하고 안전보건 리스크를 최소화하여 근로자 보호..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"모든 사업장 내 작업 활동 및 근로자..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"위험요인, 위험성, 위험성평가, 허용 가능한 위험성..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"안전보건 담당: 위험성평가 관리, 부서장: 작업 안전 확보..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 위험요인 파악 2) 위험성 평가 3) 관리대책 수립 4) 이행 및 모니터링..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"위험성평가 지침서, 안전보건 목표 계획..."},
  {"key":"records","title":"7. 기록","placeholder":"위험성평가표, 개선 조치 기록..."}
]'::jsonb),

('C-1P-05-TPL', 'iso9001', 'C', '160', 'P',
'경영검토 프로세스', '9.3', 'starter', 11,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"경영시스템의 적합성, 충분성, 효과성 및 전략적 방향과의 일치를 보장..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"전사 경영시스템 성과 및 개선 활동..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"경영검토, 입력사항, 출력사항, 지속적 개선..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"최고경영자: 경영검토 주재, 경영대리인: 입력 자료 준비 및 보고..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 경영검토 계획 수립 2) 입력 자료 준비 3) 검토 회의 4) 출력 결정 5) 후속 조치..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"성과지표 목록, 내부심사 프로세스..."},
  {"key":"records","title":"7. 기록","placeholder":"경영검토 회의록, 지시사항 조치 현황..."}
]'::jsonb),

('C-2P-01-TPL', 'iso9001', 'C', '210', 'P',
'고객대응 및 영업 프로세스', '8.2', 'starter', 12,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"고객 요구사항을 정확히 파악하고 고객 만족을 달성..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"고객 문의 접수부터 계약 체결, 납품, 사후 관리까지..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"고객 요구사항, 계약 검토, 고객 만족도..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"영업담당: 고객 요구사항 접수 및 계약 관리, 품질담당: 요구사항 검토..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 고객 요구사항 접수 2) 계약 검토 3) 수주 결정 4) 납품 5) 고객 만족도 조사..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"고객 만족도 조사 계획, 고객 불만 처리 프로세스..."},
  {"key":"records","title":"7. 기록","placeholder":"계약서, 고객 만족도 조사 결과, 고객 불만 처리 기록..."}
]'::jsonb),

('E-8P-02-TPL', 'iso14001', 'E', '811', 'P',
'환경목표 및 추진계획 프로세스', '6.2', 'pro', 13,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"환경 목표를 수립하고 실행계획을 운영하여 지속적 개선을 추진..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"전사 환경 목표, 부서별 세부 목표, 실행과제 관리..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"환경목표, 세부목표, KPI, 실행과제, 달성평가..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"환경책임자: 목표 체계 수립, 부서장: 실행계획 운영, 경영진: 승인 및 검토..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 중요 환경 이슈 검토 2) 목표 설정 3) 실행계획 수립 4) 이행 점검 5) 성과 평가..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"환경측면 평가, 경영검토, 성과 모니터링 절차..."},
  {"key":"records","title":"7. 기록","placeholder":"환경목표서, 추진계획서, 월간 실적 보고..."}
]'::jsonb),

('E-8P-03-TPL', 'iso14001', 'E', '812', 'P',
'환경 모니터링 및 준수평가 프로세스', '9.1/9.1.2', 'pro', 14,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"환경 성과와 준수의무 이행 상태를 주기적으로 모니터링하고 평가..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"환경성과 지표, 법규 준수, 내부 운영기준 이행 여부..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"모니터링, 준수평가, 배출기준, 법적 요구사항, 이상징후..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"환경담당: 측정계획 운영, 각 부서: 데이터 제공 및 시정조치 수행..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 측정계획 수립 2) 데이터 수집 3) 기준 비교 4) 이상 시 조치 5) 경영층 보고..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"법규 목록, 환경목표 관리, 시정조치 절차..."},
  {"key":"records","title":"7. 기록","placeholder":"측정 기록, 준수평가 결과, 시정조치 이력..."}
]'::jsonb),

('S-8P-02-TPL', 'iso45001', 'S', '821', 'P',
'위험성평가 프로세스', '6.1.2/8.1', 'pro', 15,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"작업 및 업무 수행 중 발생 가능한 위험요인을 체계적으로 식별·평가·통제..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"정규 작업, 비정기 작업, 협력사 작업, 방문자 활동 등 모든 업무 활동..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"위험요인, 위험성, 허용 가능 수준, 보호조치, 비상상황..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"안전보건 담당: 평가 체계 운영, 현장 책임자: 조치 실행, 근로자: 위험요인 제보..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 작업 식별 2) 위험요인 파악 3) 위험성 평가 4) 통제방안 결정 5) 재평가..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"비상대응, 교육훈련, 사고조사, 변경관리 절차..."},
  {"key":"records","title":"7. 기록","placeholder":"위험성평가표, 개선계획, 조치 완료 기록..."}
]'::jsonb),

('S-8P-03-TPL', 'iso45001', 'S', '822', 'P',
'안전보건 목표 및 프로그램 관리 프로세스', '6.2', 'pro', 16,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"안전보건 목표를 설정하고 실행 프로그램을 운영하여 재해 예방 성과를 관리..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"전사 안전보건 목표, 부서별 실천과제, 정기 성과점검..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"안전보건 목표, 선행지표, 후행지표, 프로그램, 개선과제..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"안전보건 책임자: 체계 운영, 부서장: 실행과제 수행, 경영진: 자원 지원..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 리스크 및 성과 검토 2) 목표 설정 3) 프로그램 수립 4) 이행 모니터링 5) 성과 평가..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"위험성평가, 교육훈련, 경영검토 자료..."},
  {"key":"records","title":"7. 기록","placeholder":"목표서, 실행계획, 성과 점검표..."}
]'::jsonb),

('EN-8P-01-TPL', 'iso50001', 'EN', '830', 'P',
'에너지 운영관리 프로세스', '6.3/8.1/9.1', 'pro', 17,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"에너지 사용과 성과를 체계적으로 관리하여 효율 개선과 비용 절감을 추진..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"주요 에너지 사용설비, 지원설비, 운영 조건, 측정 체계..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"EnPI, 에너지베이스라인, 주요에너지사용처, 에너지 검토..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"에너지 담당자: 에너지 검토 및 지표 관리, 설비 담당: 운영 조건 유지, 경영진: 자원 승인..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 에너지 검토 2) 주요사용처 선정 3) 목표 및 지표 설정 4) 운영관리 5) 성과 분석..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"설비 유지관리, 측정장비 관리, 경영검토 자료..."},
  {"key":"records","title":"7. 기록","placeholder":"에너지 사용 데이터, 분석 보고서, 개선과제 이력..."}
]'::jsonb),

('AB-8P-01-TPL', 'iso37001', 'AB', '840', 'P',
'반부패 리스크 및 통제 운영 프로세스', '4.5/8.2/8.3', 'pro', 18,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"부패 리스크를 식별하고 적절한 통제와 신고 체계를 운영하여 청렴성을 확보..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"임직원, 대리인, 협력사, 주요 거래 및 의사결정 활동..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"부패, 뇌물, 이해상충, 실사, 신고채널, 통제활동..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"준법/윤리 담당: 체계 운영, 부서장: 통제 이행, 임직원: 신고 및 준수..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 리스크 식별 2) 실사 및 평가 3) 통제 설계 4) 신고·조사 5) 후속 개선..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"윤리규정, 협력사 실사, 교육훈련, 징계 절차..."},
  {"key":"records","title":"7. 기록","placeholder":"리스크 평가표, 실사 결과, 신고·조사 기록..."}
]'::jsonb),

('CM-8P-01-TPL', 'iso37301', 'CM', '850', 'P',
'준수의무 관리 프로세스', '6.1/8.1', 'pro', 19,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"적용 법규와 내부 준수의무를 식별·평가·반영하여 위반 리스크를 예방..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"법률, 규제, 계약상 의무, 내부 규정 및 대외 공표사항..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"준수의무, 통제, 위반사례, 조사, 시정조치..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"컴플라이언스 담당: 의무 목록 관리, 부서장: 현업 반영, 경영진: 지원 및 감독..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 준수의무 식별 2) 영향 평가 3) 내부 절차 반영 4) 모니터링 5) 위반 대응..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"법규 목록, 내부 신고, 조사 절차, 경영검토 자료..."},
  {"key":"records","title":"7. 기록","placeholder":"준수의무 목록, 점검 결과, 위반 대응 이력..."}
]'::jsonb),

('IS-8P-01-TPL', 'iso27001', 'IS', '860', 'P',
'정보보안 운영통제 프로세스', '5~8 / Annex A', 'pro', 20,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"정보자산의 기밀성, 무결성, 가용성을 보호하기 위한 운영통제를 정의하고 관리..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"정보시스템, 계정, 단말, 네트워크, 외부 서비스, 문서화된 정보..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"정보자산, 접근통제, 취약점, 보안사고, 백업, 로그..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"보안책임자: 통제 체계 운영, 시스템 관리자: 기술통제 수행, 사용자: 정책 준수..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 자산 식별 2) 접근권한 부여·변경·회수 3) 취약점 및 패치 관리 4) 사고 대응 5) 복구 확인..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"접근권한 관리, 백업, 사고대응, 공급자 보안관리 절차..."},
  {"key":"records","title":"7. 기록","placeholder":"권한 승인 기록, 점검 로그, 사고 대응 이력..."}
]'::jsonb),

('FS-8P-01-TPL', 'iso22000', 'FS', '870', 'P',
'식품안전 운영관리 프로세스', '8', 'pro', 21,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"식품안전 위해요소를 예방·제어하여 안전한 제품과 서비스를 제공..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"원재료 수급, 생산·조리·보관·출하, 위생관리, 추적성 운영..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"위해요소, PRP, OPRP, CCP, 추적성, 회수..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"식품안전팀: 위해요소 분석 및 검증, 현장 책임자: 운영기준 준수, 경영진: 자원 지원..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 위해요소 분석 2) 관리수단 결정 3) 한계기준 운영 4) 모니터링 5) 이탈 시 조치..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"위생관리, 회수관리, 공급자 관리, 교육훈련 절차..."},
  {"key":"records","title":"7. 기록","placeholder":"모니터링 기록, 검증 결과, 회수 훈련 이력..."}
]'::jsonb),

('BC-8P-01-TPL', 'iso22301', 'BC', '880', 'P',
'사업연속성 대응 프로세스', '8', 'pro', 22,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"중단사고 발생 시 핵심 업무를 유지·복구하기 위한 대응 체계를 운영..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"핵심 서비스, 정보시스템, 인력, 공급망, 대체 업무수행 체계..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"BIA, RTO, 복구전략, 비상대응, 위기 커뮤니케이션..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"BCM 책임자: 체계 운영, 부서장: 복구계획 유지, 대응조직: 비상 실행..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 영향분석 2) 복구전략 수립 3) 대응계획 실행 4) 대외 소통 5) 복구 후 검토..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"비상연락망, 백업 절차, 공급망 대응계획, 훈련 계획..."},
  {"key":"records","title":"7. 기록","placeholder":"영향분석서, 훈련 결과, 사고 대응 보고서..."}
]'::jsonb),

('MD-8P-01-TPL', 'iso13485', 'MD', '890', 'P',
'의료기기 품질 및 규제 운영 프로세스', '4.1/7.3/7.5/8.2', 'pro', 23,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"의료기기 제품 실현과 규제 준수를 위한 품질 운영 체계를 정의하고 관리..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"설계개발, 구매, 생산, 추적성, 변경관리, 불만처리, 시정조치..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"UDI, DMR, DHR, 밸리데이션, 불만처리, 규제보고..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"품질책임자: 규제 및 품질 체계 운영, 개발·생산 부서: 절차 이행, 경영진: 승인 및 자원 지원..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 규제 요구사항 검토 2) 설계 및 변경관리 3) 생산·검사 운영 4) 추적성 확보 5) 사후조치..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"설계관리, 공급자 관리, 불만처리, CAPA, 밸리데이션 절차..."},
  {"key":"records","title":"7. 기록","placeholder":"설계기록, 배치기록, 추적성 기록, 변경 및 불만 처리 이력..."}
]'::jsonb),

('AI-9P-01-TPL', 'iso42001', 'AI', '900', 'P',
'AI 시스템 운영 및 통제 프로세스', '5~10', 'pro', 24,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"AI 시스템의 책임성, 안전성, 투명성을 확보하기 위한 관리 체계를 운영..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"AI 기획, 데이터 수집, 학습, 배포, 모니터링, 변경관리, 외부 제공 모델 활용..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"AI 시스템, 학습데이터, 편향, 인적감독, 모델성능, 영향평가..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"AI 책임자: 거버넌스 운영, 개발팀: 기술통제 수행, 사업부서: 사용 적합성 검토..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 목적·맥락 정의 2) 데이터·모델 리스크 평가 3) 통제 설계 4) 배포 및 모니터링 5) 재평가..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"정보보안, 개인정보, 변경관리, 사고대응, 공급자 평가 절차..."},
  {"key":"records","title":"7. 기록","placeholder":"영향평가서, 테스트 결과, 모델 변경 이력, 모니터링 보고서..."}
]'::jsonb),

('NQ-9P-01-TPL', 'iso19443', 'NQ', '910', 'P',
'원자력 공급망 품질보증 프로세스', '8.1/8.4/8.5', 'enterprise', 25,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"원자력 안전 관련 공급망 활동에 대해 강화된 품질보증과 추적성 체계를 운영..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"ITNS 품목, 특수공정, 중요 외부 제공자, 설계·제조·검증 활동..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"ITNS, 안전등급, 특수공정, 검증, 추적성, 보존기록..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"품질보증 책임자: 체계 총괄, 프로젝트 책임자: 요구사항 반영, 공급망 담당: 외부 제공자 통제..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 요구사항 식별 2) 등급 및 중요도 결정 3) 공급망 통제 4) 검증 및 승인 5) 기록 보존..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"설계관리, 공급자 관리, 특수공정 관리, 부적합 처리 절차..."},
  {"key":"records","title":"7. 기록","placeholder":"등급 분류표, 검증 결과, 추적성 기록, 승인 이력..."}
]'::jsonb),

('CG-9P-01-TPL', 'iso22716', 'CG', '920', 'P',
'화장품 GMP 운영관리 프로세스', '3~17', 'pro', 26,
'[
  {"key":"purpose","title":"1. 목적","placeholder":"화장품 제조 및 품질관리 활동이 GMP 요구사항에 따라 일관되게 수행되도록 관리..."},
  {"key":"scope","title":"2. 적용 범위","placeholder":"원료 입고, 제조, 충전·포장, 보관, 출하, 위생, 일탈 및 회수관리..."},
  {"key":"terms","title":"3. 용어 및 정의","placeholder":"GMP, 일탈, 라인클리어런스, 배치, 위생관리, 회수..."},
  {"key":"responsibility","title":"4. 책임과 권한","placeholder":"품질부서: 기준 및 검토, 생산부서: 작업 수행, 물류부서: 보관 및 출하 통제..."},
  {"key":"procedure","title":"5. 업무 절차","placeholder":"1) 원료 및 자재 확인 2) 제조·포장 기준 수행 3) 위생 및 청소 관리 4) 일탈 대응 5) 출하 승인..."},
  {"key":"related_docs","title":"6. 관련 문서","placeholder":"세척 위생, 불만처리, 회수관리, 교육훈련 절차..."},
  {"key":"records","title":"7. 기록","placeholder":"배치기록, 청소점검표, 일탈 및 회수 기록..."}
]'::jsonb)

ON CONFLICT (template_code) DO UPDATE
SET
  standard = EXCLUDED.standard,
  layer = EXCLUDED.layer,
  process_no = EXCLUDED.process_no,
  doc_type = EXCLUDED.doc_type,
  title = EXCLUDED.title,
  iso_clause = EXCLUDED.iso_clause,
  plan_required = EXCLUDED.plan_required,
  sort_order = EXCLUDED.sort_order,
  sections = EXCLUDED.sections,
  is_active = true;
