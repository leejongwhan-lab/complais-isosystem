-- Run in Supabase SQL Editor
ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS sections jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS related_forms jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS kpi_links jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN documents.sections IS 'Rich structured sections array';
