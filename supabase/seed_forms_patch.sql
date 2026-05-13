-- ── 서식 필드 업데이트 패치 (F-KPI-01, F-ENV-01, F-KRAS-01) ──────────────────
-- 테이블 컬럼 자동 드롭다운(FormTable.tsx COLUMN_AUTO_OPTIONS)을 활용:
--   unit, cycle, condition, work_type, risk_grade, signal 컬럼이 자동 드롭다운으로 렌더링됨.
-- ON CONFLICT DO UPDATE 로 기존 레코드도 업데이트됨.

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
    {"key":"unit","label":"단위","width":70},
    {"key":"cycle","label":"관리주기","width":90},
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
ON CONFLICT (form_code) DO UPDATE SET fields = EXCLUDED.fields;

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
    {"key":"condition","label":"발생조건","width":90},
    {"key":"scale","label":"규모(1-5)","width":80},
    {"key":"severity","label":"심각성(1-5)","width":90},
    {"key":"frequency","label":"빈도(1-5)","width":80},
    {"key":"significance_score","label":"유의성점수","width":110},
    {"key":"legal_requirement","label":"법적요구(Y/N)","width":100},
    {"key":"stakeholder_concern","label":"이해관계자관심(Y/N)","width":120},
    {"key":"significant","label":"유의한측면(Y/N)","width":110},
    {"key":"control_measure","label":"관리방법","width":150}
  ]},
  {"key":"criteria","label":"유의성 판정기준","type":"text","width":"full","placeholder":"점수 15점 이상 또는 법적요구사항/이해관계자 관심사항은 유의한 환경측면으로 결정"}
]'::jsonb)
ON CONFLICT (form_code) DO UPDATE SET fields = EXCLUDED.fields;

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
    {"key":"work_type","label":"작업구분","width":110},
    {"key":"hazard_source","label":"유해위험요인(기인물)","width":150},
    {"key":"occurrence_type","label":"발생형태","width":100},
    {"key":"exposed_workers","label":"노출근로자","width":90},
    {"key":"current_measure","label":"현재안전조치","width":150},
    {"key":"frequency","label":"빈도(1-3)","width":80},
    {"key":"severity","label":"강도(1-3)","width":80},
    {"key":"risk_level","label":"위험성수준","width":100},
    {"key":"risk_grade","label":"위험등급","width":90},
    {"key":"additional_measure","label":"추가감소대책","width":150},
    {"key":"owner","label":"담당자","width":100},
    {"key":"due_date","label":"완료예정일","width":100},
    {"key":"new_frequency","label":"개선후빈도","width":90},
    {"key":"new_severity","label":"개선후강도","width":90},
    {"key":"new_risk","label":"개선후위험성","width":100}
  ]},
  {"key":"legal_basis","label":"법적근거 (산업안전보건법 제36조)","type":"text","width":"full"}
]'::jsonb)
ON CONFLICT (form_code) DO UPDATE SET fields = EXCLUDED.fields;
