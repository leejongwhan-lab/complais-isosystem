-- ══════════════════════════════════════════════════════════════
-- 거북이표 데이터 + 문서번호 개선
-- ══════════════════════════════════════════════════════════════

-- 1. 거북이표 JSONB 컬럼 추가
ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS turtle_data jsonb;

-- 2. company_code 영문/숫자 제약
--    (이미 제약이 있으면 먼저 DROP 후 재생성)
ALTER TABLE companies
  DROP CONSTRAINT IF EXISTS check_company_code;

ALTER TABLE companies
  ADD CONSTRAINT check_company_code
  CHECK (company_code IS NULL OR company_code ~ '^[A-Z0-9]{2,5}$');

-- 3. 기존 company_code NULL → 영문 변환 (한글 포함 시 NULL 처리)
UPDATE companies
SET company_code = NULL
WHERE company_code IS NOT NULL
  AND company_code !~ '^[A-Z0-9]{2,5}$';

-- 4. 테스트용: LPB 회사코드 설정 (필요 시 WHERE 조건 수정)
-- UPDATE companies SET company_code = 'LPB' WHERE company_code IS NULL;
