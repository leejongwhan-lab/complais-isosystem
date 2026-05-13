-- ============================================================
-- schema_corp.sql  (complais 2 호환 스키마)
-- ============================================================

-- companies 테이블에 complais 2 컬럼 추가
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS name_en             text,
  ADD COLUMN IF NOT EXISTS biz_no              text,
  ADD COLUMN IF NOT EXISTS corp_no             text,
  ADD COLUMN IF NOT EXISTS ceo_name            text,
  ADD COLUMN IF NOT EXISTS address             text,
  ADD COLUMN IF NOT EXISTS address_en          text,
  ADD COLUMN IF NOT EXISTS tel                 text,
  ADD COLUMN IF NOT EXISTS website             text,
  ADD COLUMN IF NOT EXISTS iaf_code            text,
  ADD COLUMN IF NOT EXISTS ksic_code           text,
  ADD COLUMN IF NOT EXISTS scope_kr            text,
  ADD COLUMN IF NOT EXISTS scope_en            text,
  ADD COLUMN IF NOT EXISTS employee_count_hq   integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS employee_count_out  integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS employee_full       integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS employee_part       integer DEFAULT 0;

-- company_branches (complais 2 동일 구조)
CREATE TABLE IF NOT EXISTS company_branches (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id     uuid REFERENCES companies(id) ON DELETE CASCADE,
  name           text NOT NULL,
  address        text DEFAULT '',
  address_en     text DEFAULT '',
  employee_count integer DEFAULT 0,
  scope_kr       text,
  is_active      boolean DEFAULT true,
  created_at     timestamptz DEFAULT now()
);

-- kpi_master (complais 2와 동일 컬럼명)
CREATE TABLE IF NOT EXISTS kpi_master (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_key         text UNIQUE NOT NULL,
  kpi_code        text UNIQUE NOT NULL,
  category_esg    text NOT NULL CHECK (category_esg IN ('E','S','G')),
  category_mid    text NOT NULL,
  name_kr         text NOT NULL,
  name_en         text,
  unit            text,
  direction       text DEFAULT 'lower_better'
                    CHECK (direction IN ('lower_better','higher_better','target')),
  frameworks      jsonb,
  gri_code        text,
  k_esg_code      text,
  esrs_code       text,
  iso_clause      text,
  is_mandatory    boolean DEFAULT false,
  applicable_stds jsonb,
  auto_collect    boolean DEFAULT false,
  api_source      text,
  is_active       boolean DEFAULT true,
  sort_order      smallint DEFAULT 0,
  created_at      timestamptz DEFAULT now()
);

-- kpi_actuals (complais 2와 동일 구조)
CREATE TABLE IF NOT EXISTS kpi_actuals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid REFERENCES companies(id),
  kpi_id          uuid REFERENCES kpi_master(id),
  kpi_code        text,
  measured_year   integer NOT NULL,
  measured_value  numeric(15,4),
  data_source     text DEFAULT '기업 직접입력',
  is_verified     boolean DEFAULT false,
  note            text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  UNIQUE(company_id, kpi_id, measured_year)
);

-- material_balance_items (complais 2와 동일)
CREATE TABLE IF NOT EXISTS material_balance_items (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          uuid REFERENCES companies(id),
  item_code           text,
  category            text NOT NULL CHECK (category IN ('input','output')),
  item_type           text NOT NULL,
  item_name           text NOT NULL,
  unit                text,
  is_energy           boolean DEFAULT false,
  emission_factor_id  uuid,
  sort_order          smallint DEFAULT 0,
  is_active           boolean DEFAULT true,
  created_at          timestamptz DEFAULT now()
);

-- material_balance_actuals (complais 2와 동일)
CREATE TABLE IF NOT EXISTS material_balance_actuals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid REFERENCES companies(id),
  item_id         uuid REFERENCES material_balance_items(id),
  measured_year   integer NOT NULL,
  measured_value  numeric(15,4),
  ghg_calc        numeric(12,4) DEFAULT 0,
  data_source     text,
  note            text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  UNIQUE(company_id, item_id, measured_year)
);

-- emission_factor_master (complais 2와 동일)
CREATE TABLE IF NOT EXISTS emission_factor_master (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fuel_code         text NOT NULL,
  fuel_name         text NOT NULL,
  fuel_type         text DEFAULT 'fossil_fuel'
                      CHECK (fuel_type IN
                        ('electricity','fossil_fuel','renewable','steam','other')),
  factor_year       smallint DEFAULT 2024,
  factor_co2        numeric(14,8) DEFAULT 0,
  factor_ch4        numeric(14,8) DEFAULT 0,
  factor_n2o        numeric(14,8) DEFAULT 0,
  unit_input        text,
  scope_type        smallint DEFAULT 1,
  fuel_category     text,
  fuel_subcategory  text,
  source_name       text,
  is_active         boolean DEFAULT true,
  created_at        timestamptz DEFAULT now()
);

-- RLS 비활성화
ALTER TABLE company_branches        DISABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_master              DISABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_actuals             DISABLE ROW LEVEL SECURITY;
ALTER TABLE material_balance_items  DISABLE ROW LEVEL SECURITY;
ALTER TABLE material_balance_actuals DISABLE ROW LEVEL SECURITY;
ALTER TABLE emission_factor_master  DISABLE ROW LEVEL SECURITY;

