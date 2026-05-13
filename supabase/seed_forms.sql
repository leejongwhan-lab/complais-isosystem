-- ══════════════════════════════════════════════════════════════
-- 서식 템플릿 시드 데이터 (40개)
-- ══════════════════════════════════════════════════════════════

-- ── 경영관리 (1xx) ────────────────────────────────────────────

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-110-01','프로세스 성과지표 목록','경영관리','110','C','9.1.1','iso9001','starter',10,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"process_name","label":"프로세스명","type":"text","required":true,"width":"half"},
  {"key":"indicators","label":"성과지표 목록","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"category","label":"구분","width":100},
    {"key":"indicator","label":"성과지표","width":200},
    {"key":"unit","label":"단위","width":80},
    {"key":"target","label":"목표","width":100},
    {"key":"actual","label":"실적","width":100},
    {"key":"achievement","label":"달성률","width":100},
    {"key":"note","label":"비고","width":150}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-120-01','업무분장표','경영관리','120','B','5.3','iso9001','starter',20,
'[
  {"key":"dept","label":"부서명","type":"text","required":true,"width":"half"},
  {"key":"revision_date","label":"개정일","type":"date","width":"half"},
  {"key":"assignments","label":"업무분장","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"task","label":"업무내용","width":250},
    {"key":"responsible","label":"책임","width":80},
    {"key":"cooperative","label":"협조","width":80},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-141-01','고객 만족도 조사 계획 및 실적','고객영업','141','C','9.1.2','iso9001','starter',30,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"surveys","label":"조사 계획","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"target","label":"대상고객","width":150},
    {"key":"method","label":"조사방법","width":150},
    {"key":"planned_date","label":"계획일","width":120},
    {"key":"actual_date","label":"실시일","width":120},
    {"key":"score","label":"점수","width":80},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-141-02','고객 만족도 평가서','고객영업','141','B','9.1.2','iso9001','starter',40,
'[
  {"key":"customer","label":"고객사명","type":"text","required":true,"width":"half"},
  {"key":"survey_date","label":"조사일","type":"date","required":true,"width":"half"},
  {"key":"surveyor","label":"조사자","type":"text","width":"half"},
  {"key":"period","label":"대상기간","type":"text","width":"half"},
  {"key":"quality_score","label":"품질 점수 (1~5)","type":"number","width":"half"},
  {"key":"delivery_score","label":"납기 점수 (1~5)","type":"number","width":"half"},
  {"key":"service_score","label":"서비스 점수 (1~5)","type":"number","width":"half"},
  {"key":"price_score","label":"가격 점수 (1~5)","type":"number","width":"half"},
  {"key":"total_score","label":"종합 점수","type":"number","width":"half"},
  {"key":"feedback","label":"주요 의견","type":"textarea","width":"full"},
  {"key":"action","label":"개선 조치사항","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-143-01','문서 관리 대장','경영관리','143','B','7.5','iso9001','starter',50,
'[
  {"key":"documents","label":"문서 목록","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"doc_number","label":"문서번호","width":120},
    {"key":"doc_name","label":"문서명","width":200},
    {"key":"version","label":"버전","width":70},
    {"key":"owner","label":"담당자","width":100},
    {"key":"approved_date","label":"승인일","width":120},
    {"key":"status","label":"상태","width":80},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-144-01','기록 관리 대장','경영관리','144','B','7.5.3','iso9001','starter',60,
'[
  {"key":"records_list","label":"기록 목록","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"record_name","label":"기록명","width":200},
    {"key":"form_number","label":"서식번호","width":120},
    {"key":"retention","label":"보존기간","width":100},
    {"key":"storage","label":"보관장소","width":150},
    {"key":"responsible","label":"관리부서","width":100},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-150-01','연간 내부심사 계획서','경영관리','150','C','9.2','iso9001','starter',70,
'[
  {"key":"year","label":"심사 연도","type":"text","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","required":true,"width":"half"},
  {"key":"schedule","label":"심사 일정","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"process","label":"심사 대상 프로세스","width":200},
    {"key":"q1","label":"1분기","width":80},
    {"key":"q2","label":"2분기","width":80},
    {"key":"q3","label":"3분기","width":80},
    {"key":"q4","label":"4분기","width":80},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-150-02','내부심사 세부 계획서','경영관리','150','B','9.2','iso9001','starter',80,
'[
  {"key":"audit_number","label":"심사 번호","type":"text","required":true,"width":"half"},
  {"key":"audit_date","label":"심사 일자","type":"date","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","required":true,"width":"half"},
  {"key":"target_dept","label":"피심사 부서","type":"text","required":true,"width":"half"},
  {"key":"scope","label":"심사 범위","type":"textarea","width":"full"},
  {"key":"checklist","label":"심사 항목","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"iso_clause","label":"ISO 조항","width":100},
    {"key":"check_item","label":"심사 항목","width":300},
    {"key":"result","label":"판정(C/NC/OBS)","width":120},
    {"key":"evidence","label":"심사 증거","width":200}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-170-01','시정 및 예방조치 관리 대장','경영관리','170','B','10.2','iso9001','starter',90,
'[
  {"key":"actions","label":"시정조치 현황","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"capa_number","label":"CAPA번호","width":130},
    {"key":"source","label":"발생원","width":120},
    {"key":"title","label":"제목","width":200},
    {"key":"owner","label":"담당자","width":100},
    {"key":"due_date","label":"완료예정일","width":120},
    {"key":"status","label":"진행상태","width":100},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-170-02','시정 및 예방조치 요구서','경영관리','170','B','10.2','iso9001','starter',100,
'[
  {"key":"capa_number","label":"CAPA 번호","type":"text","required":true,"width":"half"},
  {"key":"issue_date","label":"발행일","type":"date","required":true,"width":"half"},
  {"key":"source","label":"발생원","type":"select","options":["내부심사","고객클레임","공정불량","측정기교정","기타"],"required":true,"width":"half"},
  {"key":"grade","label":"등급","type":"select","options":["A급(Critical)","B급(Major)","C급(Minor)"],"required":true,"width":"half"},
  {"key":"description","label":"부적합 내용","type":"textarea","required":true,"width":"full"},
  {"key":"immediate_action","label":"즉각 조치사항","type":"textarea","width":"full"},
  {"key":"root_cause","label":"근본 원인","type":"textarea","width":"full"},
  {"key":"corrective_action","label":"시정 조치사항","type":"textarea","width":"full"},
  {"key":"due_date","label":"완료 예정일","type":"date","width":"half"},
  {"key":"owner","label":"담당자","type":"text","width":"half"},
  {"key":"verification","label":"효과성 확인","type":"textarea","width":"full"},
  {"key":"close_date","label":"종결일","type":"date","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-180-01','개선 계획서','경영관리','180','B','10.3','iso9001','starter',110,
'[
  {"key":"title","label":"개선 과제명","type":"text","required":true,"width":"full"},
  {"key":"category","label":"개선 구분","type":"select","options":["품질개선","원가절감","생산성향상","환경개선","안전개선","기타"],"width":"half"},
  {"key":"proposer","label":"제안자","type":"text","width":"half"},
  {"key":"background","label":"개선 배경","type":"textarea","width":"full"},
  {"key":"current_state","label":"현재 상태","type":"textarea","width":"full"},
  {"key":"target_state","label":"목표 상태","type":"textarea","width":"full"},
  {"key":"action_plan","label":"실행 계획","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"action","label":"실행 내용","width":250},
    {"key":"owner","label":"담당자","width":100},
    {"key":"start_date","label":"시작일","width":120},
    {"key":"end_date","label":"완료일","width":120},
    {"key":"status","label":"상태","width":80}
  ]},
  {"key":"expected_effect","label":"기대 효과","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-180-02','개선 과제 관리 대장','경영관리','180','C','10.3','iso9001','starter',120,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"improvements","label":"개선 과제 현황","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"title","label":"과제명","width":200},
    {"key":"category","label":"구분","width":100},
    {"key":"proposer","label":"제안자","width":100},
    {"key":"start_date","label":"시작일","width":120},
    {"key":"end_date","label":"완료일","width":120},
    {"key":"status","label":"상태","width":80},
    {"key":"effect","label":"효과","width":150}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-180-03','개선 완료 보고서','경영관리','180','B','10.3','iso9001','starter',130,
'[
  {"key":"title","label":"개선 과제명","type":"text","required":true,"width":"full"},
  {"key":"period","label":"개선 기간","type":"text","width":"half"},
  {"key":"owner","label":"담당자","type":"text","width":"half"},
  {"key":"before_state","label":"개선 전 상태","type":"textarea","width":"full"},
  {"key":"after_state","label":"개선 후 상태","type":"textarea","width":"full"},
  {"key":"effect","label":"개선 효과 (정량)","type":"textarea","width":"full"},
  {"key":"sustain_plan","label":"유지 관리 계획","type":"textarea","width":"full"},
  {"key":"complete_date","label":"완료일","type":"date","width":"half"},
  {"key":"approver","label":"승인자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ── 구매·공급자 (4xx) ─────────────────────────────────────────

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-420-01','외주업체 감사 계획','구매공급자','420','C','8.4','iso9001','starter',140,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"audits","label":"감사 계획","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"supplier","label":"업체명","width":150},
    {"key":"category","label":"품목","width":120},
    {"key":"planned_date","label":"예정일","width":120},
    {"key":"actual_date","label":"실시일","width":120},
    {"key":"auditor","label":"심사원","width":100},
    {"key":"result","label":"결과","width":80},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-420-02','협력업체 종합 평가 보고서','구매공급자','420','B','8.4','iso9001','starter',150,
'[
  {"key":"supplier","label":"업체명","type":"text","required":true,"width":"half"},
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"category","label":"주요 품목","type":"text","width":"half"},
  {"key":"quality_score","label":"품질 점수 (40점)","type":"number","width":"half"},
  {"key":"delivery_score","label":"납기 점수 (30점)","type":"number","width":"half"},
  {"key":"price_score","label":"가격 점수 (20점)","type":"number","width":"half"},
  {"key":"cooperation_score","label":"협력도 점수 (10점)","type":"number","width":"half"},
  {"key":"total_score","label":"종합 점수","type":"number","width":"half"},
  {"key":"grade","label":"등급 (A/B/C/D)","type":"select","options":["A","B","C","D"],"width":"half"},
  {"key":"strengths","label":"강점","type":"textarea","width":"full"},
  {"key":"weaknesses","label":"약점 및 개선 요청사항","type":"textarea","width":"full"},
  {"key":"decision","label":"거래 결정","type":"select","options":["승인","조건부승인","보류","거래정지"],"width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-430-01','원부자재 입출고 일지','구매공급자','430','D','8.4','iso9001','starter',160,
'[
  {"key":"record_month","label":"기록 월","type":"text","required":true,"width":"half"},
  {"key":"warehouse","label":"창고명","type":"text","width":"half"},
  {"key":"records","label":"입출고 기록","type":"table","columns":[
    {"key":"date","label":"일자","width":100},
    {"key":"material","label":"자재명","width":150},
    {"key":"spec","label":"규격","width":100},
    {"key":"in_qty","label":"입고량","width":80},
    {"key":"out_qty","label":"출고량","width":80},
    {"key":"stock","label":"재고","width":80},
    {"key":"unit","label":"단위","width":60},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-430-02','월간 제품 출하 계획 및 실적','구매공급자','430','C','8.5','iso9001','starter',170,
'[
  {"key":"year_month","label":"연월","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"shipments","label":"출하 현황","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"customer","label":"고객사","width":150},
    {"key":"product","label":"제품명","width":150},
    {"key":"planned_qty","label":"계획수량","width":100},
    {"key":"actual_qty","label":"실적수량","width":100},
    {"key":"planned_date","label":"계획일","width":120},
    {"key":"actual_date","label":"출하일","width":120},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-430-03','창고 정기 점검표','구매공급자','430','D','7.1.3','iso9001','starter',180,
'[
  {"key":"check_date","label":"점검일","type":"date","required":true,"width":"half"},
  {"key":"checker","label":"점검자","type":"text","required":true,"width":"half"},
  {"key":"items","label":"점검 항목","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"category","label":"구분","width":100},
    {"key":"check_item","label":"점검 내용","width":250},
    {"key":"result","label":"결과(O/X)","width":80},
    {"key":"note","label":"특이사항","width":200}
  ]},
  {"key":"overall","label":"종합 의견","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ── 생산관리 (5xx) ────────────────────────────────────────────

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-510-01','연간 생산계획서','생산관리','510','C','8.1','iso9001','starter',190,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"plan","label":"연간 생산 계획","type":"table","columns":[
    {"key":"product","label":"제품명","width":150},
    {"key":"unit","label":"단위","width":60},
    {"key":"jan","label":"1월","width":70},
    {"key":"feb","label":"2월","width":70},
    {"key":"mar","label":"3월","width":70},
    {"key":"apr","label":"4월","width":70},
    {"key":"may","label":"5월","width":70},
    {"key":"jun","label":"6월","width":70},
    {"key":"jul","label":"7월","width":70},
    {"key":"aug","label":"8월","width":70},
    {"key":"sep","label":"9월","width":70},
    {"key":"oct","label":"10월","width":70},
    {"key":"nov","label":"11월","width":70},
    {"key":"dec","label":"12월","width":70},
    {"key":"total","label":"합계","width":80}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-510-02','월간 생산계획서','생산관리','510','C','8.1','iso9001','starter',200,
'[
  {"key":"year_month","label":"연월","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"plan","label":"월간 생산 계획","type":"table","columns":[
    {"key":"product","label":"제품명","width":150},
    {"key":"unit","label":"단위","width":60},
    {"key":"w1","label":"1주","width":80},
    {"key":"w2","label":"2주","width":80},
    {"key":"w3","label":"3주","width":80},
    {"key":"w4","label":"4주","width":80},
    {"key":"planned","label":"계획합계","width":90},
    {"key":"actual","label":"실적합계","width":90},
    {"key":"rate","label":"달성률","width":80}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-540-01','변경 의뢰신고서','생산관리','540','B','8.5.6','iso9001','starter',210,
'[
  {"key":"change_number","label":"변경 번호","type":"text","required":true,"width":"half"},
  {"key":"request_date","label":"신청일","type":"date","required":true,"width":"half"},
  {"key":"requester","label":"신청자","type":"text","width":"half"},
  {"key":"dept","label":"부서","type":"text","width":"half"},
  {"key":"change_type","label":"변경 구분","type":"select","options":["도면변경","공정변경","원자재변경","설비변경","기타"],"required":true,"width":"half"},
  {"key":"target","label":"변경 대상","type":"text","required":true,"width":"full"},
  {"key":"current_state","label":"현재 상태","type":"textarea","width":"full"},
  {"key":"change_content","label":"변경 내용","type":"textarea","required":true,"width":"full"},
  {"key":"reason","label":"변경 이유","type":"textarea","required":true,"width":"full"},
  {"key":"effect_analysis","label":"영향 분석","type":"textarea","width":"full"},
  {"key":"planned_date","label":"적용 예정일","type":"date","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-540-02','변경 관리 대장','생산관리','540','B','8.5.6','iso9001','starter',220,
'[
  {"key":"changes","label":"변경 이력","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"change_number","label":"변경번호","width":130},
    {"key":"change_type","label":"변경구분","width":100},
    {"key":"target","label":"변경대상","width":200},
    {"key":"requester","label":"신청자","width":100},
    {"key":"request_date","label":"신청일","width":120},
    {"key":"apply_date","label":"적용일","width":120},
    {"key":"status","label":"상태","width":80}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-550-01','설비 일상 점검표','생산관리','550','D','7.1.3','iso9001','starter',230,
'[
  {"key":"equip_name","label":"설비명","type":"text","required":true,"width":"half"},
  {"key":"equip_number","label":"설비번호","type":"text","width":"half"},
  {"key":"check_month","label":"점검 월","type":"text","required":true,"width":"half"},
  {"key":"checker","label":"점검자","type":"text","required":true,"width":"half"},
  {"key":"daily_checks","label":"일상 점검 기록","type":"table","columns":[
    {"key":"date","label":"일자","width":80},
    {"key":"item1","label":"외관상태","width":90},
    {"key":"item2","label":"오일레벨","width":90},
    {"key":"item3","label":"냉각수","width":90},
    {"key":"item4","label":"이상소음","width":90},
    {"key":"item5","label":"안전장치","width":90},
    {"key":"result","label":"이상유무","width":80},
    {"key":"checker_sign","label":"점검자","width":80},
    {"key":"note","label":"특이사항","width":150}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-550-02','연간 설비 보전 계획 및 실적','생산관리','550','C','7.1.3','iso9001','starter',240,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"maintenance","label":"설비 보전 계획","type":"table","columns":[
    {"key":"equip_name","label":"설비명","width":150},
    {"key":"maintenance_type","label":"보전유형","width":100},
    {"key":"q1_plan","label":"1분기계획","width":90},
    {"key":"q1_actual","label":"1분기실적","width":90},
    {"key":"q2_plan","label":"2분기계획","width":90},
    {"key":"q2_actual","label":"2분기실적","width":90},
    {"key":"q3_plan","label":"3분기계획","width":90},
    {"key":"q3_actual","label":"3분기실적","width":90},
    {"key":"q4_plan","label":"4분기계획","width":90},
    {"key":"q4_actual","label":"4분기실적","width":90},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-550-03','설비 등록 대장','생산관리','550','B','7.1.3','iso9001','starter',250,
'[
  {"key":"equip_list","label":"설비 목록","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"equip_number","label":"설비번호","width":120},
    {"key":"equip_name","label":"설비명","width":150},
    {"key":"spec","label":"규격/모델","width":150},
    {"key":"maker","label":"제조사","width":120},
    {"key":"install_date","label":"설치일","width":120},
    {"key":"location","label":"설치위치","width":120},
    {"key":"manager","label":"담당자","width":100},
    {"key":"status","label":"상태","width":80}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-560-01','5S 활동 점검 일지','생산관리','560','D','7.1.4','iso9001','starter',260,
'[
  {"key":"check_date","label":"점검일","type":"date","required":true,"width":"half"},
  {"key":"area","label":"점검 구역","type":"text","required":true,"width":"half"},
  {"key":"checker","label":"점검자","type":"text","required":true,"width":"half"},
  {"key":"items","label":"5S 점검 항목","type":"table","columns":[
    {"key":"category","label":"구분","width":80},
    {"key":"check_item","label":"점검 내용","width":250},
    {"key":"score","label":"점수(1~5)","width":90},
    {"key":"note","label":"지적사항","width":200}
  ]},
  {"key":"total_score","label":"총점","type":"number","width":"half"},
  {"key":"improvement","label":"개선 필요사항","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ── 품질관리 (6xx) ────────────────────────────────────────────

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-610-01','수입검사 기준서','품질관리','610','B','8.4','iso9001','starter',270,
'[
  {"key":"material_name","label":"자재명","type":"text","required":true,"width":"half"},
  {"key":"material_code","label":"자재코드","type":"text","width":"half"},
  {"key":"supplier","label":"공급업체","type":"text","width":"half"},
  {"key":"revision","label":"개정차수","type":"text","width":"half"},
  {"key":"inspection_items","label":"검사 항목","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"item","label":"검사항목","width":150},
    {"key":"spec","label":"규격/기준","width":150},
    {"key":"method","label":"검사방법","width":150},
    {"key":"tool","label":"검사도구","width":120},
    {"key":"sample_size","label":"샘플수","width":80},
    {"key":"accept_criteria","label":"합격기준","width":120}
  ]},
  {"key":"sampling_plan","label":"샘플링 계획","type":"textarea","width":"full"},
  {"key":"action_on_fail","label":"불합격 처리 방법","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-610-02','제품 검사 기준서','품질관리','610','B','8.6','iso9001','starter',280,
'[
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"product_code","label":"제품코드","type":"text","width":"half"},
  {"key":"customer","label":"고객사","type":"text","width":"half"},
  {"key":"revision","label":"개정차수","type":"text","width":"half"},
  {"key":"inspection_items","label":"검사 항목","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"item","label":"검사항목","width":150},
    {"key":"spec","label":"규격/기준","width":150},
    {"key":"method","label":"검사방법","width":150},
    {"key":"tool","label":"검사도구","width":120},
    {"key":"frequency","label":"검사빈도","width":100},
    {"key":"accept_criteria","label":"합격기준","width":120}
  ]},
  {"key":"action_on_fail","label":"불합격 처리 방법","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-620-01','부적합 관리 대장','품질관리','620','B','8.7','iso9001','starter',290,
'[
  {"key":"nonconformities","label":"부적합 현황","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"date","label":"발생일","width":100},
    {"key":"product","label":"제품/자재명","width":150},
    {"key":"description","label":"부적합 내용","width":200},
    {"key":"qty","label":"수량","width":70},
    {"key":"cause","label":"원인","width":150},
    {"key":"disposition","label":"처리방법","width":120},
    {"key":"handler","label":"처리자","width":100},
    {"key":"capa","label":"CAPA번호","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-620-02','부적합 처리 보고서','품질관리','620','B','8.7','iso9001','starter',300,
'[
  {"key":"report_number","label":"보고서 번호","type":"text","required":true,"width":"half"},
  {"key":"occurrence_date","label":"발생일","type":"date","required":true,"width":"half"},
  {"key":"product","label":"제품/자재명","type":"text","required":true,"width":"half"},
  {"key":"lot_number","label":"LOT 번호","type":"text","width":"half"},
  {"key":"qty","label":"부적합 수량","type":"number","width":"half"},
  {"key":"discoverer","label":"발견자","type":"text","width":"half"},
  {"key":"description","label":"부적합 내용 (현상)","type":"textarea","required":true,"width":"full"},
  {"key":"cause","label":"원인 분석","type":"textarea","width":"full"},
  {"key":"disposition","label":"처리 방법","type":"select","options":["재작업","특채","폐기","반품","기타"],"width":"half"},
  {"key":"disposition_detail","label":"처리 내용","type":"textarea","width":"full"},
  {"key":"qty_ok","label":"합격 수량","type":"number","width":"half"},
  {"key":"qty_ng","label":"폐기 수량","type":"number","width":"half"},
  {"key":"capa_required","label":"CAPA 발행 여부","type":"select","options":["필요","불필요"],"width":"half"},
  {"key":"handler","label":"처리자","type":"text","width":"half"},
  {"key":"complete_date","label":"처리 완료일","type":"date","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-630-01','측정 장비 관리 대장','품질관리','630','B','7.1.5','iso9001','starter',310,
'[
  {"key":"instruments","label":"측정장비 목록","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"instr_number","label":"장비번호","width":120},
    {"key":"instr_name","label":"장비명","width":150},
    {"key":"spec","label":"규격/범위","width":150},
    {"key":"maker","label":"제조사","width":120},
    {"key":"location","label":"보관위치","width":120},
    {"key":"cal_cycle","label":"교정주기","width":100},
    {"key":"last_cal","label":"최근교정일","width":120},
    {"key":"next_cal","label":"차기교정일","width":120},
    {"key":"status","label":"상태","width":80}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-630-02','측정 장비 이력 카드','품질관리','630','B','7.1.5','iso9001','starter',320,
'[
  {"key":"instr_number","label":"장비 번호","type":"text","required":true,"width":"half"},
  {"key":"instr_name","label":"장비명","type":"text","required":true,"width":"half"},
  {"key":"maker","label":"제조사","type":"text","width":"half"},
  {"key":"model","label":"모델명","type":"text","width":"half"},
  {"key":"serial","label":"시리얼 번호","type":"text","width":"half"},
  {"key":"range","label":"측정 범위","type":"text","width":"half"},
  {"key":"accuracy","label":"정확도","type":"text","width":"half"},
  {"key":"purchase_date","label":"구입일","type":"date","width":"half"},
  {"key":"cal_history","label":"교정 이력","type":"table","columns":[
    {"key":"cal_date","label":"교정일","width":120},
    {"key":"cal_agency","label":"교정기관","width":150},
    {"key":"result","label":"교정결과","width":100},
    {"key":"next_cal","label":"차기교정일","width":120},
    {"key":"certificate","label":"성적서번호","width":150},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ── 인사·교육 (7xx) ───────────────────────────────────────────

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-710-01','자격 관리 대장','인사교육','710','B','7.2','iso9001','starter',330,
'[
  {"key":"qualifications","label":"자격 현황","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"name","label":"성명","width":100},
    {"key":"dept","label":"부서","width":100},
    {"key":"position","label":"직책","width":100},
    {"key":"qual_type","label":"자격구분","width":120},
    {"key":"qual_name","label":"자격명","width":150},
    {"key":"acquired_date","label":"취득일","width":120},
    {"key":"expire_date","label":"만료일","width":120},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-710-02','내부심사원 자격인정 평가서','인사교육','710','B','7.2','iso9001','starter',340,
'[
  {"key":"name","label":"성명","type":"text","required":true,"width":"half"},
  {"key":"dept","label":"부서","type":"text","width":"half"},
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"education_score","label":"교육 이수 점수 (30점)","type":"number","width":"half"},
  {"key":"knowledge_score","label":"ISO 지식 평가 점수 (40점)","type":"number","width":"half"},
  {"key":"practice_score","label":"실습 평가 점수 (30점)","type":"number","width":"half"},
  {"key":"total_score","label":"총점","type":"number","width":"half"},
  {"key":"result","label":"합격여부","type":"select","options":["합격","불합격"],"width":"half"},
  {"key":"valid_period","label":"자격 유효기간","type":"text","width":"half"},
  {"key":"note","label":"비고","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-710-03','시험검사요원 자격인정 평가서','인사교육','710','B','7.2','iso9001','starter',350,
'[
  {"key":"name","label":"성명","type":"text","required":true,"width":"half"},
  {"key":"dept","label":"부서","type":"text","width":"half"},
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"test_type","label":"검사 유형","type":"select","options":["수입검사","공정검사","최종검사"],"width":"half"},
  {"key":"theory_score","label":"이론 평가 (50점)","type":"number","width":"half"},
  {"key":"practice_score","label":"실기 평가 (50점)","type":"number","width":"half"},
  {"key":"total_score","label":"총점","type":"number","width":"half"},
  {"key":"result","label":"합격여부","type":"select","options":["합격","불합격"],"width":"half"},
  {"key":"valid_period","label":"자격 유효기간","type":"text","width":"half"},
  {"key":"note","label":"비고","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-720-01','교육 계획서','인사교육','720','C','7.2','iso9001','starter',360,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"교육 담당자","type":"text","width":"half"},
  {"key":"plan","label":"교육 계획","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"title","label":"교육명","width":200},
    {"key":"type","label":"구분","width":80},
    {"key":"target","label":"대상","width":120},
    {"key":"hours","label":"시간","width":70},
    {"key":"planned_date","label":"계획일","width":120},
    {"key":"actual_date","label":"실시일","width":120},
    {"key":"trainer","label":"강사","width":100},
    {"key":"planned_count","label":"계획인원","width":90},
    {"key":"actual_count","label":"이수인원","width":90},
    {"key":"result","label":"결과","width":80}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-720-02','교육 일지','인사교육','720','B','7.2','iso9001','starter',370,
'[
  {"key":"title","label":"교육명","type":"text","required":true,"width":"full"},
  {"key":"date","label":"교육일","type":"date","required":true,"width":"half"},
  {"key":"duration","label":"교육 시간","type":"text","width":"half"},
  {"key":"location","label":"교육 장소","type":"text","width":"half"},
  {"key":"trainer","label":"강사명","type":"text","width":"half"},
  {"key":"type","label":"교육 유형","type":"select","options":["내부교육","외부교육","OJT","온라인"],"width":"half"},
  {"key":"content","label":"교육 내용","type":"textarea","required":true,"width":"full"},
  {"key":"attendees","label":"참석자 명단","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"name","label":"성명","width":100},
    {"key":"dept","label":"부서","width":100},
    {"key":"position","label":"직책","width":100},
    {"key":"sign","label":"서명","width":100}
  ]},
  {"key":"evaluation","label":"교육 효과성 평가","type":"textarea","width":"full"},
  {"key":"next_plan","label":"후속 조치","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ── 환경·안전 (8xx) ───────────────────────────────────────────

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-810-01','EHS 목표 및 추진계획','환경안전','810','C','6.2','iso14001','pro',380,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"objectives","label":"목표 및 추진계획","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"category","label":"구분","width":80},
    {"key":"objective","label":"목표","width":200},
    {"key":"indicator","label":"성과지표","width":150},
    {"key":"target","label":"목표값","width":100},
    {"key":"action","label":"추진계획","width":200},
    {"key":"owner","label":"담당부서","width":100},
    {"key":"q1","label":"1분기","width":70},
    {"key":"q2","label":"2분기","width":70},
    {"key":"q3","label":"3분기","width":70},
    {"key":"q4","label":"4분기","width":70},
    {"key":"result","label":"연간실적","width":90}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-810-02','우발사고 대비 계획','환경안전','810','B','8.2','iso14001','pro',390,
'[
  {"key":"revision_date","label":"개정일","type":"date","width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"scenarios","label":"비상사태 시나리오","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"scenario","label":"비상사태 유형","width":150},
    {"key":"cause","label":"원인","width":150},
    {"key":"response","label":"대응 절차","width":250},
    {"key":"responsible","label":"책임자","width":100},
    {"key":"contact","label":"비상연락처","width":130}
  ]},
  {"key":"drill_plan","label":"훈련 계획","type":"textarea","width":"full"},
  {"key":"evacuation_route","label":"대피 경로","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-810-03','환경영향 등록부','환경안전','810','B','6.1.2','iso14001','pro',400,
'[
  {"key":"revision_date","label":"작성/개정일","type":"date","width":"half"},
  {"key":"manager","label":"작성자","type":"text","width":"half"},
  {"key":"aspects","label":"환경영향 목록","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"process","label":"활동/공정","width":150},
    {"key":"aspect","label":"환경측면","width":150},
    {"key":"impact","label":"환경영향","width":150},
    {"key":"condition","label":"조건","width":80},
    {"key":"likelihood","label":"발생가능성","width":90},
    {"key":"severity","label":"심각도","width":80},
    {"key":"score","label":"중요도점수","width":90},
    {"key":"significant","label":"중요여부","width":80},
    {"key":"control","label":"관리방안","width":200}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- ISO 14001 전용 서식 추가
-- ═══════════════════════════════════════════════════════════════

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-810-04','환경 모니터링 기록','환경안전','810','D','8.1','iso14001','pro',410,
'[
  {"key":"record_month","label":"기록 월","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"monitoring","label":"환경 모니터링 기록","type":"table","columns":[
    {"key":"date","label":"측정일","width":100},
    {"key":"item","label":"측정항목","width":120},
    {"key":"location","label":"측정위치","width":120},
    {"key":"standard","label":"기준값","width":100},
    {"key":"measured","label":"측정값","width":100},
    {"key":"unit","label":"단위","width":60},
    {"key":"result","label":"적합여부","width":80},
    {"key":"note","label":"비고","width":150}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-810-05','폐기물 처리 기록','환경안전','810','D','8.1','iso14001','pro',420,
'[
  {"key":"record_month","label":"기록 월","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"records","label":"폐기물 처리 기록","type":"table","columns":[
    {"key":"date","label":"발생일","width":100},
    {"key":"waste_type","label":"폐기물 종류","width":150},
    {"key":"classification","label":"분류(지정/일반)","width":120},
    {"key":"amount","label":"발생량","width":80},
    {"key":"unit","label":"단위","width":60},
    {"key":"storage","label":"보관장소","width":120},
    {"key":"disposal_method","label":"처리방법","width":120},
    {"key":"disposal_company","label":"처리업체","width":130},
    {"key":"disposal_date","label":"처리일","width":100},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-810-06','에너지 사용량 기록','환경안전','810','D','8.1','iso14001','pro',430,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"energy","label":"에너지 사용 현황","type":"table","columns":[
    {"key":"category","label":"에너지 구분","width":120},
    {"key":"unit","label":"단위","width":60},
    {"key":"jan","label":"1월","width":70},
    {"key":"feb","label":"2월","width":70},
    {"key":"mar","label":"3월","width":70},
    {"key":"apr","label":"4월","width":70},
    {"key":"may","label":"5월","width":70},
    {"key":"jun","label":"6월","width":70},
    {"key":"jul","label":"7월","width":70},
    {"key":"aug","label":"8월","width":70},
    {"key":"sep","label":"9월","width":70},
    {"key":"oct","label":"10월","width":70},
    {"key":"nov","label":"11월","width":70},
    {"key":"dec","label":"12월","width":70},
    {"key":"total","label":"합계","width":80},
    {"key":"prev_total","label":"전년합계","width":90}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-810-07','환경 법규 준수 평가서','환경안전','810','B','9.1.2','iso14001','pro',440,
'[
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"eval_period","label":"평가 기간","type":"text","width":"half"},
  {"key":"compliance","label":"법규 준수 평가","type":"table","columns":[
    {"key":"law_name","label":"법규명","width":180},
    {"key":"article","label":"해당 조항","width":100},
    {"key":"requirement","label":"요구사항","width":200},
    {"key":"status","label":"준수여부","width":90},
    {"key":"evidence","label":"준수 증거","width":180},
    {"key":"note","label":"조치사항","width":150}
  ]},
  {"key":"overall","label":"종합 평가 의견","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-810-08','환경 내부심사 체크리스트','환경안전','810','D','9.2','iso14001','pro',450,
'[
  {"key":"audit_date","label":"심사일","type":"date","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","required":true,"width":"half"},
  {"key":"target_dept","label":"피심사 부서","type":"text","width":"half"},
  {"key":"items","label":"심사 항목","type":"table","columns":[
    {"key":"iso_clause","label":"ISO 조항","width":100},
    {"key":"check_item","label":"심사 항목","width":280},
    {"key":"result","label":"C/NC/OBS","width":100},
    {"key":"evidence","label":"증거/비고","width":200}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- ISO 45001 전용 서식 추가
-- ═══════════════════════════════════════════════════════════════

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-820-01','안전보건 목표 추진계획','환경안전','820','C','6.2','iso45001','pro',460,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"objectives","label":"안전보건 목표 및 추진계획","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"objective","label":"목표","width":200},
    {"key":"indicator","label":"성과지표","width":150},
    {"key":"target","label":"목표값","width":100},
    {"key":"action","label":"추진계획","width":200},
    {"key":"owner","label":"담당부서","width":100},
    {"key":"q1","label":"1분기","width":70},
    {"key":"q2","label":"2분기","width":70},
    {"key":"q3","label":"3분기","width":70},
    {"key":"q4","label":"4분기","width":70},
    {"key":"result","label":"연간실적","width":90}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-820-02','작업허가서','환경안전','820','B','8.1','iso45001','pro',470,
'[
  {"key":"permit_number","label":"허가서 번호","type":"text","required":true,"width":"half"},
  {"key":"permit_date","label":"작업일","type":"date","required":true,"width":"half"},
  {"key":"work_type","label":"작업 유형","type":"select","options":["고소작업","밀폐공간","화기작업","전기작업","굴착작업","방사선작업","기타"],"required":true,"width":"half"},
  {"key":"location","label":"작업 장소","type":"text","required":true,"width":"half"},
  {"key":"worker","label":"작업자","type":"text","required":true,"width":"half"},
  {"key":"supervisor","label":"감독자","type":"text","width":"half"},
  {"key":"start_time","label":"작업 시작","type":"text","width":"half"},
  {"key":"end_time","label":"작업 종료","type":"text","width":"half"},
  {"key":"work_content","label":"작업 내용","type":"textarea","required":true,"width":"full"},
  {"key":"hazards","label":"위험 요인","type":"textarea","width":"full"},
  {"key":"ppe","label":"착용 보호구","type":"textarea","width":"full"},
  {"key":"safety_measures","label":"안전 조치사항","type":"textarea","width":"full"},
  {"key":"checklist","label":"작업 전 안전 점검","type":"table","columns":[
    {"key":"item","label":"점검 항목","width":250},
    {"key":"result","label":"확인(O/X)","width":90},
    {"key":"note","label":"특이사항","width":200}
  ]},
  {"key":"approver","label":"승인자","type":"text","width":"half"},
  {"key":"approve_date","label":"승인일시","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-820-03','사고 보고서','환경안전','820','B','10.2','iso45001','pro',480,
'[
  {"key":"report_number","label":"보고서 번호","type":"text","required":true,"width":"half"},
  {"key":"occurrence_date","label":"발생일시","type":"text","required":true,"width":"half"},
  {"key":"location","label":"발생 장소","type":"text","required":true,"width":"half"},
  {"key":"accident_type","label":"사고 유형","type":"select","options":["재해","아차사고","위험상황","환경사고","기타"],"required":true,"width":"half"},
  {"key":"victim","label":"피해자(해당시)","type":"text","width":"half"},
  {"key":"injury_type","label":"상해 유형","type":"text","width":"half"},
  {"key":"description","label":"사고 경위","type":"textarea","required":true,"width":"full"},
  {"key":"immediate_cause","label":"직접 원인","type":"textarea","width":"full"},
  {"key":"root_cause","label":"근본 원인","type":"textarea","width":"full"},
  {"key":"immediate_action","label":"즉각 조치사항","type":"textarea","width":"full"},
  {"key":"corrective_action","label":"재발 방지 대책","type":"textarea","width":"full"},
  {"key":"reporter","label":"보고자","type":"text","width":"half"},
  {"key":"approver","label":"승인자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-820-04','안전보건 점검표','환경안전','820','D','9.1.1','iso45001','pro',490,
'[
  {"key":"check_date","label":"점검일","type":"date","required":true,"width":"half"},
  {"key":"checker","label":"점검자","type":"text","required":true,"width":"half"},
  {"key":"area","label":"점검 구역","type":"text","width":"half"},
  {"key":"items","label":"안전보건 점검 항목","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"category","label":"구분","width":100},
    {"key":"check_item","label":"점검 내용","width":250},
    {"key":"result","label":"결과(O/X/N/A)","width":100},
    {"key":"note","label":"지적사항","width":200}
  ]},
  {"key":"overall","label":"종합 의견","type":"textarea","width":"full"},
  {"key":"action_required","label":"조치 필요사항","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-820-05','근로자 참여·협의 기록','환경안전','820','B','5.4','iso45001','pro',500,
'[
  {"key":"meeting_date","label":"회의일","type":"date","required":true,"width":"half"},
  {"key":"meeting_type","label":"회의 유형","type":"select","options":["안전보건위원회","정기협의","임시협의","안전교육"],"width":"half"},
  {"key":"attendees","label":"참석자","type":"textarea","width":"full"},
  {"key":"agenda","label":"안건","type":"textarea","required":true,"width":"full"},
  {"key":"discussion","label":"협의 내용","type":"textarea","width":"full"},
  {"key":"decisions","label":"결정사항","type":"textarea","width":"full"},
  {"key":"action_items","label":"조치사항","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"action","label":"조치 내용","width":250},
    {"key":"owner","label":"담당자","width":100},
    {"key":"due_date","label":"완료예정일","width":120},
    {"key":"status","label":"상태","width":80}
  ]},
  {"key":"recorder","label":"기록자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-820-06','안전보건 법규 준수 평가서','환경안전','820','B','9.1.2','iso45001','pro',510,
'[
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"compliance","label":"법규 준수 평가","type":"table","columns":[
    {"key":"law_name","label":"법규명","width":180},
    {"key":"article","label":"해당 조항","width":100},
    {"key":"requirement","label":"요구사항","width":200},
    {"key":"status","label":"준수여부","width":90},
    {"key":"evidence","label":"준수 증거","width":180},
    {"key":"note","label":"조치사항","width":150}
  ]},
  {"key":"overall","label":"종합 평가 의견","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-820-07','비상훈련 실시 기록','환경안전','820','B','8.2','iso45001','pro',520,
'[
  {"key":"drill_date","label":"훈련일","type":"date","required":true,"width":"half"},
  {"key":"drill_type","label":"훈련 유형","type":"select","options":["화재대피","화학물질누출","지진","정전","기타"],"required":true,"width":"half"},
  {"key":"scenario","label":"훈련 시나리오","type":"textarea","width":"full"},
  {"key":"participants","label":"참가 인원","type":"number","width":"half"},
  {"key":"duration","label":"훈련 소요 시간","type":"text","width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"result","label":"훈련 결과 평가","type":"textarea","width":"full"},
  {"key":"problems","label":"문제점","type":"textarea","width":"full"},
  {"key":"improvements","label":"개선사항","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- 제조업 공정 특화 서식 추가
-- ═══════════════════════════════════════════════════════════════

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-520-01','공정 일지 (압출)','생산관리','520','D','8.5.1','iso9001','starter',530,
'[
  {"key":"work_date","label":"작업일","type":"date","required":true,"width":"half"},
  {"key":"operator","label":"작업자","type":"text","required":true,"width":"half"},
  {"key":"product","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"lot_number","label":"LOT 번호","type":"text","width":"half"},
  {"key":"records","label":"공정 기록","type":"table","columns":[
    {"key":"time","label":"시간","width":80},
    {"key":"temp_1","label":"온도1(℃)","width":90},
    {"key":"temp_2","label":"온도2(℃)","width":90},
    {"key":"temp_3","label":"온도3(℃)","width":90},
    {"key":"pressure","label":"압력(bar)","width":90},
    {"key":"speed","label":"속도(rpm)","width":90},
    {"key":"output","label":"생산량","width":80},
    {"key":"defect","label":"불량","width":70},
    {"key":"note","label":"특이사항","width":150}
  ]},
  {"key":"total_output","label":"총 생산량","type":"number","width":"half"},
  {"key":"total_defect","label":"총 불량량","type":"number","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-520-02','공정 체크 시트','생산관리','520','D','8.5.1','iso9001','starter',540,
'[
  {"key":"work_date","label":"작업일","type":"date","required":true,"width":"half"},
  {"key":"product","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"shift","label":"근무조","type":"select","options":["주간","야간","상시"],"width":"half"},
  {"key":"operator","label":"작업자","type":"text","width":"half"},
  {"key":"checks","label":"공정 체크 항목","type":"table","columns":[
    {"key":"time","label":"시간","width":80},
    {"key":"item1","label":"치수1","width":80},
    {"key":"item2","label":"치수2","width":80},
    {"key":"item3","label":"외관","width":80},
    {"key":"item4","label":"중량","width":80},
    {"key":"item5","label":"기능","width":80},
    {"key":"result","label":"판정","width":70},
    {"key":"checker","label":"확인자","width":80},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-520-03','부원료 칭량 일지','생산관리','520','D','8.5.1','iso9001','starter',550,
'[
  {"key":"work_date","label":"작업일","type":"date","required":true,"width":"half"},
  {"key":"product","label":"제품명/배합명","type":"text","required":true,"width":"half"},
  {"key":"lot_number","label":"LOT 번호","type":"text","width":"half"},
  {"key":"operator","label":"작업자","type":"text","width":"half"},
  {"key":"materials","label":"부원료 칭량 기록","type":"table","columns":[
    {"key":"material_name","label":"원료명","width":150},
    {"key":"standard_weight","label":"기준량(g)","width":100},
    {"key":"actual_weight","label":"실측량(g)","width":100},
    {"key":"lot_no","label":"원료LOT","width":120},
    {"key":"checker","label":"확인자","width":100},
    {"key":"note","label":"비고","width":120}
  ]},
  {"key":"total_weight","label":"총 칭량 합계","type":"number","width":"half"},
  {"key":"checker","label":"검토자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-520-04','MILL SHEET (자재 성적서)','품질관리','520','B','8.4','iso9001','starter',560,
'[
  {"key":"material_name","label":"자재명","type":"text","required":true,"width":"half"},
  {"key":"material_code","label":"자재코드","type":"text","width":"half"},
  {"key":"supplier","label":"공급업체","type":"text","required":true,"width":"half"},
  {"key":"lot_number","label":"LOT 번호","type":"text","required":true,"width":"half"},
  {"key":"mfg_date","label":"제조일","type":"date","width":"half"},
  {"key":"quantity","label":"납품 수량","type":"text","width":"half"},
  {"key":"test_results","label":"시험 성적","type":"table","columns":[
    {"key":"test_item","label":"시험항목","width":150},
    {"key":"standard","label":"규격기준","width":150},
    {"key":"result","label":"시험결과","width":150},
    {"key":"unit","label":"단위","width":70},
    {"key":"pass_fail","label":"합부","width":70}
  ]},
  {"key":"inspector","label":"검사자","type":"text","width":"half"},
  {"key":"approval","label":"승인자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- 설비 관련 추가 서식
-- ═══════════════════════════════════════════════════════════════

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-550-04','설비 이력 카드','생산관리','550','B','7.1.3','iso9001','starter',570,
'[
  {"key":"equip_number","label":"설비 번호","type":"text","required":true,"width":"half"},
  {"key":"equip_name","label":"설비명","type":"text","required":true,"width":"half"},
  {"key":"maker","label":"제조사","type":"text","width":"half"},
  {"key":"model","label":"모델명","type":"text","width":"half"},
  {"key":"serial","label":"시리얼 번호","type":"text","width":"half"},
  {"key":"install_date","label":"설치일","type":"date","width":"half"},
  {"key":"history","label":"이력 관리","type":"table","columns":[
    {"key":"date","label":"일자","width":100},
    {"key":"type","label":"구분(수리/교체/점검)","width":150},
    {"key":"content","label":"작업 내용","width":250},
    {"key":"technician","label":"작업자","width":100},
    {"key":"cost","label":"비용","width":100},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-550-05','예비 부품 관리 대장','생산관리','550','B','7.1.3','iso9001','starter',580,
'[
  {"key":"parts","label":"예비 부품 목록","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"part_name","label":"부품명","width":150},
    {"key":"part_number","label":"부품번호","width":130},
    {"key":"applicable_equip","label":"적용 설비","width":150},
    {"key":"min_stock","label":"최소재고","width":90},
    {"key":"current_stock","label":"현재재고","width":90},
    {"key":"unit","label":"단위","width":60},
    {"key":"location","label":"보관위치","width":120},
    {"key":"supplier","label":"공급업체","width":120},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-560-02','5S 활동 평가 결과','생산관리','560','B','7.1.4','iso9001','starter',590,
'[
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"area","label":"평가 구역","type":"text","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"seiri","label":"정리(20점)","type":"number","width":"half"},
  {"key":"seiton","label":"정돈(20점)","type":"number","width":"half"},
  {"key":"seiso","label":"청소(20점)","type":"number","width":"half"},
  {"key":"seiketsu","label":"청결(20점)","type":"number","width":"half"},
  {"key":"shitsuke","label":"생활화(20점)","type":"number","width":"half"},
  {"key":"total","label":"총점(100점)","type":"number","width":"half"},
  {"key":"grade","label":"등급(S/A/B/C)","type":"select","options":["S","A","B","C"],"width":"half"},
  {"key":"strengths","label":"잘된 점","type":"textarea","width":"full"},
  {"key":"improvements","label":"개선 필요사항","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- 금형·치공구 서식 추가
-- ═══════════════════════════════════════════════════════════════

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-640-01','금형 관리 대장','생산관리','640','B','7.1.3','iso9001','starter',600,
'[
  {"key":"molds","label":"금형 목록","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"mold_number","label":"금형번호","width":120},
    {"key":"mold_name","label":"금형명","width":150},
    {"key":"product","label":"적용제품","width":150},
    {"key":"maker","label":"제작업체","width":120},
    {"key":"made_date","label":"제작일","width":120},
    {"key":"material","label":"재질","width":100},
    {"key":"shot_count","label":"사용쇼트수","width":100},
    {"key":"max_shot","label":"최대쇼트수","width":100},
    {"key":"status","label":"상태","width":80},
    {"key":"location","label":"보관위치","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-640-02','금형 이력 카드','생산관리','640','B','7.1.3','iso9001','starter',610,
'[
  {"key":"mold_number","label":"금형 번호","type":"text","required":true,"width":"half"},
  {"key":"mold_name","label":"금형명","type":"text","required":true,"width":"half"},
  {"key":"product","label":"적용 제품","type":"text","width":"half"},
  {"key":"maker","label":"제작업체","type":"text","width":"half"},
  {"key":"history","label":"금형 이력","type":"table","columns":[
    {"key":"date","label":"일자","width":100},
    {"key":"shot_count","label":"누적쇼트","width":100},
    {"key":"work_type","label":"작업구분","width":120},
    {"key":"content","label":"작업내용","width":250},
    {"key":"technician","label":"작업자","width":100},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-640-03','치공구 관리 대장','생산관리','640','B','7.1.3','iso9001','starter',620,
'[
  {"key":"jigs","label":"치공구 목록","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"jig_number","label":"치공구번호","width":120},
    {"key":"jig_name","label":"치공구명","width":150},
    {"key":"applicable","label":"적용공정","width":150},
    {"key":"maker","label":"제작업체","width":120},
    {"key":"made_date","label":"제작일","width":120},
    {"key":"calibration","label":"교정여부","width":90},
    {"key":"next_cal","label":"차기교정일","width":120},
    {"key":"status","label":"상태","width":80},
    {"key":"location","label":"보관위치","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- IATF 16949 자동차 특화 서식 추가
-- ═══════════════════════════════════════════════════════════════

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AUTO-01','FMEA (고장형태 영향분석)','신제품개발','AUTO','B','8.3','iatf16949','pro',630,
'[
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"process_name","label":"공정명","type":"text","width":"half"},
  {"key":"revision","label":"개정차수","type":"text","width":"half"},
  {"key":"prepared_by","label":"작성자","type":"text","width":"half"},
  {"key":"fmea_items","label":"FMEA 분석","type":"table","columns":[
    {"key":"process_step","label":"공정단계","width":120},
    {"key":"function","label":"기능/요구사항","width":150},
    {"key":"failure_mode","label":"고장형태","width":150},
    {"key":"effect","label":"고장영향","width":150},
    {"key":"severity","label":"심각도(S)","width":80},
    {"key":"cause","label":"고장원인","width":150},
    {"key":"occurrence","label":"발생도(O)","width":80},
    {"key":"current_control","label":"현재관리방법","width":150},
    {"key":"detection","label":"검출도(D)","width":80},
    {"key":"rpn","label":"RPN","width":70},
    {"key":"action","label":"개선조치","width":150},
    {"key":"owner","label":"담당자","width":100},
    {"key":"due_date","label":"완료일","width":100},
    {"key":"new_s","label":"개선후S","width":80},
    {"key":"new_o","label":"개선후O","width":80},
    {"key":"new_d","label":"개선후D","width":80},
    {"key":"new_rpn","label":"개선후RPN","width":90}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AUTO-02','관리계획서 (Control Plan)','신제품개발','AUTO','B','8.5.1','iatf16949','pro',640,
'[
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"part_number","label":"부품번호","type":"text","width":"half"},
  {"key":"customer","label":"고객사","type":"text","width":"half"},
  {"key":"revision","label":"개정차수","type":"text","width":"half"},
  {"key":"plan_type","label":"계획 유형","type":"select","options":["시작품","시작양산","양산"],"width":"half"},
  {"key":"control_items","label":"관리 항목","type":"table","columns":[
    {"key":"process_no","label":"공정번호","width":80},
    {"key":"process_name","label":"공정명","width":120},
    {"key":"characteristic","label":"특성","width":100},
    {"key":"spec","label":"규격/공차","width":150},
    {"key":"measurement","label":"측정방법","width":150},
    {"key":"sample_size","label":"샘플크기","width":90},
    {"key":"frequency","label":"빈도","width":80},
    {"key":"control_method","label":"관리방법","width":150},
    {"key":"reaction_plan","label":"반응계획","width":150}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AUTO-03','특별특성 목록표','신제품개발','AUTO','B','8.3','iatf16949','pro',650,
'[
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"part_number","label":"부품번호","type":"text","width":"half"},
  {"key":"customer","label":"고객사","type":"text","width":"half"},
  {"key":"revision","label":"개정차수","type":"text","width":"half"},
  {"key":"characteristics","label":"특별특성 목록","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"char_type","label":"특성구분(CC/SC)","width":120},
    {"key":"char_name","label":"특성명","width":150},
    {"key":"drawing_no","label":"도면번호","width":120},
    {"key":"spec","label":"규격/공차","width":150},
    {"key":"process","label":"관련공정","width":120},
    {"key":"control_method","label":"관리방법","width":150},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AUTO-04','PPAP 체크리스트','신제품개발','AUTO','B','8.3','iatf16949','pro',660,
'[
  {"key":"part_name","label":"부품명","type":"text","required":true,"width":"half"},
  {"key":"part_number","label":"부품번호","type":"text","required":true,"width":"half"},
  {"key":"customer","label":"고객사","type":"text","required":true,"width":"half"},
  {"key":"submission_level","label":"제출 수준 (1~5)","type":"select","options":["Level 1","Level 2","Level 3","Level 4","Level 5"],"width":"half"},
  {"key":"ppap_items","label":"PPAP 요소 확인","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"element","label":"PPAP 요소","width":250},
    {"key":"required","label":"제출필요","width":90},
    {"key":"completed","label":"완료여부","width":90},
    {"key":"doc_number","label":"문서번호","width":130},
    {"key":"note","label":"비고","width":150}
  ]},
  {"key":"overall_result","label":"종합 결과","type":"select","options":["승인","조건부승인","반려"],"width":"half"},
  {"key":"approval_date","label":"승인일","type":"date","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AUTO-05','Qgate 회의록','신제품개발','AUTO','B','8.3','iatf16949','pro',670,
'[
  {"key":"project_name","label":"과제명","type":"text","required":true,"width":"half"},
  {"key":"gate_stage","label":"Gate 단계","type":"select","options":["Lab단계","Scaleup단계","양산준비"],"required":true,"width":"half"},
  {"key":"meeting_date","label":"회의일","type":"date","required":true,"width":"half"},
  {"key":"chair","label":"회의 주관","type":"text","width":"half"},
  {"key":"attendees","label":"참석자","type":"textarea","width":"full"},
  {"key":"review_items","label":"검토 항목","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"category","label":"구분","width":100},
    {"key":"item","label":"검토 항목","width":200},
    {"key":"result","label":"결과(Pass/Fail/N/A)","width":130},
    {"key":"issue","label":"이슈사항","width":200},
    {"key":"action","label":"조치계획","width":150}
  ]},
  {"key":"gate_result","label":"Gate 결과","type":"select","options":["통과","조건부통과","보류","반려"],"width":"half"},
  {"key":"next_milestone","label":"다음 마일스톤","type":"text","width":"half"},
  {"key":"remarks","label":"특이사항","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AUTO-06','양산 이관 합의서','신제품개발','AUTO','B','8.3','iatf16949','pro',680,
'[
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"part_number","label":"부품번호","type":"text","required":true,"width":"half"},
  {"key":"customer","label":"고객사","type":"text","width":"half"},
  {"key":"transfer_date","label":"이관 예정일","type":"date","required":true,"width":"half"},
  {"key":"dev_team","label":"개발팀","type":"text","width":"half"},
  {"key":"prod_team","label":"양산팀","type":"text","width":"half"},
  {"key":"transfer_items","label":"이관 항목 확인","type":"table","columns":[
    {"key":"category","label":"구분","width":100},
    {"key":"item","label":"이관 항목","width":200},
    {"key":"status","label":"완료여부","width":90},
    {"key":"doc_number","label":"문서번호","width":130},
    {"key":"note","label":"비고","width":150}
  ]},
  {"key":"issues","label":"이관 시 주의사항","type":"textarea","width":"full"},
  {"key":"dev_sign","label":"개발팀 확인","type":"text","width":"half"},
  {"key":"prod_sign","label":"양산팀 확인","type":"text","width":"half"},
  {"key":"approval","label":"승인자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- 건설업 특화 서식 추가
-- ═══════════════════════════════════════════════════════════════

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CON-01','시공 계획서','생산관리','CON','B','8.1','iso9001','starter',690,
'[
  {"key":"project_name","label":"공사명","type":"text","required":true,"width":"full"},
  {"key":"location","label":"공사 위치","type":"text","width":"half"},
  {"key":"client","label":"발주처","type":"text","width":"half"},
  {"key":"start_date","label":"착공일","type":"date","width":"half"},
  {"key":"end_date","label":"준공예정일","type":"date","width":"half"},
  {"key":"manager","label":"현장 책임자","type":"text","width":"half"},
  {"key":"contract_amount","label":"계약금액","type":"text","width":"half"},
  {"key":"scope","label":"공사 범위","type":"textarea","width":"full"},
  {"key":"schedule","label":"공정 계획","type":"table","columns":[
    {"key":"work_item","label":"공종","width":150},
    {"key":"start_date","label":"시작일","width":120},
    {"key":"end_date","label":"완료일","width":120},
    {"key":"ratio","label":"공정비율(%)","width":100},
    {"key":"manager","label":"담당자","width":100},
    {"key":"note","label":"비고","width":120}
  ]},
  {"key":"quality_plan","label":"품질 관리 계획","type":"textarea","width":"full"},
  {"key":"safety_plan","label":"안전 관리 계획","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CON-02','품질 시험 성과표','품질관리','CON','D','8.6','iso9001','starter',700,
'[
  {"key":"project_name","label":"공사명","type":"text","required":true,"width":"full"},
  {"key":"record_month","label":"기록 월","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"tests","label":"시험 성과 기록","type":"table","columns":[
    {"key":"test_date","label":"시험일","width":100},
    {"key":"work_type","label":"공종","width":120},
    {"key":"material","label":"재료/부위","width":150},
    {"key":"test_item","label":"시험항목","width":150},
    {"key":"standard","label":"기준값","width":100},
    {"key":"result","label":"시험결과","width":100},
    {"key":"pass_fail","label":"합부","width":70},
    {"key":"agency","label":"시험기관","width":130},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- 서비스업 특화 서식 추가
-- ═══════════════════════════════════════════════════════════════

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-SVC-01','서비스 제공 기록','생산관리','SVC','B','8.5','iso9001','starter',710,
'[
  {"key":"service_date","label":"서비스 일자","type":"date","required":true,"width":"half"},
  {"key":"customer","label":"고객명","type":"text","required":true,"width":"half"},
  {"key":"service_type","label":"서비스 유형","type":"text","required":true,"width":"half"},
  {"key":"provider","label":"서비스 제공자","type":"text","width":"half"},
  {"key":"content","label":"서비스 내용","type":"textarea","required":true,"width":"full"},
  {"key":"requirements","label":"고객 요구사항","type":"textarea","width":"full"},
  {"key":"result","label":"처리 결과","type":"textarea","width":"full"},
  {"key":"customer_confirm","label":"고객 확인","type":"select","options":["만족","보통","불만족"],"width":"half"},
  {"key":"follow_up","label":"후속 조치","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-SVC-02','고객 불만 처리 기록','고객영업','SVC','B','8.2','iso9001','starter',720,
'[
  {"key":"complaint_number","label":"불만 접수 번호","type":"text","required":true,"width":"half"},
  {"key":"receipt_date","label":"접수일","type":"date","required":true,"width":"half"},
  {"key":"customer","label":"고객명","type":"text","required":true,"width":"half"},
  {"key":"contact","label":"연락처","type":"text","width":"half"},
  {"key":"complaint_type","label":"불만 유형","type":"select","options":["제품불량","납기지연","서비스불만","가격이의","기타"],"width":"half"},
  {"key":"priority","label":"긴급도","type":"select","options":["긴급","일반","낮음"],"width":"half"},
  {"key":"description","label":"불만 내용","type":"textarea","required":true,"width":"full"},
  {"key":"immediate_action","label":"즉각 조치","type":"textarea","width":"full"},
  {"key":"root_cause","label":"원인 분석","type":"textarea","width":"full"},
  {"key":"corrective_action","label":"시정 조치","type":"textarea","width":"full"},
  {"key":"complete_date","label":"처리 완료일","type":"date","width":"half"},
  {"key":"customer_feedback","label":"고객 피드백","type":"textarea","width":"full"},
  {"key":"capa_required","label":"CAPA 발행","type":"select","options":["필요","불필요"],"width":"half"},
  {"key":"handler","label":"처리자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- ISO 9001 추가 서식 (19개)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-130-01','조직 내외부 이슈 분석표','경영관리','130','C','4.1','iso9001','starter',730,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"revision_date","label":"작성일","type":"date","width":"half"},
  {"key":"internal_issues","label":"내부 이슈","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"category","label":"구분","width":100},
    {"key":"issue","label":"이슈 내용","width":250},
    {"key":"impact","label":"영향도","width":80},
    {"key":"action","label":"대응 방향","width":150}
  ]},
  {"key":"external_issues","label":"외부 이슈","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"category","label":"구분","width":100},
    {"key":"issue","label":"이슈 내용","width":250},
    {"key":"impact","label":"영향도","width":80},
    {"key":"action","label":"대응 방향","width":150}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-130-02','이해관계자 요구사항 목록','경영관리','130','C','4.2','iso9001','starter',740,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"parties","label":"이해관계자 목록","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"party","label":"이해관계자","width":150},
    {"key":"needs","label":"요구사항","width":250},
    {"key":"relevance","label":"관련성","width":100},
    {"key":"monitoring","label":"모니터링 방법","width":150},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-110-02','경영방침 목표 전개서','경영관리','110','C','6.2','iso9001','starter',750,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"policy","label":"경영방침","type":"textarea","required":true,"width":"full"},
  {"key":"objectives","label":"품질목표 전개","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"objective","label":"품질목표","width":180},
    {"key":"indicator","label":"성과지표","width":150},
    {"key":"target","label":"목표치","width":100},
    {"key":"responsible","label":"담당부서","width":100},
    {"key":"deadline","label":"달성기한","width":100},
    {"key":"resource","label":"필요자원","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-150-03','직무별 역량 평가서','인사교육','150','B','7.2','iso9001','starter',760,
'[
  {"key":"dept","label":"부서명","type":"text","required":true,"width":"half"},
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"evaluations","label":"역량 평가","type":"table","columns":[
    {"key":"name","label":"성명","width":100},
    {"key":"position","label":"직위","width":80},
    {"key":"task","label":"담당업무","width":150},
    {"key":"education","label":"교육","width":60},
    {"key":"training","label":"훈련","width":60},
    {"key":"experience","label":"경험","width":60},
    {"key":"result","label":"적합여부","width":80},
    {"key":"action","label":"조치사항","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-160-01','내부소통 계획 및 실적','경영관리','160','C','7.4','iso9001','starter',770,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"communications","label":"소통 계획","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"subject","label":"소통 주제","width":180},
    {"key":"method","label":"소통 방법","width":120},
    {"key":"target","label":"대상","width":100},
    {"key":"planned","label":"계획일","width":100},
    {"key":"actual","label":"실시일","width":100},
    {"key":"result","label":"결과","width":120},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-170-03','인프라 관리 계획서','경영관리','170','C','7.1.3','iso9001','starter',780,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"infra_list","label":"인프라 목록","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"name","label":"인프라명","width":180},
    {"key":"type","label":"유형","width":100},
    {"key":"location","label":"위치","width":120},
    {"key":"plan_date","label":"유지보수 계획일","width":120},
    {"key":"actual_date","label":"실시일","width":100},
    {"key":"status","label":"상태","width":80},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-180-04','구매 요청서','구매관리','180','B','8.4','iso9001','starter',790,
'[
  {"key":"request_number","label":"요청번호","type":"text","required":true,"width":"half"},
  {"key":"request_date","label":"요청일","type":"date","required":true,"width":"half"},
  {"key":"requester","label":"요청자","type":"text","required":true,"width":"half"},
  {"key":"dept","label":"부서","type":"text","width":"half"},
  {"key":"need_date","label":"필요일","type":"date","width":"half"},
  {"key":"items","label":"구매 품목","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"item","label":"품명","width":200},
    {"key":"spec","label":"규격","width":150},
    {"key":"qty","label":"수량","width":80},
    {"key":"unit","label":"단위","width":80},
    {"key":"note","label":"비고","width":120}
  ]},
  {"key":"purpose","label":"구매 목적","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-210-01','설계·개발 계획서','설계개발','210','C','8.3.2','iso9001','starter',800,
'[
  {"key":"project","label":"프로젝트명","type":"text","required":true,"width":"half"},
  {"key":"plan_date","label":"계획수립일","type":"date","required":true,"width":"half"},
  {"key":"leader","label":"개발 책임자","type":"text","width":"half"},
  {"key":"start_date","label":"시작일","type":"date","width":"half"},
  {"key":"end_date","label":"완료 목표일","type":"date","width":"half"},
  {"key":"stages","label":"개발 단계","type":"table","columns":[
    {"key":"stage","label":"단계","width":120},
    {"key":"activity","label":"주요 활동","width":200},
    {"key":"responsible","label":"책임자","width":100},
    {"key":"planned","label":"계획일","width":100},
    {"key":"actual","label":"완료일","width":100},
    {"key":"output","label":"산출물","width":150}
  ]},
  {"key":"review_plan","label":"검토·검증·유효성 확인 계획","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-210-02','설계·개발 검토서','설계개발','210','B','8.3.4','iso9001','starter',810,
'[
  {"key":"project","label":"프로젝트명","type":"text","required":true,"width":"half"},
  {"key":"review_date","label":"검토일","type":"date","required":true,"width":"half"},
  {"key":"stage","label":"검토 단계","type":"text","width":"half"},
  {"key":"reviewer","label":"검토자","type":"text","width":"half"},
  {"key":"checklist","label":"검토 항목","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"item","label":"검토 항목","width":250},
    {"key":"result","label":"결과","width":80},
    {"key":"issue","label":"문제점","width":180},
    {"key":"action","label":"조치사항","width":150}
  ]},
  {"key":"conclusion","label":"종합 의견","type":"textarea","width":"full"},
  {"key":"next_stage","label":"다음 단계 진행 여부","type":"select","options":["승인","조건부 승인","재검토"],"width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-220-01','고객 계약 검토서','고객영업','220','B','8.2','iso9001','starter',820,
'[
  {"key":"customer","label":"고객사명","type":"text","required":true,"width":"half"},
  {"key":"review_date","label":"검토일","type":"date","required":true,"width":"half"},
  {"key":"contract_no","label":"계약번호","type":"text","width":"half"},
  {"key":"reviewer","label":"검토자","type":"text","width":"half"},
  {"key":"product","label":"제품/서비스명","type":"text","required":true,"width":"full"},
  {"key":"requirements","label":"요구사항 검토","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"requirement","label":"요구사항","width":250},
    {"key":"feasibility","label":"충족 가능","width":80},
    {"key":"note","label":"비고","width":180}
  ]},
  {"key":"result","label":"계약 검토 결론","type":"select","options":["수주 가능","조건부 가능","수주 불가"],"required":true,"width":"half"},
  {"key":"condition","label":"조건/특이사항","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-310-01','생산 계획서','생산관리','310','C','8.1','iso9001','starter',830,
'[
  {"key":"year_month","label":"계획 월","type":"text","required":true,"width":"half"},
  {"key":"planner","label":"작성자","type":"text","width":"half"},
  {"key":"plan","label":"생산 계획","type":"table","columns":[
    {"key":"product","label":"제품명","width":180},
    {"key":"order_no","label":"수주번호","width":120},
    {"key":"quantity","label":"계획 수량","width":100},
    {"key":"start","label":"착수일","width":100},
    {"key":"end","label":"완료 예정일","width":110},
    {"key":"process","label":"공정","width":100},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-310-02','작업표준서','생산관리','310','B','8.5.1','iso9001','starter',840,
'[
  {"key":"product","label":"제품명/공정명","type":"text","required":true,"width":"half"},
  {"key":"doc_number","label":"문서번호","type":"text","width":"half"},
  {"key":"revision","label":"개정번호","type":"text","width":"half"},
  {"key":"author","label":"작성자","type":"text","width":"half"},
  {"key":"purpose","label":"목적","type":"textarea","width":"full"},
  {"key":"scope","label":"적용범위","type":"textarea","width":"full"},
  {"key":"steps","label":"작업 순서","type":"table","columns":[
    {"key":"step","label":"순서","width":60},
    {"key":"work","label":"작업 내용","width":250},
    {"key":"standard","label":"관리 기준","width":150},
    {"key":"tool","label":"사용 도구","width":120},
    {"key":"caution","label":"주의사항","width":150}
  ]},
  {"key":"safety","label":"안전 주의사항","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-410-01','수입검사 성적서','품질관리','410','B','8.4.3','iso9001','starter',850,
'[
  {"key":"inspection_no","label":"검사번호","type":"text","required":true,"width":"half"},
  {"key":"inspection_date","label":"검사일","type":"date","required":true,"width":"half"},
  {"key":"supplier","label":"공급업체","type":"text","required":true,"width":"half"},
  {"key":"inspector","label":"검사자","type":"text","width":"half"},
  {"key":"items","label":"검사 항목","type":"table","columns":[
    {"key":"item","label":"품명","width":150},
    {"key":"spec","label":"규격","width":120},
    {"key":"lot","label":"LOT번호","width":100},
    {"key":"qty_received","label":"입고 수량","width":90},
    {"key":"qty_inspected","label":"검사 수량","width":90},
    {"key":"qty_defect","label":"불량 수량","width":90},
    {"key":"result","label":"합격/불합격","width":90},
    {"key":"note","label":"비고","width":100}
  ]},
  {"key":"conclusion","label":"종합 판정","type":"select","options":["합격","불합격","조건부 합격"],"required":true,"width":"half"},
  {"key":"action","label":"불합격 조치","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-420-03','공정검사 성적서','품질관리','420','B','8.5.1','iso9001','starter',860,
'[
  {"key":"inspection_no","label":"검사번호","type":"text","required":true,"width":"half"},
  {"key":"inspection_date","label":"검사일","type":"date","required":true,"width":"half"},
  {"key":"product","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"process","label":"공정명","type":"text","width":"half"},
  {"key":"lot","label":"LOT번호","type":"text","width":"half"},
  {"key":"inspector","label":"검사자","type":"text","width":"half"},
  {"key":"items","label":"검사 항목","type":"table","columns":[
    {"key":"item","label":"검사항목","width":180},
    {"key":"spec","label":"규격/기준","width":150},
    {"key":"result","label":"측정값","width":100},
    {"key":"judgement","label":"판정","width":80},
    {"key":"note","label":"비고","width":100}
  ]},
  {"key":"conclusion","label":"공정검사 결과","type":"select","options":["합격","불합격"],"required":true,"width":"half"},
  {"key":"defect_action","label":"불량 조치","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-430-04','최종검사 성적서','품질관리','430','B','8.6','iso9001','starter',870,
'[
  {"key":"inspection_no","label":"검사번호","type":"text","required":true,"width":"half"},
  {"key":"inspection_date","label":"검사일","type":"date","required":true,"width":"half"},
  {"key":"product","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"order_no","label":"수주번호","type":"text","width":"half"},
  {"key":"quantity","label":"검사 수량","type":"number","width":"half"},
  {"key":"inspector","label":"검사자","type":"text","width":"half"},
  {"key":"items","label":"검사 항목","type":"table","columns":[
    {"key":"item","label":"검사항목","width":180},
    {"key":"standard","label":"판정기준","width":150},
    {"key":"result","label":"측정/확인결과","width":130},
    {"key":"judgement","label":"판정","width":80},
    {"key":"note","label":"비고","width":100}
  ]},
  {"key":"conclusion","label":"최종 판정","type":"select","options":["합격","불합격"],"required":true,"width":"half"},
  {"key":"release_auth","label":"불출 승인자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-510-03','측정장비 교정 대장','설비계측','510','C','7.1.5','iso9001','starter',880,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"equipments","label":"교정 대상 장비","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"name","label":"장비명","width":150},
    {"key":"model","label":"모델/시리얼","width":150},
    {"key":"range","label":"측정범위","width":100},
    {"key":"accuracy","label":"정확도","width":80},
    {"key":"last_cal","label":"최근 교정일","width":110},
    {"key":"next_cal","label":"차기 교정일","width":110},
    {"key":"agency","label":"교정기관","width":120},
    {"key":"cert_no","label":"성적서번호","width":110},
    {"key":"result","label":"판정","width":80}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-510-04','설비 예방보전 계획서','설비계측','510','C','7.1.3','iso9001','starter',890,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"dept","label":"담당부서","type":"text","width":"half"},
  {"key":"plan","label":"예방보전 계획","type":"table","columns":[
    {"key":"equipment","label":"설비명","width":150},
    {"key":"asset_no","label":"자산번호","width":100},
    {"key":"activity","label":"보전 활동","width":180},
    {"key":"cycle","label":"주기","width":80},
    {"key":"jan","label":"1월","width":50},
    {"key":"feb","label":"2월","width":50},
    {"key":"mar","label":"3월","width":50},
    {"key":"apr","label":"4월","width":50},
    {"key":"may","label":"5월","width":50},
    {"key":"jun","label":"6월","width":50},
    {"key":"jul","label":"7월","width":50},
    {"key":"aug","label":"8월","width":50},
    {"key":"sep","label":"9월","width":50},
    {"key":"oct","label":"10월","width":50},
    {"key":"nov","label":"11월","width":50},
    {"key":"dec","label":"12월","width":50}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-510-05','설비 고장 수리 기록','설비계측','510','B','7.1.3','iso9001','starter',900,
'[
  {"key":"report_no","label":"보고번호","type":"text","required":true,"width":"half"},
  {"key":"report_date","label":"발생일","type":"date","required":true,"width":"half"},
  {"key":"equipment","label":"설비명","type":"text","required":true,"width":"half"},
  {"key":"asset_no","label":"자산번호","type":"text","width":"half"},
  {"key":"symptom","label":"고장 증상","type":"textarea","required":true,"width":"full"},
  {"key":"cause","label":"고장 원인","type":"textarea","width":"full"},
  {"key":"action","label":"수리 조치 내용","type":"textarea","width":"full"},
  {"key":"parts","label":"교체 부품","type":"text","width":"half"},
  {"key":"repair_date","label":"수리 완료일","type":"date","width":"half"},
  {"key":"repairer","label":"수리자","type":"text","width":"half"},
  {"key":"downtime","label":"가동 중단 시간(h)","type":"number","width":"half"},
  {"key":"recurrence","label":"재발 방지 대책","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-510-06','외주가공 작업지시서','생산관리','510','B','8.5.4','iso9001','starter',910,
'[
  {"key":"order_no","label":"지시번호","type":"text","required":true,"width":"half"},
  {"key":"order_date","label":"지시일","type":"date","required":true,"width":"half"},
  {"key":"vendor","label":"외주업체","type":"text","required":true,"width":"half"},
  {"key":"due_date","label":"납기일","type":"date","required":true,"width":"half"},
  {"key":"items","label":"작업 지시 품목","type":"table","columns":[
    {"key":"product","label":"품명","width":180},
    {"key":"drawing_no","label":"도면번호","width":120},
    {"key":"qty","label":"수량","width":80},
    {"key":"spec","label":"작업 규격","width":180},
    {"key":"note","label":"특기사항","width":150}
  ]},
  {"key":"quality_req","label":"품질 요구사항","type":"textarea","width":"full"},
  {"key":"issuer","label":"발행자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- ISO 14001 추가 서식 (9개)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-820-08','환경목표 달성 계획서','환경관리','820','C','6.2','iso14001','starter',920,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"author","label":"작성자","type":"text","width":"half"},
  {"key":"objectives","label":"환경목표 계획","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"aspect","label":"환경측면","width":150},
    {"key":"objective","label":"환경목표","width":180},
    {"key":"indicator","label":"지표","width":120},
    {"key":"target","label":"목표치","width":100},
    {"key":"action","label":"실행계획","width":180},
    {"key":"responsible","label":"담당자","width":100},
    {"key":"deadline","label":"기한","width":90},
    {"key":"resource","label":"자원","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-820-09','환경 모니터링 기록','환경관리','820','B','9.1','iso14001','starter',930,
'[
  {"key":"monitoring_date","label":"모니터링 일자","type":"date","required":true,"width":"half"},
  {"key":"monitor","label":"모니터링 담당자","type":"text","width":"half"},
  {"key":"records","label":"모니터링 항목","type":"table","columns":[
    {"key":"item","label":"모니터링 항목","width":200},
    {"key":"standard","label":"기준","width":120},
    {"key":"measured","label":"측정값","width":100},
    {"key":"unit","label":"단위","width":70},
    {"key":"judgement","label":"적합여부","width":80},
    {"key":"action","label":"조치사항","width":150}
  ]},
  {"key":"overall","label":"종합 의견","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-820-10','환경측면 평가 결과표','환경관리','820','C','6.1.2','iso14001','starter',940,
'[
  {"key":"year","label":"평가 연도","type":"text","required":true,"width":"half"},
  {"key":"team","label":"평가팀","type":"text","width":"half"},
  {"key":"aspects","label":"환경측면 평가","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"activity","label":"활동/제품/서비스","width":180},
    {"key":"aspect","label":"환경측면","width":150},
    {"key":"impact","label":"환경영향","width":150},
    {"key":"scale","label":"규모","width":60},
    {"key":"frequency","label":"빈도","width":60},
    {"key":"severity","label":"심각도","width":70},
    {"key":"score","label":"점수","width":60},
    {"key":"significant","label":"유의성","width":70},
    {"key":"control","label":"관리방안","width":150}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-820-11','환경 비상사태 훈련 기록','환경관리','820','B','8.2','iso14001','starter',950,
'[
  {"key":"drill_date","label":"훈련일","type":"date","required":true,"width":"half"},
  {"key":"scenario","label":"훈련 시나리오","type":"text","required":true,"width":"half"},
  {"key":"leader","label":"훈련 책임자","type":"text","width":"half"},
  {"key":"participants","label":"참가 인원","type":"number","width":"half"},
  {"key":"procedure","label":"훈련 절차 및 내용","type":"textarea","required":true,"width":"full"},
  {"key":"result","label":"훈련 결과","type":"textarea","width":"full"},
  {"key":"issues","label":"발견 문제점","type":"textarea","width":"full"},
  {"key":"improvements","label":"개선 조치","type":"textarea","width":"full"},
  {"key":"next_drill","label":"차기 훈련 계획일","type":"date","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-820-12','환경법규 준수 평가서','환경관리','820','C','9.1.2','iso14001','starter',960,
'[
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"evaluations","label":"법규 준수 평가","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"law","label":"법규/규정명","width":200},
    {"key":"requirement","label":"요구사항","width":200},
    {"key":"compliance","label":"준수 여부","width":80},
    {"key":"evidence","label":"증거","width":150},
    {"key":"action","label":"미준수 조치","width":150}
  ]},
  {"key":"conclusion","label":"전반적 준수 상태","type":"select","options":["준수","일부 미준수","미준수"],"required":true,"width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-820-13','폐기물 처리 대장','환경관리','820','C','8.1','iso14001','starter',970,
'[
  {"key":"year_month","label":"기록 월","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"관리 담당자","type":"text","width":"half"},
  {"key":"records","label":"폐기물 처리 현황","type":"table","columns":[
    {"key":"date","label":"처리일","width":100},
    {"key":"type","label":"폐기물 종류","width":150},
    {"key":"amount","label":"발생량","width":90},
    {"key":"unit","label":"단위","width":70},
    {"key":"method","label":"처리방법","width":120},
    {"key":"company","label":"처리업체","width":120},
    {"key":"manifest","label":"인계서번호","width":110},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-820-14','화학물질 관리대장','환경관리','820','C','8.1','iso14001','starter',980,
'[
  {"key":"revision_date","label":"갱신일","type":"date","required":true,"width":"half"},
  {"key":"manager","label":"관리 책임자","type":"text","width":"half"},
  {"key":"chemicals","label":"화학물질 목록","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"name","label":"물질명(상품명)","width":180},
    {"key":"cas","label":"CAS번호","width":110},
    {"key":"hazard","label":"유해·위험성","width":120},
    {"key":"storage","label":"보관 장소","width":100},
    {"key":"amount","label":"보유량","width":80},
    {"key":"unit","label":"단위","width":70},
    {"key":"sds","label":"MSDS 보유","width":80},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-820-15','환경 내부심사 체크리스트','환경관리','820','C','9.2','iso14001','starter',990,
'[
  {"key":"audit_date","label":"심사일","type":"date","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","width":"half"},
  {"key":"target","label":"심사 대상 부서","type":"text","width":"half"},
  {"key":"checklist","label":"심사 항목","type":"table","columns":[
    {"key":"clause","label":"조항","width":80},
    {"key":"requirement","label":"심사 요구사항","width":250},
    {"key":"result","label":"결과","width":80},
    {"key":"evidence","label":"객관적 증거","width":200},
    {"key":"finding","label":"발견사항","width":150}
  ]},
  {"key":"nc_count","label":"부적합 건수","type":"number","width":"half"},
  {"key":"obs_count","label":"관찰사항 건수","type":"number","width":"half"},
  {"key":"summary","label":"심사 총평","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-820-16','환경 성과 보고서','환경관리','820','C','9.1','iso14001','starter',1000,
'[
  {"key":"period","label":"보고 기간","type":"text","required":true,"width":"half"},
  {"key":"author","label":"작성자","type":"text","width":"half"},
  {"key":"kpis","label":"환경 성과 지표","type":"table","columns":[
    {"key":"indicator","label":"성과지표","width":180},
    {"key":"unit","label":"단위","width":70},
    {"key":"baseline","label":"기준값","width":90},
    {"key":"target","label":"목표","width":90},
    {"key":"actual","label":"실적","width":90},
    {"key":"achievement","label":"달성률","width":90},
    {"key":"note","label":"비고","width":120}
  ]},
  {"key":"summary","label":"성과 분석 및 종합 의견","type":"textarea","width":"full"},
  {"key":"improvement","label":"개선 계획","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- ISO 45001 추가 서식 (12개)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-830-01','위험성평가 실시계획서','안전보건','830','C','6.1.2','iso45001','starter',1010,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"planner","label":"계획 수립자","type":"text","width":"half"},
  {"key":"plan","label":"위험성평가 계획","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"target","label":"평가 대상","width":200},
    {"key":"method","label":"평가 방법","width":150},
    {"key":"planned_date","label":"계획일","width":100},
    {"key":"actual_date","label":"실시일","width":100},
    {"key":"team","label":"평가팀","width":150},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-830-02','위험성평가 결과서','안전보건','830','C','6.1.2','iso45001','starter',1020,
'[
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"process","label":"공정/작업명","type":"text","required":true,"width":"half"},
  {"key":"team","label":"평가팀","type":"text","width":"half"},
  {"key":"hazards","label":"위험요인 평가","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"activity","label":"작업 내용","width":180},
    {"key":"hazard","label":"위험요인","width":180},
    {"key":"risk","label":"잠재위험","width":150},
    {"key":"likelihood","label":"가능성","width":70},
    {"key":"severity","label":"심각도","width":70},
    {"key":"risk_level","label":"위험등급","width":80},
    {"key":"control","label":"개선 대책","width":180},
    {"key":"residual","label":"잔류위험","width":80}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-830-03','안전보건 목표 관리표','안전보건','830','C','6.2','iso45001','starter',1030,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"author","label":"작성자","type":"text","width":"half"},
  {"key":"objectives","label":"안전보건 목표","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"objective","label":"목표","width":200},
    {"key":"indicator","label":"성과지표","width":150},
    {"key":"target","label":"목표치","width":90},
    {"key":"action","label":"실행계획","width":180},
    {"key":"responsible","label":"담당자","width":100},
    {"key":"deadline","label":"기한","width":90},
    {"key":"actual","label":"실적","width":90},
    {"key":"achievement","label":"달성률","width":80}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-830-04','안전점검 체크리스트','안전보건','830','C','8.1','iso45001','starter',1040,
'[
  {"key":"inspection_date","label":"점검일","type":"date","required":true,"width":"half"},
  {"key":"inspector","label":"점검자","type":"text","required":true,"width":"half"},
  {"key":"location","label":"점검 장소","type":"text","width":"half"},
  {"key":"checklist","label":"점검 항목","type":"table","columns":[
    {"key":"category","label":"구분","width":100},
    {"key":"item","label":"점검 항목","width":250},
    {"key":"standard","label":"기준","width":150},
    {"key":"result","label":"양호/불량/해당없음","width":120},
    {"key":"action","label":"조치사항","width":150}
  ]},
  {"key":"overall","label":"종합 의견","type":"textarea","width":"full"},
  {"key":"risk_level","label":"전체 위험수준","type":"select","options":["양호","주의","위험"],"width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-830-05','작업허가서','안전보건','830','B','8.1.3','iso45001','starter',1050,
'[
  {"key":"permit_no","label":"허가번호","type":"text","required":true,"width":"half"},
  {"key":"permit_date","label":"작업일","type":"date","required":true,"width":"half"},
  {"key":"work_type","label":"작업 유형","type":"select","options":["화기작업","고소작업","밀폐공간","전기작업","굴착작업","기타"],"required":true,"width":"half"},
  {"key":"location","label":"작업 장소","type":"text","required":true,"width":"half"},
  {"key":"start_time","label":"작업 시작시간","type":"text","width":"half"},
  {"key":"end_time","label":"작업 종료시간","type":"text","width":"half"},
  {"key":"contractor","label":"작업자(업체)","type":"text","width":"half"},
  {"key":"supervisor","label":"감독자","type":"text","width":"half"},
  {"key":"work_content","label":"작업 내용","type":"textarea","required":true,"width":"full"},
  {"key":"hazards","label":"위험요인","type":"textarea","width":"full"},
  {"key":"precautions","label":"안전 조치 사항","type":"textarea","width":"full"},
  {"key":"ppe","label":"필요 보호구","type":"text","width":"full"},
  {"key":"issuer","label":"허가 발행자","type":"text","required":true,"width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-830-06','근로자 안전교육 확인서','안전보건','830','B','7.2','iso45001','starter',1060,
'[
  {"key":"training_date","label":"교육일","type":"date","required":true,"width":"half"},
  {"key":"trainer","label":"강사","type":"text","required":true,"width":"half"},
  {"key":"topic","label":"교육 주제","type":"text","required":true,"width":"full"},
  {"key":"duration","label":"교육 시간(h)","type":"number","width":"half"},
  {"key":"method","label":"교육 방법","type":"select","options":["집합교육","OJT","온라인","기타"],"width":"half"},
  {"key":"content","label":"교육 내용 요약","type":"textarea","width":"full"},
  {"key":"attendees","label":"교육 참석자","type":"table","columns":[
    {"key":"name","label":"성명","width":100},
    {"key":"dept","label":"부서","width":100},
    {"key":"position","label":"직위","width":80},
    {"key":"signature","label":"서명","width":80}
  ]},
  {"key":"eval","label":"교육 평가 방법","type":"text","width":"half"},
  {"key":"eval_result","label":"평가 결과","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-830-07','아차사고 보고서','안전보건','830','B','10.2','iso45001','starter',1070,
'[
  {"key":"report_no","label":"보고번호","type":"text","required":true,"width":"half"},
  {"key":"occurrence_date","label":"발생일시","type":"date","required":true,"width":"half"},
  {"key":"location","label":"발생 장소","type":"text","required":true,"width":"half"},
  {"key":"reporter","label":"보고자","type":"text","required":true,"width":"half"},
  {"key":"description","label":"아차사고 내용","type":"textarea","required":true,"width":"full"},
  {"key":"potential_harm","label":"잠재 피해 내용","type":"textarea","width":"full"},
  {"key":"immediate_action","label":"즉각 조치","type":"textarea","width":"full"},
  {"key":"cause","label":"원인 분석","type":"textarea","width":"full"},
  {"key":"prevention","label":"재발 방지 대책","type":"textarea","width":"full"},
  {"key":"responsible","label":"조치 담당자","type":"text","width":"half"},
  {"key":"due_date","label":"조치 완료일","type":"date","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-830-08','산업재해 보고서','안전보건','830','B','9.1.1','iso45001','starter',1080,
'[
  {"key":"report_no","label":"보고번호","type":"text","required":true,"width":"half"},
  {"key":"accident_date","label":"재해 발생일시","type":"date","required":true,"width":"half"},
  {"key":"location","label":"발생 장소","type":"text","required":true,"width":"half"},
  {"key":"victim","label":"재해자 성명","type":"text","required":true,"width":"half"},
  {"key":"dept","label":"소속 부서","type":"text","width":"half"},
  {"key":"experience","label":"근속 기간","type":"text","width":"half"},
  {"key":"accident_type","label":"재해 유형","type":"select","options":["사망","부상","질병","위험발생"],"required":true,"width":"half"},
  {"key":"injury_type","label":"상해 유형","type":"text","width":"half"},
  {"key":"description","label":"재해 경위","type":"textarea","required":true,"width":"full"},
  {"key":"direct_cause","label":"직접 원인","type":"textarea","width":"full"},
  {"key":"indirect_cause","label":"간접 원인","type":"textarea","width":"full"},
  {"key":"lost_days","label":"휴업 일수","type":"number","width":"half"},
  {"key":"treatment","label":"의료 처치","type":"textarea","width":"full"},
  {"key":"capa","label":"시정조치 계획","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-830-09','안전보건 순찰 기록','안전보건','830','C','9.1','iso45001','starter',1090,
'[
  {"key":"patrol_date","label":"순찰일","type":"date","required":true,"width":"half"},
  {"key":"patroller","label":"순찰자","type":"text","required":true,"width":"half"},
  {"key":"route","label":"순찰 구역","type":"text","width":"full"},
  {"key":"findings","label":"순찰 결과","type":"table","columns":[
    {"key":"location","label":"위치","width":120},
    {"key":"item","label":"점검 내용","width":200},
    {"key":"status","label":"현황","width":80},
    {"key":"risk","label":"위험도","width":80},
    {"key":"action","label":"필요 조치","width":180},
    {"key":"due","label":"완료 기한","width":90}
  ]},
  {"key":"immediate_actions","label":"즉시 조치 사항","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-830-10','개인보호구 지급 대장','안전보건','830','C','8.1.2','iso45001','starter',1100,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"관리 담당자","type":"text","width":"half"},
  {"key":"records","label":"지급 현황","type":"table","columns":[
    {"key":"date","label":"지급일","width":100},
    {"key":"recipient","label":"수령자","width":100},
    {"key":"dept","label":"부서","width":100},
    {"key":"ppe_type","label":"보호구 종류","width":150},
    {"key":"qty","label":"수량","width":70},
    {"key":"reason","label":"지급 사유","width":150},
    {"key":"signature","label":"수령 확인","width":80},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-830-11','안전보건 법규 준수 평가서','안전보건','830','C','9.1.2','iso45001','starter',1110,
'[
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"evaluations","label":"법규 준수 평가","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"law","label":"법규명","width":200},
    {"key":"requirement","label":"주요 요구사항","width":220},
    {"key":"compliance","label":"준수 여부","width":80},
    {"key":"evidence","label":"준수 증거","width":150},
    {"key":"action","label":"조치사항","width":150}
  ]},
  {"key":"result","label":"준수 평가 결론","type":"select","options":["준수","일부 미준수","미준수"],"required":true,"width":"half"},
  {"key":"improvement","label":"개선 계획","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-830-12','도급작업 안전관리 기록','안전보건','830','C','8.1.4','iso45001','starter',1120,
'[
  {"key":"contract_no","label":"계약번호","type":"text","required":true,"width":"half"},
  {"key":"contractor","label":"도급업체","type":"text","required":true,"width":"half"},
  {"key":"work_content","label":"작업 내용","type":"text","required":true,"width":"full"},
  {"key":"work_period","label":"작업 기간","type":"text","width":"half"},
  {"key":"manager","label":"원청 관리감독자","type":"text","width":"half"},
  {"key":"pre_checks","label":"작업 전 안전점검","type":"table","columns":[
    {"key":"date","label":"점검일","width":100},
    {"key":"item","label":"점검 항목","width":220},
    {"key":"result","label":"결과","width":80},
    {"key":"action","label":"조치","width":150}
  ]},
  {"key":"incidents","label":"안전사고 발생 현황","type":"textarea","width":"full"},
  {"key":"evaluation","label":"도급업체 안전평가 결과","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- 공통 서식 (4개)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CMN-01','회의록','경영관리','CMN','B','7.4','iso9001','starter',1130,
'[
  {"key":"meeting_date","label":"회의일","type":"date","required":true,"width":"half"},
  {"key":"location","label":"회의 장소","type":"text","width":"half"},
  {"key":"title","label":"회의 제목","type":"text","required":true,"width":"full"},
  {"key":"facilitator","label":"진행자","type":"text","width":"half"},
  {"key":"recorder","label":"기록자","type":"text","width":"half"},
  {"key":"attendees","label":"참석자","type":"text","width":"full"},
  {"key":"agenda","label":"안건","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"topic","label":"안건","width":250},
    {"key":"presenter","label":"발표자","width":100},
    {"key":"content","label":"내용 요약","width":300},
    {"key":"decision","label":"결정 사항","width":200}
  ]},
  {"key":"action_items","label":"후속 조치","type":"table","columns":[
    {"key":"action","label":"조치 사항","width":300},
    {"key":"responsible","label":"담당자","width":100},
    {"key":"due","label":"완료 기한","width":100}
  ]},
  {"key":"next_meeting","label":"차기 회의 일정","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CMN-02','문서 배포 확인서','경영관리','CMN','B','7.5','iso9001','starter',1140,
'[
  {"key":"doc_number","label":"문서번호","type":"text","required":true,"width":"half"},
  {"key":"doc_name","label":"문서명","type":"text","required":true,"width":"half"},
  {"key":"version","label":"버전","type":"text","width":"half"},
  {"key":"issue_date","label":"발행일","type":"date","required":true,"width":"half"},
  {"key":"issued_by","label":"배포자","type":"text","width":"half"},
  {"key":"distributions","label":"배포 현황","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"recipient","label":"수령자","width":120},
    {"key":"dept","label":"부서","width":120},
    {"key":"copy_no","label":"사본번호","width":90},
    {"key":"date","label":"수령일","width":100},
    {"key":"signature","label":"서명","width":80},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CMN-03','시정조치 요청서','품질관리','CMN','B','10.2','iso9001','starter',1150,
'[
  {"key":"car_no","label":"요청번호","type":"text","required":true,"width":"half"},
  {"key":"issue_date","label":"발행일","type":"date","required":true,"width":"half"},
  {"key":"issuer","label":"발행자","type":"text","required":true,"width":"half"},
  {"key":"recipient","label":"수신 부서","type":"text","required":true,"width":"half"},
  {"key":"due_date","label":"회신 기한","type":"date","required":true,"width":"half"},
  {"key":"nc_type","label":"부적합 유형","type":"select","options":["제품 부적합","프로세스 부적합","시스템 부적합","고객 불만"],"width":"half"},
  {"key":"description","label":"부적합 내용","type":"textarea","required":true,"width":"full"},
  {"key":"immediate_action","label":"즉각 조치","type":"textarea","width":"full"},
  {"key":"root_cause","label":"근본원인","type":"textarea","width":"full"},
  {"key":"corrective_action","label":"시정조치 계획","type":"textarea","width":"full"},
  {"key":"action_date","label":"조치 완료일","type":"date","width":"half"},
  {"key":"effectiveness","label":"효과성 검증","type":"textarea","width":"full"},
  {"key":"close_date","label":"종결일","type":"date","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CMN-04','개선 제안서','경영관리','CMN','B','10.3','iso9001','starter',1160,
'[
  {"key":"proposal_no","label":"제안번호","type":"text","required":true,"width":"half"},
  {"key":"proposal_date","label":"제안일","type":"date","required":true,"width":"half"},
  {"key":"proposer","label":"제안자","type":"text","required":true,"width":"half"},
  {"key":"dept","label":"부서","type":"text","width":"half"},
  {"key":"category","label":"개선 분야","type":"select","options":["품질","생산성","안전","환경","비용","기타"],"required":true,"width":"half"},
  {"key":"current_state","label":"현재 상태(문제점)","type":"textarea","required":true,"width":"full"},
  {"key":"proposal","label":"개선 제안 내용","type":"textarea","required":true,"width":"full"},
  {"key":"expected_effect","label":"기대 효과","type":"textarea","width":"full"},
  {"key":"review_result","label":"검토 결과","type":"select","options":["채택","조건부 채택","보류","불채택"],"width":"half"},
  {"key":"review_comment","label":"검토 의견","type":"textarea","width":"full"},
  {"key":"impl_date","label":"시행 예정일","type":"date","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- ISO 50001 에너지경영 서식 (8개)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-EnMS-01','에너지 검토 보고서','에너지관리','EnMS','C','6.3','iso50001','starter',1170,
'[
  {"key":"year","label":"검토 연도","type":"text","required":true,"width":"half"},
  {"key":"reviewer","label":"검토자","type":"text","width":"half"},
  {"key":"energy_sources","label":"에너지원 현황","type":"table","columns":[
    {"key":"source","label":"에너지원","width":120},
    {"key":"unit","label":"단위","width":70},
    {"key":"prev_year","label":"전년 사용량","width":110},
    {"key":"curr_year","label":"당년 사용량","width":110},
    {"key":"change","label":"증감률(%)","width":90},
    {"key":"cost","label":"비용(천원)","width":100},
    {"key":"note","label":"비고","width":120}
  ]},
  {"key":"seu_list","label":"주요에너지사용처(SEU)","type":"textarea","width":"full"},
  {"key":"improvement_opp","label":"에너지 개선 기회","type":"textarea","width":"full"},
  {"key":"priorities","label":"우선순위 및 계획","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-EnMS-02','에너지 기준선 설정서','에너지관리','EnMS','C','6.4','iso50001','starter',1180,
'[
  {"key":"set_date","label":"설정일","type":"date","required":true,"width":"half"},
  {"key":"author","label":"작성자","type":"text","width":"half"},
  {"key":"baseline_period","label":"기준 기간","type":"text","required":true,"width":"half"},
  {"key":"energy_source","label":"에너지원","type":"text","required":true,"width":"half"},
  {"key":"baselines","label":"기준선 데이터","type":"table","columns":[
    {"key":"period","label":"기간","width":100},
    {"key":"consumption","label":"사용량","width":100},
    {"key":"unit","label":"단위","width":70},
    {"key":"relevant_var","label":"관련 변수","width":150},
    {"key":"normalized","label":"정규화값","width":100},
    {"key":"note","label":"비고","width":100}
  ]},
  {"key":"methodology","label":"기준선 산정 방법론","type":"textarea","width":"full"},
  {"key":"revision_condition","label":"기준선 갱신 조건","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-EnMS-03','에너지성과지표 관리표','에너지관리','EnMS','C','6.4','iso50001','starter',1190,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"author","label":"작성자","type":"text","width":"half"},
  {"key":"enpis","label":"에너지성과지표(EnPI)","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"enpi","label":"성과지표명","width":180},
    {"key":"formula","label":"산출 공식","width":180},
    {"key":"unit","label":"단위","width":70},
    {"key":"baseline","label":"기준선","width":90},
    {"key":"target","label":"목표","width":90},
    {"key":"q1","label":"1분기","width":80},
    {"key":"q2","label":"2분기","width":80},
    {"key":"q3","label":"3분기","width":80},
    {"key":"q4","label":"4분기","width":80},
    {"key":"annual","label":"연간실적","width":90}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-EnMS-04','에너지 목표 및 실행계획','에너지관리','EnMS','C','6.2','iso50001','starter',1200,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"author","label":"작성자","type":"text","width":"half"},
  {"key":"policy","label":"에너지방침 연계","type":"textarea","width":"full"},
  {"key":"objectives","label":"에너지 목표 및 실행계획","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"objective","label":"목표","width":200},
    {"key":"indicator","label":"성과지표","width":150},
    {"key":"target","label":"목표치","width":90},
    {"key":"action","label":"실행계획","width":200},
    {"key":"resource","label":"소요자원","width":120},
    {"key":"responsible","label":"담당자","width":100},
    {"key":"deadline","label":"기한","width":90},
    {"key":"result","label":"실적","width":90}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-EnMS-05','에너지 모니터링 계획서','에너지관리','EnMS','C','9.1','iso50001','starter',1210,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"author","label":"작성자","type":"text","width":"half"},
  {"key":"monitoring_plan","label":"모니터링 계획","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"target","label":"모니터링 대상","width":180},
    {"key":"parameter","label":"측정 파라미터","width":150},
    {"key":"method","label":"측정 방법","width":150},
    {"key":"frequency","label":"측정 주기","width":90},
    {"key":"responsible","label":"담당자","width":100},
    {"key":"recording","label":"기록 방법","width":120},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-EnMS-06','에너지 사용 분석서','에너지관리','EnMS','C','6.3','iso50001','starter',1220,
'[
  {"key":"analysis_period","label":"분석 기간","type":"text","required":true,"width":"half"},
  {"key":"analyst","label":"분석자","type":"text","width":"half"},
  {"key":"monthly_data","label":"에너지 사용량 월별 현황","type":"table","columns":[
    {"key":"month","label":"월","width":60},
    {"key":"electricity","label":"전력(kWh)","width":100},
    {"key":"gas","label":"도시가스(Nm³)","width":110},
    {"key":"other","label":"기타","width":90},
    {"key":"total_toe","label":"합계(TOE)","width":100},
    {"key":"production","label":"생산량","width":90},
    {"key":"intensity","label":"에너지원단위","width":110}
  ]},
  {"key":"significant_changes","label":"주요 변동 사항","type":"textarea","width":"full"},
  {"key":"improvement_opp","label":"절감 기회 사항","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-EnMS-07','에너지 절감 활동 기록','에너지관리','EnMS','B','8.1','iso50001','starter',1230,
'[
  {"key":"activity_no","label":"활동번호","type":"text","required":true,"width":"half"},
  {"key":"start_date","label":"시작일","type":"date","required":true,"width":"half"},
  {"key":"activity","label":"절감 활동명","type":"text","required":true,"width":"full"},
  {"key":"target_facility","label":"대상 설비/공정","type":"text","width":"half"},
  {"key":"responsible","label":"담당자","type":"text","width":"half"},
  {"key":"method","label":"절감 방법","type":"textarea","width":"full"},
  {"key":"expected_saving","label":"예상 절감량","type":"text","width":"half"},
  {"key":"investment","label":"투자비용","type":"text","width":"half"},
  {"key":"before_value","label":"개선 전 에너지 사용","type":"text","width":"half"},
  {"key":"after_value","label":"개선 후 에너지 사용","type":"text","width":"half"},
  {"key":"actual_saving","label":"실제 절감량","type":"text","width":"half"},
  {"key":"payback","label":"투자회수기간","type":"text","width":"half"},
  {"key":"note","label":"비고","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-EnMS-08','에너지 내부심사 체크리스트','에너지관리','EnMS','C','9.2','iso50001','starter',1240,
'[
  {"key":"audit_date","label":"심사일","type":"date","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","width":"half"},
  {"key":"target","label":"심사 대상","type":"text","width":"half"},
  {"key":"checklist","label":"심사 항목","type":"table","columns":[
    {"key":"clause","label":"조항","width":80},
    {"key":"requirement","label":"심사 요구사항","width":260},
    {"key":"result","label":"결과","width":80},
    {"key":"evidence","label":"객관적 증거","width":200},
    {"key":"finding","label":"발견사항","width":150}
  ]},
  {"key":"nc_count","label":"부적합 건수","type":"number","width":"half"},
  {"key":"obs_count","label":"관찰사항 건수","type":"number","width":"half"},
  {"key":"summary","label":"심사 총평","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- ISO 37001 반부패경영 서식 (8개)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ABMS-01','뇌물리스크 평가서','반부패관리','ABMS','C','4.5','iso37001','starter',1250,
'[
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"risks","label":"뇌물리스크 평가","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"activity","label":"비즈니스 활동","width":180},
    {"key":"risk","label":"뇌물 리스크","width":200},
    {"key":"likelihood","label":"가능성(1-5)","width":90},
    {"key":"impact","label":"영향도(1-5)","width":90},
    {"key":"score","label":"위험점수","width":80},
    {"key":"level","label":"위험등급","width":80},
    {"key":"control","label":"통제 방안","width":180}
  ]},
  {"key":"summary","label":"평가 종합 의견","type":"textarea","width":"full"},
  {"key":"high_risk_actions","label":"고위험 항목 조치 계획","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ABMS-02','선물·접대 신고서','반부패관리','ABMS','B','8.7','iso37001','starter',1260,
'[
  {"key":"report_no","label":"신고번호","type":"text","required":true,"width":"half"},
  {"key":"report_date","label":"신고일","type":"date","required":true,"width":"half"},
  {"key":"reporter","label":"신고자","type":"text","required":true,"width":"half"},
  {"key":"dept","label":"소속 부서","type":"text","width":"half"},
  {"key":"type","label":"신고 유형","type":"select","options":["선물수령","선물제공","접대수수","접대제공","기부","기타"],"required":true,"width":"half"},
  {"key":"counterpart","label":"상대방(업체/인물)","type":"text","required":true,"width":"half"},
  {"key":"occurrence_date","label":"발생일","type":"date","required":true,"width":"half"},
  {"key":"value","label":"금액/가치(원)","type":"number","width":"half"},
  {"key":"description","label":"내용 상세","type":"textarea","required":true,"width":"full"},
  {"key":"business_purpose","label":"업무 연관성","type":"textarea","width":"full"},
  {"key":"action","label":"조치 사항","type":"select","options":["신고완료","반환","승인필요","추가검토"],"width":"half"},
  {"key":"reviewer","label":"검토자","type":"text","width":"half"},
  {"key":"approval","label":"승인여부","type":"select","options":["승인","불승인","조건부승인"],"width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ABMS-03','반부패 교육 실시 기록','반부패관리','ABMS','B','7.2','iso37001','starter',1270,
'[
  {"key":"training_date","label":"교육일","type":"date","required":true,"width":"half"},
  {"key":"trainer","label":"강사","type":"text","required":true,"width":"half"},
  {"key":"topic","label":"교육 주제","type":"text","required":true,"width":"full"},
  {"key":"duration","label":"교육 시간(h)","type":"number","width":"half"},
  {"key":"target","label":"교육 대상","type":"text","width":"half"},
  {"key":"content","label":"교육 내용 요약","type":"textarea","width":"full"},
  {"key":"attendees","label":"참석자 명단","type":"table","columns":[
    {"key":"name","label":"성명","width":100},
    {"key":"dept","label":"부서","width":100},
    {"key":"position","label":"직위","width":80},
    {"key":"signature","label":"서명","width":80}
  ]},
  {"key":"eval_method","label":"평가 방법","type":"text","width":"half"},
  {"key":"eval_result","label":"평가 결과","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ABMS-04','부패위험 실사 체크리스트','반부패관리','ABMS','C','8.2','iso37001','starter',1280,
'[
  {"key":"due_diligence_date","label":"실사일","type":"date","required":true,"width":"half"},
  {"key":"target","label":"실사 대상(거래처/파트너)","type":"text","required":true,"width":"half"},
  {"key":"reviewer","label":"실사 담당자","type":"text","width":"half"},
  {"key":"checklist","label":"실사 항목","type":"table","columns":[
    {"key":"category","label":"구분","width":100},
    {"key":"item","label":"실사 항목","width":250},
    {"key":"result","label":"결과","width":80},
    {"key":"evidence","label":"근거/증거","width":180},
    {"key":"risk","label":"위험수준","width":80}
  ]},
  {"key":"overall_risk","label":"종합 위험 수준","type":"select","options":["낮음","보통","높음","매우높음"],"required":true,"width":"half"},
  {"key":"recommendation","label":"권고사항","type":"textarea","width":"full"},
  {"key":"decision","label":"거래 결정","type":"select","options":["승인","조건부승인","보류","거절"],"width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ABMS-05','계약 무결성 선언서','반부패관리','ABMS','B','8.5','iso37001','starter',1290,
'[
  {"key":"contract_no","label":"계약번호","type":"text","required":true,"width":"half"},
  {"key":"date","label":"작성일","type":"date","required":true,"width":"half"},
  {"key":"party_a","label":"갑(당사)","type":"text","required":true,"width":"half"},
  {"key":"party_b","label":"을(상대방)","type":"text","required":true,"width":"half"},
  {"key":"project","label":"계약 프로젝트/거래명","type":"text","required":true,"width":"full"},
  {"key":"declaration","label":"선언 내용","type":"textarea","required":true,"width":"full"},
  {"key":"commitments","label":"준수 사항","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"commitment","label":"준수 항목","width":400}
  ]},
  {"key":"penalty","label":"위반 시 제재 조항","type":"textarea","width":"full"},
  {"key":"signatory_a","label":"갑 서명자","type":"text","width":"half"},
  {"key":"signatory_b","label":"을 서명자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ABMS-06','내부신고 처리 기록','반부패관리','ABMS','B','8.9','iso37001','starter',1300,
'[
  {"key":"report_no","label":"처리번호","type":"text","required":true,"width":"half"},
  {"key":"receipt_date","label":"접수일","type":"date","required":true,"width":"half"},
  {"key":"channel","label":"신고 채널","type":"select","options":["핫라인","이메일","우편","직접신고","기타"],"width":"half"},
  {"key":"anonymous","label":"익명 여부","type":"select","options":["익명","실명"],"width":"half"},
  {"key":"category","label":"신고 내용 분류","type":"select","options":["뇌물·부패","선물·접대","이해충돌","기타 비위"],"required":true,"width":"half"},
  {"key":"description","label":"신고 내용 요약","type":"textarea","required":true,"width":"full"},
  {"key":"investigation","label":"조사 경과","type":"textarea","width":"full"},
  {"key":"findings","label":"조사 결과","type":"textarea","width":"full"},
  {"key":"action","label":"처리 조치","type":"textarea","width":"full"},
  {"key":"close_date","label":"종결일","type":"date","width":"half"},
  {"key":"handler","label":"처리 담당자","type":"text","width":"half"},
  {"key":"confidentiality","label":"비밀 유지 조치","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ABMS-07','반부패 내부심사 체크리스트','반부패관리','ABMS','C','9.2','iso37001','starter',1310,
'[
  {"key":"audit_date","label":"심사일","type":"date","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","width":"half"},
  {"key":"target","label":"심사 대상 부서","type":"text","width":"half"},
  {"key":"checklist","label":"심사 항목","type":"table","columns":[
    {"key":"clause","label":"조항","width":80},
    {"key":"requirement","label":"심사 요구사항","width":260},
    {"key":"result","label":"결과","width":80},
    {"key":"evidence","label":"객관적 증거","width":200},
    {"key":"finding","label":"발견사항","width":150}
  ]},
  {"key":"nc_count","label":"부적합 건수","type":"number","width":"half"},
  {"key":"obs_count","label":"관찰사항 건수","type":"number","width":"half"},
  {"key":"summary","label":"심사 총평","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ABMS-08','반부패 경영검토 보고서','반부패관리','ABMS','C','9.3','iso37001','starter',1320,
'[
  {"key":"review_date","label":"검토일","type":"date","required":true,"width":"half"},
  {"key":"reviewer","label":"검토자(최고경영자)","type":"text","width":"half"},
  {"key":"period","label":"검토 대상 기간","type":"text","required":true,"width":"half"},
  {"key":"agenda","label":"검토 안건","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"item","label":"검토 항목","width":250},
    {"key":"content","label":"검토 내용","width":300},
    {"key":"decision","label":"결정 사항","width":200}
  ]},
  {"key":"kpi_review","label":"반부패 성과지표 검토","type":"textarea","width":"full"},
  {"key":"improvement","label":"개선 사항 및 자원 결정","type":"textarea","width":"full"},
  {"key":"next_action","label":"후속 조치 계획","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- ISO 37301 준법경영 서식 (7개)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CMS-01','준법의무 등록부','준법관리','CMS','C','6.1','iso37301','starter',1330,
'[
  {"key":"revision_date","label":"갱신일","type":"date","required":true,"width":"half"},
  {"key":"manager","label":"관리자","type":"text","width":"half"},
  {"key":"obligations","label":"준법의무 목록","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"law","label":"법규/의무명","width":200},
    {"key":"category","label":"분류","width":100},
    {"key":"requirement","label":"주요 의무사항","width":220},
    {"key":"responsible","label":"담당부서","width":110},
    {"key":"due_date","label":"이행기한","width":100},
    {"key":"status","label":"이행상태","width":90},
    {"key":"evidence","label":"이행 증거","width":150}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CMS-02','준법 리스크 평가서','준법관리','CMS','C','6.1.2','iso37301','starter',1340,
'[
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"risks","label":"준법 리스크 평가","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"obligation","label":"준법의무","width":200},
    {"key":"risk","label":"위반 리스크","width":180},
    {"key":"likelihood","label":"가능성(1-5)","width":90},
    {"key":"impact","label":"영향도(1-5)","width":90},
    {"key":"score","label":"위험점수","width":80},
    {"key":"level","label":"위험등급","width":80},
    {"key":"control","label":"통제방안","width":180}
  ]},
  {"key":"summary","label":"평가 요약 및 권고","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CMS-03','준법 교육 실시 기록','준법관리','CMS','B','7.2','iso37301','starter',1350,
'[
  {"key":"training_date","label":"교육일","type":"date","required":true,"width":"half"},
  {"key":"trainer","label":"강사","type":"text","required":true,"width":"half"},
  {"key":"topic","label":"교육 주제","type":"text","required":true,"width":"full"},
  {"key":"duration","label":"교육 시간(h)","type":"number","width":"half"},
  {"key":"target","label":"교육 대상","type":"text","width":"half"},
  {"key":"content","label":"교육 내용","type":"textarea","width":"full"},
  {"key":"attendees","label":"참석자 명단","type":"table","columns":[
    {"key":"name","label":"성명","width":100},
    {"key":"dept","label":"부서","width":100},
    {"key":"position","label":"직위","width":80},
    {"key":"signature","label":"서명","width":80}
  ]},
  {"key":"eval_result","label":"교육 평가 결과","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CMS-04','준법 위반 사례 보고서','준법관리','CMS','B','10.1','iso37301','starter',1360,
'[
  {"key":"report_no","label":"보고번호","type":"text","required":true,"width":"half"},
  {"key":"occurrence_date","label":"발생일","type":"date","required":true,"width":"half"},
  {"key":"reporter","label":"보고자","type":"text","required":true,"width":"half"},
  {"key":"dept","label":"소속 부서","type":"text","width":"half"},
  {"key":"obligation","label":"위반된 준법의무","type":"text","required":true,"width":"full"},
  {"key":"description","label":"위반 내용 상세","type":"textarea","required":true,"width":"full"},
  {"key":"cause","label":"위반 원인 분석","type":"textarea","width":"full"},
  {"key":"impact","label":"영향 및 피해","type":"textarea","width":"full"},
  {"key":"immediate_action","label":"즉각 조치","type":"textarea","width":"full"},
  {"key":"corrective_action","label":"시정 조치 계획","type":"textarea","width":"full"},
  {"key":"responsible","label":"조치 담당자","type":"text","width":"half"},
  {"key":"due_date","label":"조치 완료 기한","type":"date","width":"half"},
  {"key":"recurrence_prevention","label":"재발 방지 대책","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CMS-05','준법 모니터링 체크리스트','준법관리','CMS','C','9.1','iso37301','starter',1370,
'[
  {"key":"monitoring_date","label":"모니터링일","type":"date","required":true,"width":"half"},
  {"key":"monitor","label":"모니터링 담당자","type":"text","width":"half"},
  {"key":"checklist","label":"준법의무 모니터링","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"obligation","label":"준법의무","width":220},
    {"key":"due","label":"이행기한","width":90},
    {"key":"status","label":"이행상태","width":90},
    {"key":"evidence","label":"이행증거","width":150},
    {"key":"issue","label":"문제사항","width":150},
    {"key":"action","label":"필요조치","width":150}
  ]},
  {"key":"overall","label":"종합 의견","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CMS-06','준법 내부심사 체크리스트','준법관리','CMS','C','9.2','iso37301','starter',1380,
'[
  {"key":"audit_date","label":"심사일","type":"date","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","width":"half"},
  {"key":"target","label":"심사 대상","type":"text","width":"half"},
  {"key":"checklist","label":"심사 항목","type":"table","columns":[
    {"key":"clause","label":"조항","width":80},
    {"key":"requirement","label":"심사 요구사항","width":260},
    {"key":"result","label":"결과","width":80},
    {"key":"evidence","label":"객관적 증거","width":200},
    {"key":"finding","label":"발견사항","width":150}
  ]},
  {"key":"nc_count","label":"부적합 건수","type":"number","width":"half"},
  {"key":"obs_count","label":"관찰사항 건수","type":"number","width":"half"},
  {"key":"summary","label":"심사 총평","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CMS-07','준법 경영검토 보고서','준법관리','CMS','C','9.3','iso37301','starter',1390,
'[
  {"key":"review_date","label":"검토일","type":"date","required":true,"width":"half"},
  {"key":"reviewer","label":"검토자(최고경영자)","type":"text","width":"half"},
  {"key":"period","label":"검토 대상 기간","type":"text","required":true,"width":"half"},
  {"key":"agenda","label":"검토 안건","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"item","label":"검토 항목","width":250},
    {"key":"content","label":"검토 내용","width":300},
    {"key":"decision","label":"결정 사항","width":200}
  ]},
  {"key":"kpi_review","label":"준법 성과지표 검토","type":"textarea","width":"full"},
  {"key":"improvement","label":"개선 사항 및 자원 결정","type":"textarea","width":"full"},
  {"key":"next_action","label":"후속 조치 계획","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- ISO 27001 정보보안경영 서식 (10개)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ISMS-01','정보자산 목록','정보보안','ISMS','C','8.1','iso27001','starter',1400,
'[
  {"key":"revision_date","label":"갱신일","type":"date","required":true,"width":"half"},
  {"key":"manager","label":"관리자","type":"text","width":"half"},
  {"key":"assets","label":"정보자산 목록","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"asset_no","label":"자산번호","width":110},
    {"key":"name","label":"자산명","width":180},
    {"key":"type","label":"유형","width":100},
    {"key":"owner","label":"소유자","width":100},
    {"key":"location","label":"보관위치","width":120},
    {"key":"classification","label":"분류등급","width":90},
    {"key":"likelihood","label":"가능성","width":70},
    {"key":"impact","label":"영향도","width":70},
    {"key":"risk_score","label":"위험점수","width":80},
    {"key":"control","label":"관리방안","width":150}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ISMS-02','정보보안 위험평가서','정보보안','ISMS','C','6.1.2','iso27001','starter',1410,
'[
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"risks","label":"위험 평가","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"asset","label":"정보자산","width":150},
    {"key":"threat","label":"위협","width":150},
    {"key":"vulnerability","label":"취약점","width":150},
    {"key":"likelihood","label":"가능성(1-5)","width":90},
    {"key":"impact","label":"영향도(1-5)","width":90},
    {"key":"risk_level","label":"위험등급","width":80},
    {"key":"treatment","label":"처리 방안","width":180},
    {"key":"control","label":"통제 수단","width":150}
  ]},
  {"key":"summary","label":"위험평가 요약","type":"textarea","width":"full"},
  {"key":"risk_acceptance","label":"잔류위험 수용 기준","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ISMS-03','적용선언서(SoA)','정보보안','ISMS','C','6.1.3','iso27001','starter',1420,
'[
  {"key":"version","label":"버전","type":"text","required":true,"width":"half"},
  {"key":"date","label":"작성일","type":"date","required":true,"width":"half"},
  {"key":"author","label":"작성자","type":"text","width":"half"},
  {"key":"controls","label":"통제항목 적용 현황","type":"table","columns":[
    {"key":"control_id","label":"통제 ID","width":90},
    {"key":"control_name","label":"통제항목명","width":200},
    {"key":"applicable","label":"적용여부","width":80},
    {"key":"reason","label":"적용/제외 이유","width":200},
    {"key":"implementation","label":"구현 방법","width":200},
    {"key":"status","label":"구현상태","width":90}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ISMS-04','접근 권한 관리대장','정보보안','ISMS','C','8.1','iso27001','starter',1430,
'[
  {"key":"revision_date","label":"갱신일","type":"date","required":true,"width":"half"},
  {"key":"manager","label":"관리자","type":"text","width":"half"},
  {"key":"access_rights","label":"접근 권한 현황","type":"table","columns":[
    {"key":"user","label":"사용자명","width":100},
    {"key":"dept","label":"부서","width":100},
    {"key":"system","label":"시스템/자원","width":150},
    {"key":"permission","label":"권한 수준","width":100},
    {"key":"grant_date","label":"부여일","width":90},
    {"key":"expiry","label":"만료일","width":90},
    {"key":"approver","label":"승인자","width":90},
    {"key":"status","label":"상태","width":70}
  ]},
  {"key":"review_result","label":"권한 검토 결과","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ISMS-05','보안사고 보고서','정보보안','ISMS','B','16.1','iso27001','starter',1440,
'[
  {"key":"report_no","label":"보고번호","type":"text","required":true,"width":"half"},
  {"key":"occurrence_date","label":"발생일시","type":"date","required":true,"width":"half"},
  {"key":"reporter","label":"보고자","type":"text","required":true,"width":"half"},
  {"key":"dept","label":"소속 부서","type":"text","width":"half"},
  {"key":"incident_type","label":"사고 유형","type":"select","options":["데이터 유출","무단접근","악성코드","서비스장애","물리적 보안","기타"],"required":true,"width":"half"},
  {"key":"severity","label":"심각도","type":"select","options":["높음","중간","낮음"],"width":"half"},
  {"key":"affected_assets","label":"영향받은 자산","type":"text","width":"full"},
  {"key":"description","label":"사고 내용 상세","type":"textarea","required":true,"width":"full"},
  {"key":"immediate_action","label":"즉각 조치","type":"textarea","width":"full"},
  {"key":"root_cause","label":"원인 분석","type":"textarea","width":"full"},
  {"key":"corrective_action","label":"시정 조치","type":"textarea","width":"full"},
  {"key":"recurrence_prevention","label":"재발 방지 대책","type":"textarea","width":"full"},
  {"key":"close_date","label":"종결일","type":"date","width":"half"},
  {"key":"handler","label":"처리 담당자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ISMS-06','정보보안 교육 기록','정보보안','ISMS','B','7.2','iso27001','starter',1450,
'[
  {"key":"training_date","label":"교육일","type":"date","required":true,"width":"half"},
  {"key":"trainer","label":"강사","type":"text","required":true,"width":"half"},
  {"key":"topic","label":"교육 주제","type":"text","required":true,"width":"full"},
  {"key":"duration","label":"교육 시간(h)","type":"number","width":"half"},
  {"key":"method","label":"교육 방법","type":"select","options":["집합교육","온라인","OJT","기타"],"width":"half"},
  {"key":"content","label":"교육 내용 요약","type":"textarea","width":"full"},
  {"key":"attendees","label":"참석자 명단","type":"table","columns":[
    {"key":"name","label":"성명","width":100},
    {"key":"dept","label":"부서","width":100},
    {"key":"position","label":"직위","width":80},
    {"key":"signature","label":"서명","width":80}
  ]},
  {"key":"eval_result","label":"교육 평가 결과","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ISMS-07','정보보안 감사 체크리스트','정보보안','ISMS','C','9.2','iso27001','starter',1460,
'[
  {"key":"audit_date","label":"심사일","type":"date","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","width":"half"},
  {"key":"target","label":"심사 대상 부서","type":"text","width":"half"},
  {"key":"checklist","label":"심사 항목","type":"table","columns":[
    {"key":"control_id","label":"통제ID","width":80},
    {"key":"requirement","label":"심사 요구사항","width":260},
    {"key":"result","label":"결과","width":80},
    {"key":"evidence","label":"객관적 증거","width":200},
    {"key":"finding","label":"발견사항","width":150}
  ]},
  {"key":"nc_count","label":"부적합 건수","type":"number","width":"half"},
  {"key":"obs_count","label":"관찰사항 건수","type":"number","width":"half"},
  {"key":"summary","label":"심사 총평","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ISMS-08','취약점 점검 기록','정보보안','ISMS','B','12.6','iso27001','starter',1470,
'[
  {"key":"check_date","label":"점검일","type":"date","required":true,"width":"half"},
  {"key":"checker","label":"점검자","type":"text","required":true,"width":"half"},
  {"key":"system","label":"점검 대상 시스템","type":"text","required":true,"width":"full"},
  {"key":"tool","label":"점검 도구/방법","type":"text","width":"half"},
  {"key":"scope","label":"점검 범위","type":"text","width":"half"},
  {"key":"vulnerabilities","label":"취약점 발견 현황","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"vuln","label":"취약점 내용","width":250},
    {"key":"severity","label":"위험도","width":80},
    {"key":"cvss","label":"CVSS점수","width":90},
    {"key":"status","label":"조치상태","width":90},
    {"key":"action","label":"조치 내용","width":200},
    {"key":"due","label":"완료 기한","width":90}
  ]},
  {"key":"summary","label":"점검 결과 요약","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ISMS-09','비밀유지 서약서','정보보안','ISMS','B','7.3','iso27001','starter',1480,
'[
  {"key":"date","label":"작성일","type":"date","required":true,"width":"half"},
  {"key":"signatory","label":"서약자 성명","type":"text","required":true,"width":"half"},
  {"key":"dept","label":"소속 부서","type":"text","required":true,"width":"half"},
  {"key":"position","label":"직위","type":"text","width":"half"},
  {"key":"employment_type","label":"고용 형태","type":"select","options":["정규직","계약직","파견","외주","기타"],"width":"half"},
  {"key":"scope","label":"비밀 유지 대상 정보","type":"textarea","required":true,"width":"full"},
  {"key":"obligations","label":"의무 사항","type":"textarea","required":true,"width":"full"},
  {"key":"period","label":"유지 기간","type":"text","width":"half"},
  {"key":"penalty","label":"위반 시 제재","type":"textarea","width":"full"},
  {"key":"signature_confirm","label":"서약 확인 (본인 서명)","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ISMS-10','비즈니스 연속성 계획','정보보안','ISMS','C','17.1','iso27001','starter',1490,
'[
  {"key":"version","label":"버전","type":"text","required":true,"width":"half"},
  {"key":"date","label":"승인일","type":"date","required":true,"width":"half"},
  {"key":"owner","label":"계획 소유자","type":"text","width":"half"},
  {"key":"scope","label":"적용 범위","type":"textarea","required":true,"width":"full"},
  {"key":"rto","label":"목표복구시간(RTO)","type":"text","width":"half"},
  {"key":"rpo","label":"목표복구시점(RPO)","type":"text","width":"half"},
  {"key":"critical_systems","label":"핵심 시스템/서비스","type":"table","columns":[
    {"key":"system","label":"시스템/서비스","width":180},
    {"key":"priority","label":"우선순위","width":80},
    {"key":"rto","label":"RTO","width":80},
    {"key":"rpo","label":"RPO","width":80},
    {"key":"backup","label":"백업 방법","width":150},
    {"key":"alt_procedure","label":"대체 절차","width":180}
  ]},
  {"key":"recovery_steps","label":"복구 절차","type":"textarea","width":"full"},
  {"key":"test_schedule","label":"BCP 테스트 일정","type":"text","width":"half"},
  {"key":"contact_list","label":"비상 연락망","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-FS-01','위해요소 분석표','식품안전','FS','B','8.5.2','iso22000','starter',1500,
'[
  {"key":"product","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"analysis_date","label":"분석일","type":"date","required":true,"width":"half"},
  {"key":"team","label":"식품안전팀","type":"text","width":"half"},
  {"key":"hazards","label":"위해요소 분석","type":"table","columns":[
    {"key":"step","label":"공정단계","width":120},
    {"key":"hazard_type","label":"위해유형(B/C/P)","width":120},
    {"key":"hazard","label":"잠재적 위해요소","width":180},
    {"key":"cause","label":"발생원인","width":150},
    {"key":"severity","label":"심각성(1-3)","width":100},
    {"key":"probability","label":"발생가능성(1-3)","width":110},
    {"key":"significance","label":"유의성(Y/N)","width":100},
    {"key":"control_measure","label":"관리방안","width":180}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-FS-02','HACCP 계획서','식품안전','FS','B','8.5.4','iso22000','starter',1510,
'[
  {"key":"product","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"established_date","label":"수립일","type":"date","required":true,"width":"half"},
  {"key":"team_leader","label":"식품안전팀장","type":"text","width":"half"},
  {"key":"ccp_plan","label":"HACCP 계획","type":"table","columns":[
    {"key":"ccp_no","label":"CCP번호","width":80},
    {"key":"step","label":"공정단계","width":120},
    {"key":"hazard","label":"위해요소","width":150},
    {"key":"critical_limit","label":"한계기준","width":150},
    {"key":"monitoring_method","label":"모니터링방법","width":150},
    {"key":"frequency","label":"빈도","width":80},
    {"key":"monitor","label":"모니터요원","width":100},
    {"key":"corrective_action","label":"개선조치","width":150},
    {"key":"verification","label":"검증방법","width":130},
    {"key":"record","label":"기록","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-FS-03','CCP 모니터링 기록','식품안전','FS','D','8.8.1','iso22000','starter',1520,
'[
  {"key":"record_date","label":"기록일","type":"date","required":true,"width":"half"},
  {"key":"product","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"ccp_no","label":"CCP번호","type":"text","width":"half"},
  {"key":"monitor","label":"모니터요원","type":"text","width":"half"},
  {"key":"records","label":"모니터링 기록","type":"table","columns":[
    {"key":"time","label":"시간","width":80},
    {"key":"lot_no","label":"LOT번호","width":120},
    {"key":"measured_value","label":"측정값","width":100},
    {"key":"critical_limit","label":"한계기준","width":120},
    {"key":"result","label":"적합여부","width":90},
    {"key":"corrective_action","label":"개선조치","width":150},
    {"key":"verifier","label":"검증자","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-FS-04','한계기준 이탈 처리 기록','식품안전','FS','B','8.9.3','iso22000','starter',1530,
'[
  {"key":"report_number","label":"보고서 번호","type":"text","required":true,"width":"half"},
  {"key":"occurrence_date","label":"발생일시","type":"text","required":true,"width":"half"},
  {"key":"product","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"ccp_no","label":"CCP번호","type":"text","width":"half"},
  {"key":"lot_no","label":"LOT번호","type":"text","width":"half"},
  {"key":"quantity","label":"영향 수량","type":"text","width":"half"},
  {"key":"deviation","label":"이탈 내용","type":"textarea","required":true,"width":"full"},
  {"key":"immediate_action","label":"즉각 조치","type":"textarea","width":"full"},
  {"key":"product_disposition","label":"제품 처리방법","type":"select","options":["재작업","폐기","격리보관","특채"],"width":"half"},
  {"key":"root_cause","label":"원인 분석","type":"textarea","width":"full"},
  {"key":"corrective_action","label":"재발 방지 대책","type":"textarea","width":"full"},
  {"key":"handler","label":"처리자","type":"text","width":"half"},
  {"key":"verifier","label":"검증자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-FS-05','선행요건프로그램(PRP) 점검표','식품안전','FS','D','8.2','iso22000','starter',1540,
'[
  {"key":"check_date","label":"점검일","type":"date","required":true,"width":"half"},
  {"key":"checker","label":"점검자","type":"text","required":true,"width":"half"},
  {"key":"area","label":"점검 구역","type":"text","width":"half"},
  {"key":"items","label":"PRP 점검 항목","type":"table","columns":[
    {"key":"category","label":"구분","width":100},
    {"key":"check_item","label":"점검 항목","width":250},
    {"key":"result","label":"결과(O/X/N/A)","width":100},
    {"key":"note","label":"지적사항","width":200}
  ]},
  {"key":"overall","label":"종합 의견","type":"textarea","width":"full"},
  {"key":"action_required","label":"조치 필요사항","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-FS-06','세척·소독 기록','식품안전','FS','D','8.2','iso22000','starter',1550,
'[
  {"key":"record_date","label":"기록일","type":"date","required":true,"width":"half"},
  {"key":"worker","label":"작업자","type":"text","required":true,"width":"half"},
  {"key":"records","label":"세척·소독 기록","type":"table","columns":[
    {"key":"time","label":"시간","width":80},
    {"key":"target","label":"대상(설비/기구/환경)","width":150},
    {"key":"method","label":"방법","width":120},
    {"key":"chemical","label":"사용약품","width":120},
    {"key":"concentration","label":"농도","width":80},
    {"key":"result","label":"결과","width":80},
    {"key":"verifier","label":"확인자","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-FS-07','알레르겐 관리 기록','식품안전','FS','B','8.2','iso22000','starter',1560,
'[
  {"key":"revision_date","label":"작성일","type":"date","width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"allergens","label":"알레르겐 관리 현황","type":"table","columns":[
    {"key":"product","label":"제품명","width":150},
    {"key":"allergen_type","label":"알레르겐 종류","width":150},
    {"key":"raw_material","label":"함유 원료","width":150},
    {"key":"cross_contact_risk","label":"교차오염 위험","width":120},
    {"key":"control_measure","label":"관리방안","width":180},
    {"key":"label_check","label":"라벨표시 확인","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-FS-08','해충방제 기록','식품안전','FS','D','8.2','iso22000','starter',1570,
'[
  {"key":"record_month","label":"기록 월","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"records","label":"해충방제 기록","type":"table","columns":[
    {"key":"date","label":"일자","width":100},
    {"key":"area","label":"점검구역","width":120},
    {"key":"pest_found","label":"해충발견여부","width":110},
    {"key":"pest_type","label":"해충종류","width":100},
    {"key":"action","label":"방제조치","width":150},
    {"key":"chemical","label":"사용약품","width":120},
    {"key":"worker","label":"작업자","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-FS-09','식품안전팀 회의록','식품안전','FS','B','5.3','iso22000','starter',1580,
'[
  {"key":"meeting_date","label":"회의일","type":"date","required":true,"width":"half"},
  {"key":"chair","label":"주재자","type":"text","width":"half"},
  {"key":"attendees","label":"참석자","type":"textarea","width":"full"},
  {"key":"agenda","label":"안건","type":"textarea","required":true,"width":"full"},
  {"key":"discussion","label":"토의 내용","type":"textarea","width":"full"},
  {"key":"decisions","label":"결정사항","type":"textarea","width":"full"},
  {"key":"action_items","label":"조치사항","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"action","label":"조치 내용","width":250},
    {"key":"owner","label":"담당자","width":100},
    {"key":"due_date","label":"완료예정일","width":120},
    {"key":"status","label":"상태","width":80}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-FS-10','식품안전 내부심사 체크리스트','식품안전','FS','D','9.2','iso22000','starter',1590,
'[
  {"key":"audit_date","label":"심사일","type":"date","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","required":true,"width":"half"},
  {"key":"items","label":"심사 항목","type":"table","columns":[
    {"key":"iso_clause","label":"ISO 조항","width":100},
    {"key":"check_item","label":"심사 항목","width":280},
    {"key":"result","label":"C/NC/OBS","width":100},
    {"key":"evidence","label":"증거/비고","width":200}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-BC-01','업무영향분석서 (BIA)','사업연속성','BC','B','8.2.2','iso22301','starter',1600,
'[
  {"key":"analysis_date","label":"분석일","type":"date","required":true,"width":"half"},
  {"key":"analyst","label":"분석자","type":"text","width":"half"},
  {"key":"analysis_period","label":"분석 기간","type":"text","width":"half"},
  {"key":"activities","label":"핵심 업무 기능 분석","type":"table","columns":[
    {"key":"activity","label":"업무기능","width":150},
    {"key":"dept","label":"담당부서","width":100},
    {"key":"rto","label":"목표복구시간(RTO)","width":130},
    {"key":"rpo","label":"목표복구시점(RPO)","width":130},
    {"key":"mtpd","label":"최대허용중단기간","width":120},
    {"key":"priority","label":"복구우선순위","width":100},
    {"key":"dependencies","label":"의존 자원","width":150},
    {"key":"impact_financial","label":"재무적 영향","width":110},
    {"key":"impact_reputational","label":"평판 영향","width":100}
  ]},
  {"key":"critical_resources","label":"핵심 자원 목록","type":"textarea","width":"full"},
  {"key":"overall_assessment","label":"종합 평가","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-BC-02','사업연속성 계획서 (BCP)','사업연속성','BC','B','8.4.4','iso22301','starter',1610,
'[
  {"key":"plan_date","label":"계획수립일","type":"date","required":true,"width":"half"},
  {"key":"owner","label":"계획 책임자","type":"text","width":"half"},
  {"key":"version","label":"버전","type":"text","width":"half"},
  {"key":"scope","label":"적용 범위","type":"textarea","width":"full"},
  {"key":"scenarios","label":"비상 시나리오","type":"table","columns":[
    {"key":"scenario","label":"시나리오","width":150},
    {"key":"trigger","label":"발동 조건","width":150},
    {"key":"response_team","label":"대응팀","width":120},
    {"key":"immediate_action","label":"즉각 조치","width":200},
    {"key":"recovery_action","label":"복구 조치","width":200}
  ]},
  {"key":"escalation","label":"에스컬레이션 절차","type":"textarea","width":"full"},
  {"key":"communication_plan","label":"의사소통 계획","type":"textarea","width":"full"},
  {"key":"recovery_procedure","label":"복구 절차","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-BC-03','위기대응 계획서','사업연속성','BC','B','8.4.3','iso22301','starter',1620,
'[
  {"key":"plan_date","label":"수립일","type":"date","required":true,"width":"half"},
  {"key":"owner","label":"책임자","type":"text","width":"half"},
  {"key":"crisis_types","label":"위기 유형별 대응","type":"table","columns":[
    {"key":"crisis_type","label":"위기 유형","width":150},
    {"key":"severity","label":"심각도","width":80},
    {"key":"trigger","label":"발동 기준","width":150},
    {"key":"response_team","label":"대응팀","width":120},
    {"key":"immediate_action","label":"즉각 조치(1시간)","width":180},
    {"key":"short_term","label":"단기조치(24시간)","width":150},
    {"key":"long_term","label":"장기조치(1주일)","width":150}
  ]},
  {"key":"decision_authority","label":"의사결정 권한","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-BC-04','RTO/RPO 관리표','사업연속성','BC','B','8.2.2','iso22301','starter',1630,
'[
  {"key":"revision_date","label":"작성일","type":"date","width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"objectives","label":"복구 목표 현황","type":"table","columns":[
    {"key":"system_service","label":"시스템/서비스","width":150},
    {"key":"rto_target","label":"RTO 목표","width":100},
    {"key":"rto_actual","label":"RTO 실적","width":100},
    {"key":"rpo_target","label":"RPO 목표","width":100},
    {"key":"rpo_actual","label":"RPO 실적","width":100},
    {"key":"mtpd","label":"MTPD","width":90},
    {"key":"priority","label":"우선순위","width":80},
    {"key":"note","label":"비고","width":120}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-BC-05','비상연락망','사업연속성','BC','B','8.4.2','iso22301','starter',1640,
'[
  {"key":"revision_date","label":"최신화일","type":"date","required":true,"width":"half"},
  {"key":"manager","label":"관리자","type":"text","width":"half"},
  {"key":"contacts","label":"비상연락망","type":"table","columns":[
    {"key":"role","label":"역할","width":120},
    {"key":"name","label":"성명","width":100},
    {"key":"dept","label":"부서","width":100},
    {"key":"mobile","label":"휴대폰","width":130},
    {"key":"office","label":"사무실","width":130},
    {"key":"email","label":"이메일","width":180},
    {"key":"backup","label":"대리자","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-BC-06','비상훈련·연습 기록','사업연속성','BC','B','8.5','iso22301','starter',1650,
'[
  {"key":"drill_date","label":"훈련일","type":"date","required":true,"width":"half"},
  {"key":"drill_type","label":"훈련 유형","type":"select","options":["탁상훈련","기능훈련","전체훈련","시뮬레이션"],"required":true,"width":"half"},
  {"key":"scenario","label":"훈련 시나리오","type":"textarea","width":"full"},
  {"key":"objectives","label":"훈련 목표","type":"textarea","width":"full"},
  {"key":"participants","label":"참가 인원","type":"number","width":"half"},
  {"key":"duration","label":"훈련 시간","type":"text","width":"half"},
  {"key":"rto_achieved","label":"RTO 달성 여부","type":"select","options":["달성","미달성","해당없음"],"width":"half"},
  {"key":"result","label":"훈련 결과","type":"textarea","width":"full"},
  {"key":"lessons_learned","label":"교훈 사항","type":"textarea","width":"full"},
  {"key":"improvements","label":"개선사항","type":"textarea","width":"full"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-BC-07','복구 절차서','사업연속성','BC','B','8.4.4','iso22301','starter',1660,
'[
  {"key":"procedure_name","label":"절차서명","type":"text","required":true,"width":"half"},
  {"key":"target_system","label":"대상 시스템/서비스","type":"text","required":true,"width":"half"},
  {"key":"rto","label":"목표 RTO","type":"text","width":"half"},
  {"key":"owner","label":"책임자","type":"text","width":"half"},
  {"key":"steps","label":"복구 단계","type":"table","columns":[
    {"key":"step_no","label":"순서","width":60},
    {"key":"action","label":"조치 내용","width":250},
    {"key":"responsible","label":"담당자","width":100},
    {"key":"time_required","label":"소요시간","width":90},
    {"key":"verification","label":"확인방법","width":150}
  ]},
  {"key":"rollback_procedure","label":"롤백 절차","type":"textarea","width":"full"},
  {"key":"test_results","label":"복구 테스트 결과","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-BC-08','사업연속성 내부심사 체크리스트','사업연속성','BC','D','9.2','iso22301','starter',1670,
'[
  {"key":"audit_date","label":"심사일","type":"date","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","required":true,"width":"half"},
  {"key":"items","label":"심사 항목","type":"table","columns":[
    {"key":"iso_clause","label":"ISO 조항","width":100},
    {"key":"check_item","label":"심사 항목","width":280},
    {"key":"result","label":"C/NC/OBS","width":100},
    {"key":"evidence","label":"증거/비고","width":200}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-MD-01','설계개발 계획서 (DHF)','의료기기','MD','B','7.3.2','iso13485','starter',1680,
'[
  {"key":"device_name","label":"기기명","type":"text","required":true,"width":"half"},
  {"key":"device_code","label":"기기코드","type":"text","width":"half"},
  {"key":"plan_date","label":"계획수립일","type":"date","required":true,"width":"half"},
  {"key":"project_manager","label":"과제책임자","type":"text","width":"half"},
  {"key":"intended_use","label":"사용목적","type":"textarea","width":"full"},
  {"key":"milestones","label":"개발 마일스톤","type":"table","columns":[
    {"key":"stage","label":"단계","width":100},
    {"key":"deliverable","label":"산출물","width":200},
    {"key":"planned_date","label":"계획일","width":120},
    {"key":"actual_date","label":"완료일","width":120},
    {"key":"reviewer","label":"검토자","width":100},
    {"key":"status","label":"상태","width":80}
  ]},
  {"key":"design_inputs","label":"설계 입력사항","type":"textarea","width":"full"},
  {"key":"regulatory_requirements","label":"규제 요구사항","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-MD-02','기기이력 기록 (DHR)','의료기기','MD','D','7.5.9','iso13485','starter',1690,
'[
  {"key":"device_name","label":"기기명","type":"text","required":true,"width":"half"},
  {"key":"lot_number","label":"제조번호/LOT","type":"text","required":true,"width":"half"},
  {"key":"manufacture_date","label":"제조일","type":"date","required":true,"width":"half"},
  {"key":"quantity","label":"제조수량","type":"number","width":"half"},
  {"key":"records","label":"제조 이력 기록","type":"table","columns":[
    {"key":"process_step","label":"공정단계","width":120},
    {"key":"date","label":"일자","width":100},
    {"key":"operator","label":"작업자","width":100},
    {"key":"result","label":"결과","width":100},
    {"key":"equipment","label":"사용설비","width":120},
    {"key":"note","label":"특이사항","width":150}
  ]},
  {"key":"inspection_result","label":"최종검사 결과","type":"textarea","width":"full"},
  {"key":"release_date","label":"출하일","type":"date","width":"half"},
  {"key":"release_person","label":"출하 승인자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-MD-03','위험관리 기록','의료기기','MD','B','7.1','iso13485','starter',1700,
'[
  {"key":"device_name","label":"기기명","type":"text","required":true,"width":"half"},
  {"key":"analysis_date","label":"분석일","type":"date","required":true,"width":"half"},
  {"key":"analyst","label":"분석자","type":"text","width":"half"},
  {"key":"risks","label":"위험 분석","type":"table","columns":[
    {"key":"hazard","label":"위험요인","width":150},
    {"key":"hazardous_situation","label":"위험상황","width":150},
    {"key":"harm","label":"위해","width":120},
    {"key":"severity","label":"심각성(1-5)","width":100},
    {"key":"probability","label":"발생확률(1-5)","width":100},
    {"key":"risk_level","label":"위험수준","width":90},
    {"key":"control_measure","label":"위험통제방안","width":180},
    {"key":"residual_risk","label":"잔류위험","width":90}
  ]},
  {"key":"overall_residual_risk","label":"전체 잔류위험 평가","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-MD-04','멸균 공정 기록','의료기기','MD','D','7.5.5','iso13485','starter',1710,
'[
  {"key":"record_date","label":"기록일","type":"date","required":true,"width":"half"},
  {"key":"operator","label":"작업자","type":"text","required":true,"width":"half"},
  {"key":"lot_number","label":"LOT번호","type":"text","required":true,"width":"half"},
  {"key":"sterilization_method","label":"멸균방법","type":"select","options":["EO가스","증기","건열","방사선","기타"],"width":"half"},
  {"key":"records","label":"멸균 공정 기록","type":"table","columns":[
    {"key":"cycle_no","label":"사이클번호","width":100},
    {"key":"temperature","label":"온도(℃)","width":90},
    {"key":"pressure","label":"압력(kPa)","width":90},
    {"key":"time","label":"시간(분)","width":80},
    {"key":"bi_result","label":"BI결과","width":90},
    {"key":"result","label":"적합여부","width":90},
    {"key":"note","label":"비고","width":120}
  ]},
  {"key":"release_decision","label":"출하 결정","type":"select","options":["출하승인","보류","폐기"],"width":"half"},
  {"key":"approver","label":"승인자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-MD-05','고객불만 처리 기록 (의료기기)','의료기기','MD','B','8.2.2','iso13485','starter',1720,
'[
  {"key":"complaint_number","label":"불만 번호","type":"text","required":true,"width":"half"},
  {"key":"receipt_date","label":"접수일","type":"date","required":true,"width":"half"},
  {"key":"customer","label":"고객명/기관","type":"text","required":true,"width":"half"},
  {"key":"device_name","label":"기기명","type":"text","required":true,"width":"half"},
  {"key":"lot_number","label":"LOT번호","type":"text","width":"half"},
  {"key":"complaint_type","label":"불만 유형","type":"select","options":["성능불량","오작동","포장불량","라벨오류","기타"],"width":"half"},
  {"key":"mdr_required","label":"MDR 보고 필요","type":"select","options":["필요","불필요","검토중"],"width":"half"},
  {"key":"description","label":"불만 내용","type":"textarea","required":true,"width":"full"},
  {"key":"investigation","label":"조사 결과","type":"textarea","width":"full"},
  {"key":"root_cause","label":"근본 원인","type":"textarea","width":"full"},
  {"key":"corrective_action","label":"시정 조치","type":"textarea","width":"full"},
  {"key":"fsca_required","label":"FSCA 필요","type":"select","options":["필요","불필요"],"width":"half"},
  {"key":"complete_date","label":"처리 완료일","type":"date","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-MD-06','공급자 자격인정 기록 (의료기기)','의료기기','MD','B','7.4.1','iso13485','starter',1730,
'[
  {"key":"supplier_name","label":"공급자명","type":"text","required":true,"width":"half"},
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"supply_item","label":"공급 품목","type":"text","width":"half"},
  {"key":"criticality","label":"중요도","type":"select","options":["중요(Critical)","주요(Major)","일반(Minor)"],"width":"half"},
  {"key":"eval_items","label":"평가 항목","type":"table","columns":[
    {"key":"category","label":"평가 구분","width":120},
    {"key":"item","label":"평가 항목","width":200},
    {"key":"score","label":"점수(0-5)","width":90},
    {"key":"note","label":"비고","width":200}
  ]},
  {"key":"total_score","label":"총점","type":"number","width":"half"},
  {"key":"result","label":"평가 결과","type":"select","options":["승인","조건부승인","보류","탈락"],"width":"half"},
  {"key":"conditions","label":"조건부 승인 조건","type":"textarea","width":"full"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-MD-07','의료기기 부적합 보고서','의료기기','MD','B','8.3','iso13485','starter',1740,
'[
  {"key":"report_number","label":"보고서 번호","type":"text","required":true,"width":"half"},
  {"key":"date","label":"발생일","type":"date","required":true,"width":"half"},
  {"key":"device_name","label":"기기명","type":"text","required":true,"width":"half"},
  {"key":"lot_number","label":"LOT번호","type":"text","width":"half"},
  {"key":"detection_stage","label":"발견 단계","type":"select","options":["수입검사","공정검사","최종검사","출하후"],"width":"half"},
  {"key":"nonconformity","label":"부적합 내용","type":"textarea","required":true,"width":"full"},
  {"key":"affected_quantity","label":"영향 수량","type":"number","width":"half"},
  {"key":"disposition","label":"처리방법","type":"select","options":["재작업","특채","폐기","반품","격리"],"width":"half"},
  {"key":"disposition_detail","label":"처리 내용","type":"textarea","width":"full"},
  {"key":"capa_required","label":"CAPA 발행","type":"select","options":["필요","불필요"],"width":"half"},
  {"key":"handler","label":"처리자","type":"text","width":"half"},
  {"key":"approver","label":"승인자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-MD-08','임상평가 기록','의료기기','MD','B','7.3.6','iso13485','starter',1750,
'[
  {"key":"device_name","label":"기기명","type":"text","required":true,"width":"half"},
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"intended_use","label":"사용목적","type":"textarea","width":"full"},
  {"key":"clinical_data","label":"임상 데이터 출처","type":"textarea","width":"full"},
  {"key":"safety_evaluation","label":"안전성 평가","type":"textarea","width":"full"},
  {"key":"performance_evaluation","label":"성능 평가","type":"textarea","width":"full"},
  {"key":"benefit_risk","label":"이익-위험 분석","type":"textarea","width":"full"},
  {"key":"conclusion","label":"결론","type":"textarea","width":"full"},
  {"key":"next_review_date","label":"차기 검토일","type":"date","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-MD-09','의료기기 내부심사 체크리스트','의료기기','MD','D','8.2.4','iso13485','starter',1760,
'[
  {"key":"audit_date","label":"심사일","type":"date","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","required":true,"width":"half"},
  {"key":"items","label":"심사 항목","type":"table","columns":[
    {"key":"iso_clause","label":"ISO 조항","width":100},
    {"key":"check_item","label":"심사 항목","width":280},
    {"key":"result","label":"C/NC/OBS","width":100},
    {"key":"evidence","label":"증거/비고","width":200}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AI-01','AI 시스템 등록부','AI경영','AI','B','6.1.2','iso42001','starter',1770,
'[
  {"key":"revision_date","label":"작성/개정일","type":"date","width":"half"},
  {"key":"manager","label":"작성자","type":"text","width":"half"},
  {"key":"ai_systems","label":"AI 시스템 목록","type":"table","columns":[
    {"key":"system_id","label":"시스템ID","width":100},
    {"key":"system_name","label":"AI 시스템명","width":150},
    {"key":"ai_type","label":"AI 유형","width":120},
    {"key":"purpose","label":"사용목적","width":150},
    {"key":"risk_level","label":"위험등급","width":90},
    {"key":"owner","label":"책임자","width":100},
    {"key":"deployment_date","label":"배포일","width":100},
    {"key":"status","label":"상태","width":80},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AI-02','AI 영향평가서 (AIIA)','AI경영','AI','B','6.1.2','iso42001','starter',1780,
'[
  {"key":"system_name","label":"AI 시스템명","type":"text","required":true,"width":"half"},
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"purpose","label":"AI 사용목적 및 범위","type":"textarea","width":"full"},
  {"key":"stakeholders","label":"영향받는 이해관계자","type":"textarea","width":"full"},
  {"key":"impacts","label":"영향 평가","type":"table","columns":[
    {"key":"category","label":"영향 구분","width":120},
    {"key":"description","label":"영향 내용","width":200},
    {"key":"severity","label":"심각도","width":80},
    {"key":"probability","label":"가능성","width":80},
    {"key":"risk_level","label":"위험수준","width":90},
    {"key":"mitigation","label":"완화방안","width":180}
  ]},
  {"key":"overall_risk","label":"전체 위험 평가","type":"select","options":["낮음","중간","높음","매우높음"],"width":"half"},
  {"key":"recommendation","label":"권고사항","type":"textarea","width":"full"},
  {"key":"approval","label":"승인 여부","type":"select","options":["승인","조건부승인","반려"],"width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AI-03','AI 리스크 평가서','AI경영','AI','B','6.1.2','iso42001','starter',1790,
'[
  {"key":"system_name","label":"AI 시스템명","type":"text","required":true,"width":"half"},
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"risks","label":"AI 리스크 평가","type":"table","columns":[
    {"key":"risk_category","label":"리스크 유형","width":120},
    {"key":"risk_description","label":"리스크 내용","width":180},
    {"key":"likelihood","label":"발생가능성(1-5)","width":110},
    {"key":"impact","label":"영향도(1-5)","width":90},
    {"key":"risk_score","label":"위험도","width":70},
    {"key":"existing_control","label":"현재 통제방안","width":150},
    {"key":"additional_control","label":"추가 통제방안","width":150},
    {"key":"owner","label":"담당자","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AI-04','AI 적용성 보고서 (AoA)','AI경영','AI','B','6.1.3','iso42001','starter',1800,
'[
  {"key":"revision_date","label":"작성일","type":"date","required":true,"width":"half"},
  {"key":"manager","label":"작성자","type":"text","width":"half"},
  {"key":"controls","label":"AI 통제항목 적용성","type":"table","columns":[
    {"key":"annex_ref","label":"Annex A 참조","width":100},
    {"key":"control_name","label":"통제항목명","width":200},
    {"key":"applicable","label":"적용여부(Y/N)","width":100},
    {"key":"reason","label":"적용/제외 근거","width":200},
    {"key":"implementation","label":"구현방법","width":150},
    {"key":"status","label":"구현상태","width":90}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AI-05','AI 성과 모니터링 기록','AI경영','AI','D','9.1','iso42001','starter',1810,
'[
  {"key":"record_month","label":"기록 월","type":"text","required":true,"width":"half"},
  {"key":"system_name","label":"AI 시스템명","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"monitoring","label":"성과 모니터링 기록","type":"table","columns":[
    {"key":"metric","label":"성과지표","width":150},
    {"key":"target","label":"목표값","width":100},
    {"key":"actual","label":"실측값","width":100},
    {"key":"unit","label":"단위","width":60},
    {"key":"result","label":"달성여부","width":90},
    {"key":"drift_detected","label":"드리프트감지","width":100},
    {"key":"action","label":"조치사항","width":150}
  ]},
  {"key":"bias_check","label":"편향성 점검 결과","type":"textarea","width":"full"},
  {"key":"overall_assessment","label":"종합 평가","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AI-06','AI 사고·이상 보고서','AI경영','AI','B','10.2','iso42001','starter',1820,
'[
  {"key":"report_number","label":"보고서 번호","type":"text","required":true,"width":"half"},
  {"key":"occurrence_date","label":"발생일시","type":"text","required":true,"width":"half"},
  {"key":"system_name","label":"AI 시스템명","type":"text","required":true,"width":"half"},
  {"key":"incident_type","label":"사고 유형","type":"select","options":["편향발생","성능저하","오작동","개인정보침해","보안사고","기타"],"width":"half"},
  {"key":"severity","label":"심각도","type":"select","options":["긴급","높음","중간","낮음"],"width":"half"},
  {"key":"affected_users","label":"영향받은 사용자","type":"text","width":"half"},
  {"key":"description","label":"사고 내용","type":"textarea","required":true,"width":"full"},
  {"key":"root_cause","label":"원인 분석","type":"textarea","width":"full"},
  {"key":"immediate_action","label":"즉각 조치","type":"textarea","width":"full"},
  {"key":"corrective_action","label":"재발 방지 대책","type":"textarea","width":"full"},
  {"key":"reporter","label":"보고자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AI-07','AI 내부심사 체크리스트','AI경영','AI','D','9.2','iso42001','starter',1830,
'[
  {"key":"audit_date","label":"심사일","type":"date","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","required":true,"width":"half"},
  {"key":"system_name","label":"심사 대상 AI 시스템","type":"text","width":"half"},
  {"key":"items","label":"심사 항목","type":"table","columns":[
    {"key":"iso_clause","label":"ISO 조항","width":100},
    {"key":"check_item","label":"심사 항목","width":280},
    {"key":"result","label":"C/NC/OBS","width":100},
    {"key":"evidence","label":"증거/비고","width":200}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-NQ-01','ITNS 품목/용역 등록부','원자력품질','NQ','B','7.1.6','iso19443','starter',1840,
'[
  {"key":"revision_date","label":"작성/개정일","type":"date","width":"half"},
  {"key":"manager","label":"작성자","type":"text","width":"half"},
  {"key":"items","label":"ITNS 품목/용역 목록","type":"table","columns":[
    {"key":"item_code","label":"품목코드","width":100},
    {"key":"item_name","label":"품목/용역명","width":180},
    {"key":"quality_grade","label":"품질등급(Q1/Q2/Q3)","width":130},
    {"key":"safety_classification","label":"안전분류","width":100},
    {"key":"applicable_standard","label":"적용규격","width":150},
    {"key":"supplier","label":"공급자","width":120},
    {"key":"cgi_flag","label":"일반규격품(CGI)","width":100},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-NQ-02','안전문화 평가서','원자력품질','NQ','B','5.1','iso19443','starter',1850,
'[
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"eval_period","label":"평가 기간","type":"text","width":"half"},
  {"key":"safety_culture_items","label":"안전문화 평가 항목","type":"table","columns":[
    {"key":"category","label":"구분","width":120},
    {"key":"item","label":"평가 항목","width":250},
    {"key":"score","label":"점수(1-5)","width":90},
    {"key":"evidence","label":"근거","width":200},
    {"key":"note","label":"개선사항","width":150}
  ]},
  {"key":"total_score","label":"총점","type":"number","width":"half"},
  {"key":"overall_assessment","label":"종합 평가","type":"textarea","width":"full"},
  {"key":"improvement_plan","label":"개선 계획","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-NQ-03','품질등급 분류표','원자력품질','NQ','B','7.1.4','iso19443','starter',1860,
'[
  {"key":"revision_date","label":"작성일","type":"date","width":"half"},
  {"key":"manager","label":"작성자","type":"text","width":"half"},
  {"key":"classifications","label":"품질등급 분류","type":"table","columns":[
    {"key":"item_name","label":"품목/용역명","width":180},
    {"key":"function","label":"기능","width":150},
    {"key":"safety_class","label":"안전등급","width":100},
    {"key":"quality_grade","label":"품질등급","width":100},
    {"key":"seismic_class","label":"내진등급","width":100},
    {"key":"applicable_code","label":"적용코드","width":150},
    {"key":"basis","label":"분류근거","width":180}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-NQ-04','위변조 방지 관리 기록 (CGI)','원자력품질','NQ','B','7.4.3','iso19443','starter',1870,
'[
  {"key":"record_date","label":"기록일","type":"date","required":true,"width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"cgi_items","label":"CGI 관리 기록","type":"table","columns":[
    {"key":"item_name","label":"품목명","width":150},
    {"key":"part_number","label":"부품번호","width":130},
    {"key":"supplier","label":"공급자","width":130},
    {"key":"receipt_date","label":"입고일","width":100},
    {"key":"verification_method","label":"검증방법","width":150},
    {"key":"authenticity_result","label":"진위확인 결과","width":120},
    {"key":"action","label":"조치사항","width":150}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-NQ-05','원자력 공급자 자격인정 기록','원자력품질','NQ','B','8.4.1','iso19443','starter',1880,
'[
  {"key":"supplier_name","label":"공급자명","type":"text","required":true,"width":"half"},
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"supply_item","label":"공급 품목/용역","type":"text","width":"half"},
  {"key":"quality_grade","label":"해당 품질등급","type":"select","options":["Q1","Q2","Q3"],"width":"half"},
  {"key":"eval_type","label":"평가 유형","type":"select","options":["서면평가","현장심사","시험평가"],"width":"half"},
  {"key":"eval_items","label":"평가 항목","type":"table","columns":[
    {"key":"category","label":"평가 구분","width":120},
    {"key":"item","label":"평가 항목","width":200},
    {"key":"result","label":"결과(적합/부적합)","width":120},
    {"key":"note","label":"비고","width":200}
  ]},
  {"key":"overall_result","label":"종합 평가 결과","type":"select","options":["승인","조건부승인","반려"],"width":"half"},
  {"key":"valid_period","label":"유효기간","type":"text","width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-NQ-06','핵안전 내부심사 체크리스트','원자력품질','NQ','D','9.2','iso19443','starter',1890,
'[
  {"key":"audit_date","label":"심사일","type":"date","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","required":true,"width":"half"},
  {"key":"items","label":"심사 항목","type":"table","columns":[
    {"key":"iso_clause","label":"ISO 조항","width":100},
    {"key":"check_item","label":"심사 항목","width":280},
    {"key":"result","label":"C/NC/OBS","width":100},
    {"key":"evidence","label":"증거/비고","width":200}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-NQ-07','독립적 품질감사 기록','원자력품질','NQ','B','8.2.2','iso19443','starter',1900,
'[
  {"key":"audit_number","label":"감사번호","type":"text","required":true,"width":"half"},
  {"key":"audit_date","label":"감사일","type":"date","required":true,"width":"half"},
  {"key":"audit_scope","label":"감사 범위","type":"text","required":true,"width":"full"},
  {"key":"lead_auditor","label":"주임감사원","type":"text","width":"half"},
  {"key":"independence_confirmed","label":"독립성 확인","type":"select","options":["확인됨","미확인"],"width":"half"},
  {"key":"findings","label":"감사 발견사항","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"category","label":"구분(NC/OBS/FI)","width":120},
    {"key":"finding","label":"발견사항","width":250},
    {"key":"iso_clause","label":"관련 조항","width":100},
    {"key":"due_date","label":"조치기한","width":120}
  ]},
  {"key":"overall_conclusion","label":"종합 결론","type":"textarea","width":"full"},
  {"key":"follow_up_required","label":"후속조치 필요","type":"select","options":["필요","불필요"],"width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ── ISO 22000 식품안전 (F-FS-11 ~ F-FS-16) ────────────────────

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-FS-11','제품 설명서','식품안전','FS','B','7.3','iso22000','starter',1910,
'[
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"product_code","label":"제품코드","type":"text","width":"half"},
  {"key":"category","label":"제품 유형","type":"text","width":"half"},
  {"key":"established_date","label":"작성일","type":"date","width":"half"},
  {"key":"intended_use","label":"제품의 의도된 용도","type":"textarea","width":"full"},
  {"key":"consumer","label":"소비자/사용자","type":"text","width":"half"},
  {"key":"ingredients","label":"원재료 및 성분","type":"table","columns":[
    {"key":"ingredient","label":"원재료명","width":150},
    {"key":"spec","label":"규격","width":120},
    {"key":"ratio","label":"배합비율(%)","width":100},
    {"key":"supplier","label":"공급업체","width":130},
    {"key":"allergen","label":"알레르겐여부","width":100},
    {"key":"note","label":"비고","width":120}
  ]},
  {"key":"packaging","label":"포장 형태 및 재질","type":"textarea","width":"full"},
  {"key":"storage_condition","label":"보관 조건","type":"text","width":"half"},
  {"key":"shelf_life","label":"유통기한/소비기한","type":"text","width":"half"},
  {"key":"labeling","label":"라벨링 요구사항","type":"textarea","width":"full"},
  {"key":"distribution_method","label":"유통 방법","type":"text","width":"full"},
  {"key":"food_safety_hazards","label":"식품안전 관련 위해요소","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-FS-12','공정흐름도 확인 기록','식품안전','FS','B','8.5.1','iso22000','starter',1920,
'[
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"confirm_date","label":"확인일","type":"date","required":true,"width":"half"},
  {"key":"confirm_team","label":"확인 팀원","type":"textarea","width":"full"},
  {"key":"process_steps","label":"공정 단계별 확인","type":"table","columns":[
    {"key":"step_no","label":"단계번호","width":80},
    {"key":"process_name","label":"공정명","width":150},
    {"key":"input_material","label":"투입 원료/재료","width":150},
    {"key":"process_condition","label":"공정 조건","width":150},
    {"key":"output","label":"산출물","width":120},
    {"key":"confirmed","label":"현장확인(Y/N)","width":100},
    {"key":"note","label":"특이사항","width":120}
  ]},
  {"key":"deviation","label":"흐름도와 실제 차이점","type":"textarea","width":"full"},
  {"key":"update_required","label":"흐름도 수정 필요","type":"select","options":["필요없음","수정필요"],"width":"half"},
  {"key":"confirmed_by","label":"확인책임자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-FS-13','연간 검증 계획서','식품안전','FS','C','8.8.3','iso22000','starter',1930,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"plan","label":"연간 검증 계획","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"verification_item","label":"검증 항목","width":200},
    {"key":"method","label":"검증 방법","width":150},
    {"key":"frequency","label":"주기","width":80},
    {"key":"responsible","label":"담당자","width":100},
    {"key":"jan","label":"1월","width":50},
    {"key":"feb","label":"2월","width":50},
    {"key":"mar","label":"3월","width":50},
    {"key":"apr","label":"4월","width":50},
    {"key":"may","label":"5월","width":50},
    {"key":"jun","label":"6월","width":50},
    {"key":"jul","label":"7월","width":50},
    {"key":"aug","label":"8월","width":50},
    {"key":"sep","label":"9월","width":50},
    {"key":"oct","label":"10월","width":50},
    {"key":"nov","label":"11월","width":50},
    {"key":"dec","label":"12월","width":50}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-FS-14','검증 결과 보고서','식품안전','FS','B','8.8.3','iso22000','starter',1940,
'[
  {"key":"report_number","label":"보고서 번호","type":"text","required":true,"width":"half"},
  {"key":"verification_date","label":"검증일","type":"date","required":true,"width":"half"},
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"verifier","label":"검증자","type":"text","width":"half"},
  {"key":"verification_scope","label":"검증 범위","type":"textarea","width":"full"},
  {"key":"results","label":"검증 결과","type":"table","columns":[
    {"key":"item","label":"검증 항목","width":200},
    {"key":"method","label":"검증 방법","width":150},
    {"key":"criterion","label":"판정 기준","width":150},
    {"key":"result","label":"검증 결과","width":150},
    {"key":"judgment","label":"판정(적합/부적합)","width":120},
    {"key":"note","label":"비고","width":120}
  ]},
  {"key":"overall_conclusion","label":"종합 결론","type":"select","options":["HACCP시스템 유효","부분 수정 필요","전면 재검토 필요"],"width":"half"},
  {"key":"corrective_action","label":"필요 시정조치","type":"textarea","width":"full"},
  {"key":"approval","label":"승인자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-FS-15','HACCP팀 구성 및 이력','식품안전','FS','B','7.3.2','iso22000','starter',1950,
'[
  {"key":"established_date","label":"팀 구성일","type":"date","width":"half"},
  {"key":"team_leader","label":"식품안전팀장","type":"text","required":true,"width":"half"},
  {"key":"members","label":"팀원 현황","type":"table","columns":[
    {"key":"name","label":"성명","width":100},
    {"key":"dept","label":"부서","width":100},
    {"key":"position","label":"직위","width":100},
    {"key":"role","label":"담당 역할","width":150},
    {"key":"expertise","label":"전문 분야","width":150},
    {"key":"training_date","label":"교육이수일","width":120},
    {"key":"note","label":"비고","width":100}
  ]},
  {"key":"team_responsibilities","label":"팀 책임 및 권한","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-FS-16','원부재료 위해요소 분석 목록표','식품안전','FS','B','8.5.2','iso22000','starter',1960,
'[
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"analysis_date","label":"분석일","type":"date","required":true,"width":"half"},
  {"key":"analyst","label":"분석자","type":"text","width":"half"},
  {"key":"materials","label":"원부재료별 위해요소 분석","type":"table","columns":[
    {"key":"material_name","label":"원부재료명","width":150},
    {"key":"supplier","label":"공급업체","width":120},
    {"key":"bio_hazard","label":"생물학적 위해요소","width":150},
    {"key":"chem_hazard","label":"화학적 위해요소","width":150},
    {"key":"phy_hazard","label":"물리적 위해요소","width":150},
    {"key":"control_measure","label":"관리방안","width":150},
    {"key":"significance","label":"유의성(Y/N)","width":90}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ── ISO 22301 사업연속성 (F-BC-09 ~ F-BC-10) ──────────────────

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-BC-09','위기 커뮤니케이션 계획서','사업연속성','BC','B','8.4.2','iso22301','starter',1970,
'[
  {"key":"plan_date","label":"수립일","type":"date","required":true,"width":"half"},
  {"key":"owner","label":"책임자","type":"text","width":"half"},
  {"key":"stakeholders","label":"이해관계자별 커뮤니케이션 계획","type":"table","columns":[
    {"key":"stakeholder","label":"이해관계자","width":120},
    {"key":"contact_info","label":"연락처","width":150},
    {"key":"message","label":"전달 메시지","width":200},
    {"key":"channel","label":"커뮤니케이션 채널","width":130},
    {"key":"timing","label":"전달 시기","width":120},
    {"key":"responsible","label":"담당자","width":100}
  ]},
  {"key":"media_response","label":"미디어 대응 지침","type":"textarea","width":"full"},
  {"key":"do_not_say","label":"금지 발언 목록","type":"textarea","width":"full"},
  {"key":"spokesperson","label":"공식 대변인","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-BC-10','공급망 연속성 평가서','사업연속성','BC','B','8.2.3','iso22301','starter',1980,
'[
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"suppliers","label":"핵심 공급자 연속성 평가","type":"table","columns":[
    {"key":"supplier_name","label":"공급자명","width":150},
    {"key":"supply_item","label":"공급 품목","width":150},
    {"key":"criticality","label":"중요도(상/중/하)","width":100},
    {"key":"single_source","label":"단일공급 여부","width":100},
    {"key":"alternative","label":"대체 공급자","width":150},
    {"key":"bcp_confirmed","label":"BCP 보유확인","width":100},
    {"key":"risk_level","label":"위험수준","width":90},
    {"key":"mitigation","label":"위험완화방안","width":150}
  ]},
  {"key":"overall_assessment","label":"종합 평가","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ── ISO 13485 의료기기 (F-MD-10 ~ F-MD-13) ────────────────────

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-MD-10','의료기기 등록 현황표','의료기기','MD','B','4.2.3','iso13485','starter',1990,
'[
  {"key":"revision_date","label":"작성/개정일","type":"date","width":"half"},
  {"key":"manager","label":"작성자","type":"text","width":"half"},
  {"key":"devices","label":"의료기기 목록","type":"table","columns":[
    {"key":"device_name","label":"기기명","width":150},
    {"key":"model","label":"모델명","width":120},
    {"key":"device_class","label":"등급(1~4)","width":80},
    {"key":"registration_no","label":"허가/신고번호","width":150},
    {"key":"registration_date","label":"허가일","width":120},
    {"key":"expiry_date","label":"만료일","width":120},
    {"key":"intended_use","label":"사용목적","width":150},
    {"key":"status","label":"상태","width":80}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-MD-11','라벨링 검토 기록','의료기기','MD','B','7.5.8','iso13485','starter',2000,
'[
  {"key":"device_name","label":"기기명","type":"text","required":true,"width":"half"},
  {"key":"review_date","label":"검토일","type":"date","required":true,"width":"half"},
  {"key":"reviewer","label":"검토자","type":"text","width":"half"},
  {"key":"version","label":"라벨 버전","type":"text","width":"half"},
  {"key":"review_items","label":"라벨링 검토 항목","type":"table","columns":[
    {"key":"item","label":"검토 항목","width":200},
    {"key":"requirement","label":"요구사항","width":200},
    {"key":"result","label":"검토결과(적합/부적합)","width":130},
    {"key":"note","label":"비고","width":150}
  ]},
  {"key":"udi_confirmed","label":"UDI 표시 확인","type":"select","options":["확인됨","해당없음","미확인"],"width":"half"},
  {"key":"overall_result","label":"종합 결과","type":"select","options":["승인","수정필요","반려"],"width":"half"},
  {"key":"approver","label":"승인자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-MD-12','추적성 관리 기록 (의료기기)','의료기기','MD','D','7.5.9','iso13485','starter',2010,
'[
  {"key":"record_date","label":"기록일","type":"date","required":true,"width":"half"},
  {"key":"manager","label":"담당자","type":"text","width":"half"},
  {"key":"records","label":"추적성 기록","type":"table","columns":[
    {"key":"udi","label":"UDI/일련번호","width":150},
    {"key":"device_name","label":"기기명","width":150},
    {"key":"lot_number","label":"제조번호/LOT","width":130},
    {"key":"manufacture_date","label":"제조일","width":100},
    {"key":"material_lot","label":"원자재LOT","width":130},
    {"key":"sterilization_lot","label":"멸균LOT","width":120},
    {"key":"ship_date","label":"출하일","width":100},
    {"key":"customer","label":"납품처","width":130},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-MD-13','설계 변경 관리서','의료기기','MD','B','7.3.9','iso13485','starter',2020,
'[
  {"key":"change_number","label":"변경번호","type":"text","required":true,"width":"half"},
  {"key":"change_date","label":"변경요청일","type":"date","required":true,"width":"half"},
  {"key":"device_name","label":"기기명","type":"text","required":true,"width":"half"},
  {"key":"requester","label":"요청자","type":"text","width":"half"},
  {"key":"change_type","label":"변경 유형","type":"select","options":["설계변경","원자재변경","공정변경","소프트웨어변경","라벨변경","기타"],"width":"half"},
  {"key":"change_description","label":"변경 내용","type":"textarea","required":true,"width":"full"},
  {"key":"change_reason","label":"변경 이유","type":"textarea","width":"full"},
  {"key":"impact_assessment","label":"영향 평가","type":"table","columns":[
    {"key":"area","label":"영향 분야","width":150},
    {"key":"impact","label":"영향 내용","width":200},
    {"key":"action_required","label":"필요 조치","width":200}
  ]},
  {"key":"regulatory_impact","label":"규제 영향 (허가변경 필요여부)","type":"select","options":["허가변경필요","신고필요","해당없음"],"width":"half"},
  {"key":"validation_required","label":"검증/유효성확인 필요","type":"select","options":["필요","불필요"],"width":"half"},
  {"key":"approver","label":"승인자","type":"text","width":"half"},
  {"key":"implementation_date","label":"적용일","type":"date","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ── ISO 42001 AI경영 (F-AI-08 ~ F-AI-09) ─────────────────────

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AI-08','AI 공급자 평가서','AI경영','AI','B','8.4','iso42001','starter',2030,
'[
  {"key":"supplier_name","label":"AI 공급자명","type":"text","required":true,"width":"half"},
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"ai_system","label":"공급 AI 시스템","type":"text","width":"half"},
  {"key":"ai_type","label":"AI 유형","type":"text","width":"half"},
  {"key":"eval_items","label":"평가 항목","type":"table","columns":[
    {"key":"category","label":"평가 구분","width":120},
    {"key":"item","label":"평가 항목","width":200},
    {"key":"score","label":"점수(1-5)","width":90},
    {"key":"evidence","label":"근거","width":200},
    {"key":"note","label":"비고","width":120}
  ]},
  {"key":"transparency","label":"투명성 평가","type":"textarea","width":"full"},
  {"key":"bias_risk","label":"편향·차별 위험 평가","type":"textarea","width":"full"},
  {"key":"data_governance","label":"데이터 거버넌스","type":"textarea","width":"full"},
  {"key":"overall_result","label":"평가 결과","type":"select","options":["승인","조건부승인","반려"],"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AI-09','AI 윤리 검토 기록','AI경영','AI','B','6.1.2','iso42001','starter',2040,
'[
  {"key":"system_name","label":"AI 시스템명","type":"text","required":true,"width":"half"},
  {"key":"review_date","label":"검토일","type":"date","required":true,"width":"half"},
  {"key":"reviewer","label":"검토자","type":"text","width":"half"},
  {"key":"ethics_items","label":"AI 윤리 검토 항목","type":"table","columns":[
    {"key":"principle","label":"윤리 원칙","width":150},
    {"key":"check_item","label":"검토 항목","width":200},
    {"key":"result","label":"결과(적합/부적합/N/A)","width":130},
    {"key":"evidence","label":"근거","width":180},
    {"key":"action","label":"조치사항","width":150}
  ]},
  {"key":"fairness_assessment","label":"공정성·차별금지 평가","type":"textarea","width":"full"},
  {"key":"transparency_assessment","label":"투명성·설명가능성 평가","type":"textarea","width":"full"},
  {"key":"privacy_assessment","label":"개인정보 보호 평가","type":"textarea","width":"full"},
  {"key":"overall_conclusion","label":"종합 결론","type":"textarea","width":"full"},
  {"key":"approval","label":"승인 여부","type":"select","options":["승인","조건부승인","반려"],"width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ── ISO 22716 화장품GMP (F-CG-01 ~ F-CG-13) ──────────────────

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CG-01','제조 배치 기록서','화장품GMP','CG','B','7','iso22716','starter',2050,
'[
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"product_code","label":"제품코드","type":"text","width":"half"},
  {"key":"batch_no","label":"배치번호","type":"text","required":true,"width":"half"},
  {"key":"manufacture_date","label":"제조일","type":"date","required":true,"width":"half"},
  {"key":"batch_size","label":"배치 규모","type":"text","width":"half"},
  {"key":"expiry_date","label":"사용기한","type":"date","width":"half"},
  {"key":"formula","label":"제조 배합","type":"table","columns":[
    {"key":"ingredient","label":"원료명","width":150},
    {"key":"code","label":"원료코드","width":100},
    {"key":"standard_amount","label":"기준량(g)","width":100},
    {"key":"actual_amount","label":"실제사용량(g)","width":110},
    {"key":"lot_no","label":"원료LOT","width":120},
    {"key":"operator","label":"작업자","width":100}
  ]},
  {"key":"process_records","label":"공정 기록","type":"table","columns":[
    {"key":"step","label":"공정단계","width":120},
    {"key":"time","label":"시간","width":80},
    {"key":"condition","label":"공정조건","width":150},
    {"key":"result","label":"결과","width":120},
    {"key":"operator","label":"작업자","width":100},
    {"key":"note","label":"특이사항","width":150}
  ]},
  {"key":"yield","label":"수율(%)","type":"number","width":"half"},
  {"key":"qc_result","label":"품질검사 결과","type":"select","options":["합격","불합격","재시험"],"width":"half"},
  {"key":"release_decision","label":"출하 결정","type":"select","options":["출하승인","보류","폐기"],"width":"half"},
  {"key":"approver","label":"품질책임자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CG-02','원자재 입고 검사 기록','화장품GMP','CG','B','5','iso22716','starter',2060,
'[
  {"key":"receipt_date","label":"입고일","type":"date","required":true,"width":"half"},
  {"key":"material_name","label":"원료명","type":"text","required":true,"width":"half"},
  {"key":"supplier","label":"공급업체","type":"text","required":true,"width":"half"},
  {"key":"lot_no","label":"원료 LOT","type":"text","required":true,"width":"half"},
  {"key":"quantity","label":"입고 수량","type":"text","width":"half"},
  {"key":"coa_confirmed","label":"COA 확인","type":"select","options":["확인됨","미첨부"],"width":"half"},
  {"key":"inspection_items","label":"검사 결과","type":"table","columns":[
    {"key":"item","label":"검사항목","width":150},
    {"key":"spec","label":"규격기준","width":150},
    {"key":"result","label":"검사결과","width":150},
    {"key":"unit","label":"단위","width":70},
    {"key":"judgment","label":"판정","width":80}
  ]},
  {"key":"overall_result","label":"종합 판정","type":"select","options":["합격","불합격","조건부합격"],"width":"half"},
  {"key":"storage_location","label":"보관 위치","type":"text","width":"half"},
  {"key":"inspector","label":"검사자","type":"text","width":"half"},
  {"key":"action","label":"불합격 처리","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CG-03','완제품 출하 검사 기록','화장품GMP','CG','B','6','iso22716','starter',2070,
'[
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"batch_no","label":"배치번호","type":"text","required":true,"width":"half"},
  {"key":"inspection_date","label":"검사일","type":"date","required":true,"width":"half"},
  {"key":"quantity","label":"검사 수량","type":"number","width":"half"},
  {"key":"inspection_items","label":"검사 결과","type":"table","columns":[
    {"key":"item","label":"검사항목","width":150},
    {"key":"spec","label":"규격기준","width":150},
    {"key":"result","label":"검사결과","width":150},
    {"key":"unit","label":"단위","width":70},
    {"key":"judgment","label":"판정","width":80}
  ]},
  {"key":"appearance","label":"외관 검사","type":"textarea","width":"full"},
  {"key":"label_check","label":"라벨 검토","type":"select","options":["이상없음","수정필요"],"width":"half"},
  {"key":"overall_result","label":"종합 판정","type":"select","options":["합격","불합격"],"width":"half"},
  {"key":"inspector","label":"검사자","type":"text","width":"half"},
  {"key":"release_approver","label":"출하 승인자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CG-04','설비 세척 검증 기록','화장품GMP','CG','D','4','iso22716','starter',2080,
'[
  {"key":"record_date","label":"기록일","type":"date","required":true,"width":"half"},
  {"key":"equipment_name","label":"설비명","type":"text","required":true,"width":"half"},
  {"key":"prev_product","label":"이전 생산 제품","type":"text","width":"half"},
  {"key":"next_product","label":"다음 생산 제품","type":"text","width":"half"},
  {"key":"cleaning_method","label":"세척 방법","type":"text","width":"half"},
  {"key":"cleaning_agent","label":"세척제","type":"text","width":"half"},
  {"key":"verification_items","label":"세척 검증 결과","type":"table","columns":[
    {"key":"item","label":"검증 항목","width":150},
    {"key":"method","label":"검증 방법","width":150},
    {"key":"criterion","label":"판정 기준","width":150},
    {"key":"result","label":"결과","width":120},
    {"key":"judgment","label":"판정(적합/부적합)","width":120}
  ]},
  {"key":"overall_result","label":"종합 판정","type":"select","options":["적합(생산가능)","부적합(재세척)"],"width":"half"},
  {"key":"verified_by","label":"검증자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CG-05','안정성 시험 기록','화장품GMP','CG','B','6','iso22716','starter',2090,
'[
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"batch_no","label":"배치번호","type":"text","width":"half"},
  {"key":"test_start_date","label":"시험 시작일","type":"date","required":true,"width":"half"},
  {"key":"test_type","label":"시험 유형","type":"select","options":["실시간안정성","가속안정성","가혹시험"],"width":"half"},
  {"key":"storage_condition","label":"보관 조건","type":"text","width":"half"},
  {"key":"test_period","label":"시험 기간","type":"text","width":"half"},
  {"key":"test_items","label":"시험 항목별 결과","type":"table","columns":[
    {"key":"item","label":"시험항목","width":150},
    {"key":"spec","label":"규격기준","width":150},
    {"key":"initial","label":"초기(0M)","width":90},
    {"key":"m1","label":"1M","width":70},
    {"key":"m3","label":"3M","width":70},
    {"key":"m6","label":"6M","width":70},
    {"key":"m12","label":"12M","width":70},
    {"key":"m24","label":"24M","width":70},
    {"key":"judgment","label":"판정","width":80}
  ]},
  {"key":"conclusion","label":"결론","type":"textarea","width":"full"},
  {"key":"shelf_life_determined","label":"결정된 사용기한","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CG-06','화장품 불만 처리 기록','화장품GMP','CG','B','12','iso22716','starter',2100,
'[
  {"key":"complaint_number","label":"불만 번호","type":"text","required":true,"width":"half"},
  {"key":"receipt_date","label":"접수일","type":"date","required":true,"width":"half"},
  {"key":"customer","label":"고객명","type":"text","width":"half"},
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"batch_no","label":"배치번호","type":"text","width":"half"},
  {"key":"complaint_type","label":"불만 유형","type":"select","options":["이물혼입","변색·변취","피부이상반응","포장불량","라벨오류","성능불만","기타"],"width":"half"},
  {"key":"severity","label":"심각도","type":"select","options":["중대(안전)","중간","경미"],"width":"half"},
  {"key":"description","label":"불만 내용","type":"textarea","required":true,"width":"full"},
  {"key":"sample_returned","label":"샘플 회수 여부","type":"select","options":["회수됨","회수불가","미요청"],"width":"half"},
  {"key":"investigation_result","label":"조사 결과","type":"textarea","width":"full"},
  {"key":"root_cause","label":"근본 원인","type":"textarea","width":"full"},
  {"key":"corrective_action","label":"시정 조치","type":"textarea","width":"full"},
  {"key":"recall_required","label":"리콜 필요 여부","type":"select","options":["필요","불필요"],"width":"half"},
  {"key":"complete_date","label":"처리 완료일","type":"date","width":"half"},
  {"key":"handler","label":"처리자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CG-07','리콜 계획서','화장품GMP','CG','B','13','iso22716','starter',2110,
'[
  {"key":"plan_date","label":"계획수립일","type":"date","required":true,"width":"half"},
  {"key":"responsible","label":"리콜 책임자","type":"text","width":"half"},
  {"key":"recall_team","label":"리콜 팀 구성","type":"table","columns":[
    {"key":"role","label":"역할","width":150},
    {"key":"name","label":"담당자","width":100},
    {"key":"dept","label":"부서","width":100},
    {"key":"contact","label":"연락처","width":150},
    {"key":"responsibility","label":"책임 사항","width":200}
  ]},
  {"key":"trigger_criteria","label":"리콜 발동 기준","type":"textarea","width":"full"},
  {"key":"recall_procedure","label":"리콜 절차","type":"table","columns":[
    {"key":"step","label":"단계","width":60},
    {"key":"action","label":"조치 내용","width":250},
    {"key":"responsible","label":"담당자","width":100},
    {"key":"timeline","label":"소요시간","width":100}
  ]},
  {"key":"notification_plan","label":"당국 보고 계획","type":"textarea","width":"full"},
  {"key":"mock_recall_date","label":"모의 리콜 실시일","type":"date","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CG-08','자체 검사 (내부심사) 체크리스트','화장품GMP','CG','D','16','iso22716','starter',2120,
'[
  {"key":"audit_date","label":"심사일","type":"date","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","required":true,"width":"half"},
  {"key":"audit_area","label":"심사 구역/부서","type":"text","width":"half"},
  {"key":"items","label":"GMP 자체검사 항목","type":"table","columns":[
    {"key":"clause","label":"GMP 조항","width":100},
    {"key":"check_item","label":"점검 항목","width":280},
    {"key":"result","label":"적합/부적합/N.A","width":120},
    {"key":"evidence","label":"증거/비고","width":200}
  ]},
  {"key":"findings","label":"주요 발견사항","type":"textarea","width":"full"},
  {"key":"capa_required","label":"CAPA 발행 필요","type":"select","options":["필요","불필요"],"width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CG-09','편차 보고서','화장품GMP','CG','B','14','iso22716','starter',2130,
'[
  {"key":"report_number","label":"보고서 번호","type":"text","required":true,"width":"half"},
  {"key":"occurrence_date","label":"발생일","type":"date","required":true,"width":"half"},
  {"key":"product_name","label":"제품명","type":"text","width":"half"},
  {"key":"batch_no","label":"배치번호","type":"text","width":"half"},
  {"key":"process_step","label":"발생 공정","type":"text","width":"half"},
  {"key":"deviation_type","label":"편차 유형","type":"select","options":["원료편차","공정편차","설비편차","환경편차","기타"],"width":"half"},
  {"key":"description","label":"편차 내용","type":"textarea","required":true,"width":"full"},
  {"key":"immediate_action","label":"즉각 조치","type":"textarea","width":"full"},
  {"key":"impact_assessment","label":"제품 품질 영향 평가","type":"textarea","width":"full"},
  {"key":"root_cause","label":"근본 원인 분석","type":"textarea","width":"full"},
  {"key":"disposition","label":"배치 처리 결정","type":"select","options":["정상출하","재작업후출하","폐기","추가조사"],"width":"half"},
  {"key":"capa_no","label":"CAPA 번호","type":"text","width":"half"},
  {"key":"approver","label":"품질책임자 승인","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CG-10','원자재 규격서','화장품GMP','CG','B','5','iso22716','starter',2140,
'[
  {"key":"material_name","label":"원료명","type":"text","required":true,"width":"half"},
  {"key":"material_code","label":"원료코드","type":"text","width":"half"},
  {"key":"inci_name","label":"INCI명","type":"text","width":"half"},
  {"key":"cas_no","label":"CAS번호","type":"text","width":"half"},
  {"key":"supplier","label":"공급업체","type":"text","required":true,"width":"half"},
  {"key":"origin","label":"원산지","type":"text","width":"half"},
  {"key":"specifications","label":"규격 기준","type":"table","columns":[
    {"key":"item","label":"시험항목","width":150},
    {"key":"criterion","label":"기준","width":200},
    {"key":"method","label":"시험방법","width":150},
    {"key":"unit","label":"단위","width":80}
  ]},
  {"key":"storage_condition","label":"보관 조건","type":"text","width":"half"},
  {"key":"shelf_life","label":"사용기한","type":"text","width":"half"},
  {"key":"allergen_info","label":"알레르겐 정보","type":"textarea","width":"full"},
  {"key":"regulatory_status","label":"규제 현황 (REACH/IFRA 등)","type":"textarea","width":"full"},
  {"key":"approved_date","label":"승인일","type":"date","width":"half"},
  {"key":"approver","label":"승인자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CG-11','제품 규격서','화장품GMP','CG','B','6','iso22716','starter',2150,
'[
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"product_code","label":"제품코드","type":"text","width":"half"},
  {"key":"version","label":"버전","type":"text","width":"half"},
  {"key":"approved_date","label":"승인일","type":"date","width":"half"},
  {"key":"product_type","label":"제품 유형","type":"text","width":"half"},
  {"key":"intended_use","label":"사용 목적","type":"text","width":"half"},
  {"key":"specifications","label":"제품 규격","type":"table","columns":[
    {"key":"item","label":"시험항목","width":150},
    {"key":"criterion","label":"기준","width":200},
    {"key":"method","label":"시험방법","width":150},
    {"key":"unit","label":"단위","width":80}
  ]},
  {"key":"appearance","label":"외관 기준","type":"textarea","width":"full"},
  {"key":"packaging_spec","label":"포장 규격","type":"textarea","width":"full"},
  {"key":"storage_condition","label":"보관 조건","type":"text","width":"half"},
  {"key":"shelf_life","label":"사용기한","type":"text","width":"half"},
  {"key":"approver","label":"품질책임자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CG-12','화장품 GMP 교육 기록','화장품GMP','CG','B','2','iso22716','starter',2160,
'[
  {"key":"training_date","label":"교육일","type":"date","required":true,"width":"half"},
  {"key":"title","label":"교육명","type":"text","required":true,"width":"half"},
  {"key":"trainer","label":"강사","type":"text","width":"half"},
  {"key":"duration","label":"교육 시간","type":"text","width":"half"},
  {"key":"content","label":"교육 내용","type":"textarea","width":"full"},
  {"key":"target","label":"교육 대상","type":"text","width":"full"},
  {"key":"attendees","label":"참석자 명단","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"name","label":"성명","width":100},
    {"key":"dept","label":"부서","width":100},
    {"key":"position","label":"직위","width":100},
    {"key":"sign","label":"서명","width":100},
    {"key":"score","label":"평가점수","width":90}
  ]},
  {"key":"evaluation_result","label":"교육 효과 평가","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CG-13','포장재 및 라벨 관리 기록','화장품GMP','CG','B','5','iso22716','starter',2170,
'[
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"batch_no","label":"배치번호","type":"text","required":true,"width":"half"},
  {"key":"packaging_date","label":"포장일","type":"date","required":true,"width":"half"},
  {"key":"operator","label":"작업자","type":"text","width":"half"},
  {"key":"packaging_materials","label":"포장재 사용 현황","type":"table","columns":[
    {"key":"material_name","label":"포장재명","width":150},
    {"key":"lot_no","label":"포장재LOT","width":120},
    {"key":"quantity_used","label":"사용량","width":90},
    {"key":"quantity_returned","label":"반환량","width":90},
    {"key":"quantity_rejected","label":"불량폐기량","width":100}
  ]},
  {"key":"line_clearance","label":"라인 청소 확인","type":"select","options":["확인됨","미확인"],"width":"half"},
  {"key":"label_check","label":"라벨 적합성 확인","type":"select","options":["적합","부적합"],"width":"half"},
  {"key":"reconciliation","label":"수지계산 결과","type":"textarea","width":"full"},
  {"key":"supervisor","label":"감독자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

-- ── 위험성평가 / 환경 / KPI / 심사 / 고객만족 / FMEA / 화장품 ─

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-KRAS-01','위험성평가표 (KRAS 공식)','환경안전','KRAS','D','8.1.2','iso45001','starter',2180,
'[
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"dept","label":"부서/공정","type":"text","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"manager","label":"관리감독자","type":"text","width":"half"},
  {"key":"items","label":"위험성평가","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"process_name","label":"공정(작업)명","width":130},
    {"key":"work_type","label":"작업구분(일상/비일상)","width":130},
    {"key":"hazard_source","label":"유해위험요인(기인물)","width":150},
    {"key":"occurrence_type","label":"발생형태","width":100},
    {"key":"exposed_workers","label":"노출근로자","width":90},
    {"key":"current_measure","label":"현재안전조치","width":150},
    {"key":"frequency","label":"빈도(1-3)","width":80},
    {"key":"severity","label":"강도(1-3)","width":80},
    {"key":"risk_level","label":"위험성수준(빈도x강도)","width":130},
    {"key":"risk_grade","label":"위험등급(상/중/하)","width":100},
    {"key":"additional_measure","label":"추가감소대책","width":150},
    {"key":"owner","label":"담당자","width":100},
    {"key":"due_date","label":"완료예정일","width":100},
    {"key":"new_frequency","label":"개선후빈도","width":90},
    {"key":"new_severity","label":"개선후강도","width":90},
    {"key":"new_risk","label":"개선후위험성","width":100}
  ]},
  {"key":"legal_basis","label":"법적근거 (산업안전보건법 제36조)","type":"text","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-KRAS-02','위험성평가 실시 계획서','환경안전','KRAS','C','8.1.2','iso45001','starter',2190,
'[
  {"key":"year","label":"평가 연도","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"안전보건관리책임자","type":"text","width":"half"},
  {"key":"eval_scope","label":"평가 범위","type":"textarea","width":"full"},
  {"key":"eval_method","label":"평가 방법","type":"select","options":["빈도강도법","체크리스트법","핵심요인기술법","위험가능성과중대성법"],"width":"half"},
  {"key":"schedule","label":"평가 일정","type":"table","columns":[
    {"key":"dept","label":"부서/공정","width":150},
    {"key":"eval_type","label":"평가유형(최초/정기/수시)","width":130},
    {"key":"planned_date","label":"계획일","width":120},
    {"key":"actual_date","label":"실시일","width":120},
    {"key":"evaluator","label":"평가팀","width":120},
    {"key":"status","label":"상태","width":80}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-ENV-01','환경측면 및 영향 평가표','환경안전','ENV','B','6.1.2','iso14001','starter',2200,
'[
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"process_name","label":"공정명","type":"text","required":true,"width":"half"},
  {"key":"eval_cycle","label":"평가주기","type":"select","options":["최초평가","정기평가(연1회)","수시평가"],"width":"half"},
  {"key":"aspects","label":"환경측면 및 영향 평가","type":"table","columns":[
    {"key":"no","label":"No","width":40},
    {"key":"activity","label":"활동/제품/서비스","width":130},
    {"key":"aspect","label":"환경측면","width":130},
    {"key":"impact","label":"환경영향","width":130},
    {"key":"condition","label":"발생조건(정상/비정상/긴급)","width":140},
    {"key":"scale","label":"규모(1-5)","width":80},
    {"key":"severity","label":"심각성(1-5)","width":90},
    {"key":"frequency","label":"빈도(1-5)","width":80},
    {"key":"significance_score","label":"유의성점수(규모x심각x빈도)","width":160},
    {"key":"legal_requirement","label":"법적요구(Y/N)","width":100},
    {"key":"stakeholder_concern","label":"이해관계자관심(Y/N)","width":120},
    {"key":"significant","label":"유의한환경측면(Y/N)","width":120},
    {"key":"control_measure","label":"관리방법","width":150}
  ]},
  {"key":"criteria","label":"유의성 판정기준","type":"text","width":"full","placeholder":"점수 15점 이상 또는 법적요구사항/이해관계자 관심사항은 유의한 환경측면으로 결정"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-KPI-01','프로세스 성과지표 관리표 (신호등)','경영관리','KPI','D','9.1.1','iso9001','starter',2210,
'[
  {"key":"year_month","label":"년/월","type":"text","required":true,"width":"half"},
  {"key":"dept","label":"팀/부서","type":"text","required":true,"width":"half"},
  {"key":"indicators","label":"성과지표 현황","type":"table","columns":[
    {"key":"process_code","label":"프로세스코드","width":100},
    {"key":"process_name","label":"프로세스명","width":130},
    {"key":"indicator","label":"성과지표","width":150},
    {"key":"formula","label":"계산식","width":150},
    {"key":"unit","label":"단위","width":60},
    {"key":"cycle","label":"관리주기","width":80},
    {"key":"target","label":"목표","width":80},
    {"key":"actual","label":"실적","width":80},
    {"key":"achievement","label":"달성율(%)","width":90},
    {"key":"signal","label":"신호등(G/Y/R)","width":100},
    {"key":"g_criteria","label":"G기준(100%)","width":100},
    {"key":"y_criteria","label":"Y기준(95%이상)","width":110},
    {"key":"r_criteria","label":"R기준(95%미만)","width":110},
    {"key":"action","label":"조치계획(R시)","width":150}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-KPI-02','연간 성과지표 목표 관리표','경영관리','KPI','C','6.2','iso9001','starter',2220,
'[
  {"key":"year","label":"연도","type":"text","required":true,"width":"half"},
  {"key":"manager","label":"작성자","type":"text","width":"half"},
  {"key":"kpis","label":"연간 KPI 목표 관리","type":"table","columns":[
    {"key":"process_name","label":"프로세스명","width":130},
    {"key":"indicator","label":"성과지표","width":150},
    {"key":"formula","label":"계산식","width":150},
    {"key":"unit","label":"단위","width":60},
    {"key":"prev_actual","label":"전년실적","width":90},
    {"key":"target","label":"금년목표","width":90},
    {"key":"q1","label":"1분기","width":80},
    {"key":"q2","label":"2분기","width":80},
    {"key":"q3","label":"3분기","width":80},
    {"key":"q4","label":"4분기","width":80},
    {"key":"annual_actual","label":"연간실적","width":90},
    {"key":"achievement","label":"달성율","width":80},
    {"key":"signal","label":"G/Y/R","width":70}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AUD-01','내부심사 체크리스트 (제조공정심사)','경영관리','AUD','D','9.2','iso9001','starter',2230,
'[
  {"key":"audit_date","label":"심사일","type":"date","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","required":true,"width":"half"},
  {"key":"process_name","label":"공정명","type":"text","required":true,"width":"half"},
  {"key":"line_name","label":"라인명","type":"text","width":"half"},
  {"key":"items","label":"제조공정 심사항목","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"doc_name","label":"관련문서명","width":150},
    {"key":"doc_no","label":"문서번호","width":120},
    {"key":"process_no","label":"공정번호","width":90},
    {"key":"check_item","label":"점검항목","width":200},
    {"key":"standard","label":"기준","width":150},
    {"key":"actual","label":"실제","width":150},
    {"key":"result","label":"판정(Y/N/NA)","width":100},
    {"key":"note","label":"심사및관찰내용","width":200}
  ]},
  {"key":"findings","label":"발견사항 요약","type":"textarea","width":"full"},
  {"key":"nc_count","label":"부적합 수","type":"number","width":"half"},
  {"key":"obs_count","label":"관찰사항 수","type":"number","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AUD-02','내부심사 체크리스트 (제품심사)','경영관리','AUD','D','9.2','iso9001','starter',2240,
'[
  {"key":"audit_date","label":"심사일","type":"date","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","required":true,"width":"half"},
  {"key":"product_name","label":"심사대상 제품명","type":"text","required":true,"width":"half"},
  {"key":"lot_number","label":"LOT번호","type":"text","width":"half"},
  {"key":"items","label":"제품심사 항목","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"check_item","label":"심사항목","width":200},
    {"key":"criterion","label":"판정기준","width":150},
    {"key":"result","label":"검사결과","width":150},
    {"key":"judgment","label":"판정(Y/N/NA)","width":100},
    {"key":"note","label":"비고","width":150}
  ]},
  {"key":"overall_result","label":"종합 판정","type":"select","options":["적합","부적합","조건부적합"],"width":"half"},
  {"key":"findings","label":"발견사항","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CS-01','고객만족도 평가서 (부문별)','고객영업','CS','B','9.1.2','iso9001','starter',2250,
'[
  {"key":"eval_year","label":"평가 연도","type":"text","required":true,"width":"half"},
  {"key":"customer_name","label":"고객사명","type":"text","required":true,"width":"half"},
  {"key":"eval_date","label":"평가일","type":"date","width":"half"},
  {"key":"evaluator","label":"평가담당자","type":"text","width":"half"},
  {"key":"delivery_score","label":"납기부문 (30점)","type":"table","columns":[
    {"key":"item","label":"평가항목","width":200},
    {"key":"criteria_5","label":"5점기준","width":150},
    {"key":"criteria_3","label":"3점기준","width":150},
    {"key":"criteria_1","label":"1점기준","width":150},
    {"key":"score","label":"점수","width":80},
    {"key":"weight","label":"가중치","width":80},
    {"key":"weighted_score","label":"가중점수","width":90}
  ]},
  {"key":"quality_score","label":"품질부문 (40점)","type":"table","columns":[
    {"key":"item","label":"평가항목","width":200},
    {"key":"criteria_5","label":"5점기준","width":150},
    {"key":"criteria_3","label":"3점기준","width":150},
    {"key":"criteria_1","label":"1점기준","width":150},
    {"key":"score","label":"점수","width":80},
    {"key":"weight","label":"가중치","width":80},
    {"key":"weighted_score","label":"가중점수","width":90}
  ]},
  {"key":"service_score","label":"서비스부문 (30점)","type":"table","columns":[
    {"key":"item","label":"평가항목","width":200},
    {"key":"criteria_5","label":"5점기준","width":150},
    {"key":"criteria_3","label":"3점기준","width":150},
    {"key":"criteria_1","label":"1점기준","width":150},
    {"key":"score","label":"점수","width":80},
    {"key":"weight","label":"가중치","width":80},
    {"key":"weighted_score","label":"가중점수","width":90}
  ]},
  {"key":"total_score","label":"종합점수 (100점 만점)","type":"number","width":"half"},
  {"key":"grade","label":"등급 (S/A/B/C/D)","type":"select","options":["S(90점이상)","A(80~89점)","B(70~79점)","C(60~69점)","D(60점미만)"],"width":"half"},
  {"key":"strengths","label":"우수사항","type":"textarea","width":"full"},
  {"key":"improvements","label":"개선요청사항","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-AUTO-01-V2','FMEA (개정판 - RPN 계산기준 포함)','신제품개발','AUTO','B','8.3','iatf16949','starter',2260,
'[
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"process_name","label":"공정명","type":"text","width":"half"},
  {"key":"revision","label":"개정차수","type":"text","width":"half"},
  {"key":"prepared_by","label":"작성자","type":"text","width":"half"},
  {"key":"rpn_criteria","label":"RPN 판정기준","type":"text","width":"full","placeholder":"RPN = S(심각도) x O(발생도) x D(검출도) | RPN>=100: 즉시개선 | RPN 50~99: 단기개선 | RPN<50: 모니터링"},
  {"key":"fmea_items","label":"FMEA 분석표","type":"table","columns":[
    {"key":"process_step","label":"공정단계","width":100},
    {"key":"function","label":"기능/요구사항","width":130},
    {"key":"failure_mode","label":"고장형태","width":130},
    {"key":"effect","label":"고장영향","width":130},
    {"key":"severity","label":"S(1-10)","width":70},
    {"key":"cause","label":"고장원인","width":130},
    {"key":"occurrence","label":"O(1-10)","width":70},
    {"key":"current_prevention","label":"현재예방관리","width":120},
    {"key":"current_detection","label":"현재검출관리","width":120},
    {"key":"detection","label":"D(1-10)","width":70},
    {"key":"rpn","label":"RPN(SxOxD)","width":100},
    {"key":"priority","label":"우선순위","width":80},
    {"key":"action","label":"개선조치","width":130},
    {"key":"owner","label":"담당자","width":90},
    {"key":"due_date","label":"완료일","width":90},
    {"key":"new_s","label":"개선후S","width":70},
    {"key":"new_o","label":"개선후O","width":70},
    {"key":"new_d","label":"개선후D","width":70},
    {"key":"new_rpn","label":"개선후RPN","width":90}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CG-14','제조판매관리자 지정 및 업무 기록','화장품GMP','CG','B','2','iso22716','starter',2270,
'[
  {"key":"designation_date","label":"지정일","type":"date","required":true,"width":"half"},
  {"key":"manager_name","label":"제조판매관리자 성명","type":"text","required":true,"width":"half"},
  {"key":"qualification","label":"자격사항","type":"text","width":"half"},
  {"key":"dept","label":"소속 부서","type":"text","width":"half"},
  {"key":"duties","label":"담당 업무","type":"table","columns":[
    {"key":"duty","label":"업무 내용","width":250},
    {"key":"frequency","label":"수행주기","width":100},
    {"key":"record","label":"기록방법","width":150},
    {"key":"note","label":"비고","width":150}
  ]},
  {"key":"training_records","label":"자격유지 교육 기록","type":"table","columns":[
    {"key":"date","label":"교육일","width":100},
    {"key":"title","label":"교육명","width":200},
    {"key":"hours","label":"시간","width":70},
    {"key":"institution","label":"교육기관","width":150}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CG-15','반품·회수 처리 기록','화장품GMP','CG','B','13','iso22716','starter',2280,
'[
  {"key":"record_number","label":"처리번호","type":"text","required":true,"width":"half"},
  {"key":"receipt_date","label":"접수일","type":"date","required":true,"width":"half"},
  {"key":"product_name","label":"제품명","type":"text","required":true,"width":"half"},
  {"key":"batch_no","label":"배치번호","type":"text","required":true,"width":"half"},
  {"key":"customer","label":"반품업체/고객","type":"text","width":"half"},
  {"key":"reason_type","label":"반품/회수 사유","type":"select","options":["품질불량","라벨오류","안전성문제","유통기한","소비자불만","자발적회수","기타"],"width":"half"},
  {"key":"quantity","label":"수량","type":"number","width":"half"},
  {"key":"description","label":"상세 내용","type":"textarea","required":true,"width":"full"},
  {"key":"investigation","label":"조사 결과","type":"textarea","width":"full"},
  {"key":"disposition","label":"처리방법","type":"select","options":["폐기","재작업","반품처리","보관"],"width":"half"},
  {"key":"recall_required","label":"회수 필요","type":"select","options":["필요(자발적회수)","필요(강제회수)","불필요"],"width":"half"},
  {"key":"authority_report","label":"식약처 보고 여부","type":"select","options":["보고완료","불필요","검토중"],"width":"half"},
  {"key":"complete_date","label":"처리완료일","type":"date","width":"half"},
  {"key":"handler","label":"처리자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-CG-16','품질검사 위탁 기록','화장품GMP','CG','B','7','iso22716','starter',2290,
'[
  {"key":"contract_company","label":"위탁검사기관","type":"text","required":true,"width":"half"},
  {"key":"contract_date","label":"계약일","type":"date","width":"half"},
  {"key":"records","label":"위탁검사 실시 기록","type":"table","columns":[
    {"key":"date","label":"의뢰일","width":100},
    {"key":"product_name","label":"제품명","width":150},
    {"key":"batch_no","label":"배치번호","width":120},
    {"key":"test_items","label":"시험항목","width":150},
    {"key":"result_date","label":"결과수령일","width":110},
    {"key":"result","label":"시험결과","width":100},
    {"key":"certificate_no","label":"성적서번호","width":120},
    {"key":"note","label":"비고","width":100}
  ]}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;


-- ── 구매공급자 (SUP) ───────────────────────────────────────────

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-SUP-01','공급자 평가 체크리스트','구매공급자','SUP','D','8.4.1','iso9001','starter',410,
'[
  {"key":"audit_date","label":"심사일","type":"date","required":true,"width":"half"},
  {"key":"supplier_name","label":"공급업체명","type":"text","required":true,"width":"half"},
  {"key":"auditor","label":"심사원","type":"text","width":"half"},
  {"key":"supply_item","label":"공급 품목","type":"text","width":"half"},
  {"key":"quality_system","label":"품질시스템 심사","type":"table","columns":[
    {"key":"no","label":"No","width":50},
    {"key":"category","label":"구분","width":100},
    {"key":"check_item","label":"심사 항목","width":250},
    {"key":"result","label":"결과(O/X/N/A)","width":100},
    {"key":"score","label":"점수(0-5)","width":90},
    {"key":"note","label":"비고/증거","width":200}
  ]},
  {"key":"total_score","label":"총점","type":"number","width":"half"},
  {"key":"grade","label":"등급(S/A/B/C/D)","type":"select","options":["S(90점이상)","A(80~89점)","B(70~79점)","C(60~69점)","D(60점미만)"],"width":"half"},
  {"key":"strengths","label":"우수사항","type":"textarea","width":"full"},
  {"key":"improvements","label":"개선 요구사항","type":"textarea","width":"full"},
  {"key":"overall_result","label":"종합 결과","type":"select","options":["적격","조건부적격","부적격"],"width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-SUP-02','공급자 정기 평가서','구매공급자','SUP','C','8.4.1','iso9001','starter',420,
'[
  {"key":"eval_year","label":"평가 연도","type":"text","required":true,"width":"half"},
  {"key":"supplier_name","label":"공급업체명","type":"text","required":true,"width":"half"},
  {"key":"eval_date","label":"평가일","type":"date","width":"half"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"delivery","label":"납기 평가 (30점)","type":"table","columns":[
    {"key":"item","label":"평가항목","width":200},
    {"key":"weight","label":"배점","width":70},
    {"key":"score","label":"득점","width":70},
    {"key":"note","label":"비고","width":200}
  ]},
  {"key":"quality","label":"품질 평가 (40점)","type":"table","columns":[
    {"key":"item","label":"평가항목","width":200},
    {"key":"weight","label":"배점","width":70},
    {"key":"score","label":"득점","width":70},
    {"key":"note","label":"비고","width":200}
  ]},
  {"key":"service","label":"서비스 평가 (20점)","type":"table","columns":[
    {"key":"item","label":"평가항목","width":200},
    {"key":"weight","label":"배점","width":70},
    {"key":"score","label":"득점","width":70},
    {"key":"note","label":"비고","width":200}
  ]},
  {"key":"price","label":"가격 평가 (10점)","type":"table","columns":[
    {"key":"item","label":"평가항목","width":200},
    {"key":"weight","label":"배점","width":70},
    {"key":"score","label":"득점","width":70},
    {"key":"note","label":"비고","width":200}
  ]},
  {"key":"total_score","label":"종합점수 (100점)","type":"number","width":"half"},
  {"key":"grade","label":"등급","type":"select","options":["S(90이상)","A(80~89)","B(70~79)","C(60~69)","D(60미만)"],"width":"half"},
  {"key":"prev_grade","label":"전년도 등급","type":"text","width":"half"},
  {"key":"action","label":"조치사항","type":"select","options":["계속거래","조건부거래","거래중지","재심사"],"width":"half"},
  {"key":"improvements","label":"개선 요구사항","type":"textarea","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-SUP-03','신규 공급자 자격인정 평가서','구매공급자','SUP','B','8.4.1','iso9001','starter',430,
'[
  {"key":"eval_date","label":"평가일","type":"date","required":true,"width":"half"},
  {"key":"supplier_name","label":"공급업체명","type":"text","required":true,"width":"half"},
  {"key":"address","label":"주소","type":"text","width":"full"},
  {"key":"contact","label":"담당자/연락처","type":"text","width":"half"},
  {"key":"supply_item","label":"공급 품목","type":"text","width":"half"},
  {"key":"eval_type","label":"평가 유형","type":"select","options":["서면평가","현장심사","샘플평가","병행평가"],"width":"half"},
  {"key":"certifications","label":"보유 인증","type":"text","width":"half"},
  {"key":"doc_review","label":"서류 검토","type":"table","columns":[
    {"key":"item","label":"검토 항목","width":200},
    {"key":"required","label":"필수여부","width":80},
    {"key":"submitted","label":"제출여부","width":80},
    {"key":"result","label":"검토결과","width":120},
    {"key":"note","label":"비고","width":200}
  ]},
  {"key":"eval_items","label":"평가 항목","type":"table","columns":[
    {"key":"category","label":"구분","width":100},
    {"key":"item","label":"평가 항목","width":200},
    {"key":"score","label":"점수(0-10)","width":100},
    {"key":"note","label":"비고","width":200}
  ]},
  {"key":"total_score","label":"총점","type":"number","width":"half"},
  {"key":"result","label":"평가 결과","type":"select","options":["적격(등록)","조건부적격(6개월후재평가)","부적격(등록불가)"],"width":"half"},
  {"key":"conditions","label":"조건부 승인 조건","type":"textarea","width":"full"},
  {"key":"evaluator","label":"평가자","type":"text","width":"half"},
  {"key":"approver","label":"승인자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;

INSERT INTO form_templates (form_code,form_name,category,process_code,pattern,iso_clause,standard,plan_required,sort_order,fields) VALUES
('F-SUP-04','공급자 개선 요구서','구매공급자','SUP','B','8.4.2','iso9001','starter',440,
'[
  {"key":"request_number","label":"요구서 번호","type":"text","required":true,"width":"half"},
  {"key":"issue_date","label":"발행일","type":"date","required":true,"width":"half"},
  {"key":"supplier_name","label":"공급업체명","type":"text","required":true,"width":"half"},
  {"key":"due_date","label":"개선 완료 기한","type":"date","required":true,"width":"half"},
  {"key":"issue_type","label":"문제 유형","type":"select","options":["품질불량","납기지연","서류미비","가격이슈","서비스불량","기타"],"width":"half"},
  {"key":"priority","label":"긴급도","type":"select","options":["긴급","일반"],"width":"half"},
  {"key":"description","label":"문제 내용","type":"textarea","required":true,"width":"full"},
  {"key":"evidence","label":"근거 자료","type":"textarea","width":"full"},
  {"key":"required_action","label":"요구 조치사항","type":"textarea","required":true,"width":"full"},
  {"key":"supplier_response","label":"공급자 회신","type":"textarea","width":"full"},
  {"key":"response_date","label":"회신일","type":"date","width":"half"},
  {"key":"close_result","label":"처리 결과","type":"select","options":["완료","미완료","부분완료"],"width":"half"},
  {"key":"issuer","label":"발행자","type":"text","width":"half"},
  {"key":"approver","label":"승인자","type":"text","width":"half"}
]'::jsonb)
ON CONFLICT (form_code) DO NOTHING;
