-- ══════════════════════════════════════════════════════════════
-- 회사 코드 (문서번호 접두어)
-- ══════════════════════════════════════════════════════════════

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS company_code text;

-- 기존 회사 자동 코드 생성 (회사명 앞 3글자 대문자)
UPDATE companies
SET company_code = UPPER(SUBSTRING(company_name, 1, 3))
WHERE company_code IS NULL;