-- ── 배출계수 기본 데이터 (환경부 고시 2022-208호) ──────────
INSERT INTO emission_factor_master
  (fuel_code, fuel_name, fuel_type, factor_year,
   factor_co2, unit_input, scope_type, source_name)
VALUES
  ('elec_kr',  '전력(한국)',  'electricity', 2022, 0.45870000, 'MWh',  2, '환경부 고시 2022-208호'),
  ('lng',      'LNG(도시가스)', 'fossil_fuel', 2022, 0.00217600, 'Nm³', 1, '환경부 고시 2022-208호'),
  ('diesel',   '경유',        'fossil_fuel', 2022, 0.00257800, 'L',   1, '환경부 고시 2022-208호'),
  ('lpg',      'LPG',         'fossil_fuel', 2022, 0.00299600, 'L',   1, '환경부 고시 2022-208호'),
  ('gasoline', '휘발유',      'fossil_fuel', 2022, 0.00221800, 'L',   1, '환경부 고시 2022-208호'),
  ('kerosene', '등유',        'fossil_fuel', 2022, 0.00244900, 'L',   1, '환경부 고시 2022-208호'),
  ('bunker_c', '벙커C유',     'fossil_fuel', 2022, 0.00306900, 'L',   1, '환경부 고시 2022-208호')
ON CONFLICT DO NOTHING;

-- ── KPI 마스터 기본 데이터 ────────────────────────────────
INSERT INTO kpi_master
  (kpi_key, kpi_code, category_esg, category_mid,
   name_kr, unit, direction, iso_clause, is_mandatory, sort_order)
VALUES
  -- E 환경
  ('ghg_scope1',        'E-001', 'E', '기후변화', '온실가스 배출량 (Scope 1)', 'tCO₂eq', 'lower_better',  '14001:6.1.2', true,  10),
  ('ghg_scope2',        'E-002', 'E', '기후변화', '온실가스 배출량 (Scope 2)', 'tCO₂eq', 'lower_better',  '14001:6.1.2', true,  20),
  ('energy_elec',       'E-003', 'E', '에너지',   '전력 사용량',               'MWh',     'lower_better',  '50001:6.6',   true,  30),
  ('energy_gas',        'E-004', 'E', '에너지',   '가스 사용량',               'Nm³',     'lower_better',  '50001:6.6',   false, 40),
  ('water_usage',       'E-005', 'E', '자원',     '용수 사용량',               'ton',     'lower_better',  '14001:8.1',   true,  50),
  ('waste_total',       'E-006', 'E', '폐기물',   '폐기물 발생량',             'ton',     'lower_better',  '14001:8.1',   true,  60),
  ('waste_recycle',     'E-007', 'E', '폐기물',   '재활용률',                  '%',       'higher_better', '14001:8.1',   false, 70),
  ('air_emission',      'E-008', 'E', '대기',     '대기오염물질 배출량',       'ton',     'lower_better',  '14001:8.1',   false, 80),
  -- S 사회
  ('injury_rate',       'S-001', 'S', '안전보건', '산업재해율',                '%',       'lower_better',  '45001:9.1.1', true,  10),
  ('accident_count',    'S-002', 'S', '안전보건', '안전사고 발생건수',         '건',      'lower_better',  '45001:10.2',  true,  20),
  ('safety_training',   'S-003', 'S', '안전보건', '안전교육 이수율',           '%',       'higher_better', '45001:7.2',   true,  30),
  ('employee_total',    'S-004', 'S', '인적자원', '전체 임직원 수',            '명',      'target',        '9001:7.1.2',  true,  40),
  ('female_ratio',      'S-005', 'S', '다양성',   '여성 임직원 비율',          '%',       'higher_better', null,          false, 50),
  ('training_hours',    'S-006', 'S', '인적자원', '교육훈련 시간 (인당)',      '시간',    'higher_better', '9001:7.2',    true,  60),
  ('turnover_rate',     'S-007', 'S', '인적자원', '이직률',                    '%',       'lower_better',  null,          false, 70),
  -- G 거버넌스
  ('audit_rate',        'G-001', 'G', '경영시스템', '내부심사 실시율',          '%',       'higher_better', '9001:9.2',    true,  10),
  ('capa_rate',         'G-002', 'G', '경영시스템', 'CAPA 완료율',             '%',       'higher_better', '9001:10.2',   true,  20),
  ('doc_valid_rate',    'G-003', 'G', '문서관리',   '문서 유효율',             '%',       'higher_better', '9001:7.5',    true,  30),
  ('supplier_eval_rate','G-004', 'G', '공급망',     '공급자 평가 완료율',      '%',       'higher_better', '9001:8.4',    false, 40),
  ('customer_satisfaction','G-005','G','고객',       '고객만족도 점수',         '점',      'higher_better', '9001:9.1.2',  true,  50),
  ('antibribery_training','G-006','G','준법',        '반부패 교육 이수율',      '%',       'higher_better', '37001:7.2',   false, 60)
ON CONFLICT (kpi_code) DO NOTHING;
