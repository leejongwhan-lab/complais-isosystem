-- document_sections
CREATE TABLE IF NOT EXISTS document_sections (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id    uuid        REFERENCES documents(id) ON DELETE CASCADE,
  section_order  int         NOT NULL,
  section_key    text        NOT NULL,
  section_title  text        NOT NULL,
  content        text,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

CREATE TRIGGER trg_document_sections_updated_at
  BEFORE UPDATE ON document_sections
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- document_versions
CREATE TABLE IF NOT EXISTS document_versions (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id      uuid        REFERENCES documents(id) ON DELETE CASCADE,
  version          text        NOT NULL,
  changed_by       text,
  change_reason    text,
  content_snapshot jsonb,
  created_at       timestamptz DEFAULT now()
);

-- document_approvals
CREATE TABLE IF NOT EXISTS document_approvals (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id    uuid        REFERENCES documents(id) ON DELETE CASCADE,
  step           int         NOT NULL,
  step_name      text        NOT NULL,
  approver_name  text,
  status         text        DEFAULT 'pending'
                   CHECK (status IN ('pending','approved','rejected')),
  comment        text,
  acted_at       timestamptz,
  created_at     timestamptz DEFAULT now()
);

-- document_files
CREATE TABLE IF NOT EXISTS document_files (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id  uuid        REFERENCES documents(id) ON DELETE CASCADE,
  version      text        NOT NULL,
  file_name    text        NOT NULL,
  file_url     text        NOT NULL,
  file_size    int,
  file_type    text,
  uploaded_by  text,
  created_at   timestamptz DEFAULT now()
);

-- document_views
CREATE TABLE IF NOT EXISTS document_views (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id  uuid        REFERENCES documents(id) ON DELETE CASCADE,
  viewer_name  text,
  viewed_at    timestamptz DEFAULT now()
);

ALTER TABLE document_sections  DISABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions  DISABLE ROW LEVEL SECURITY;
ALTER TABLE document_approvals DISABLE ROW LEVEL SECURITY;
ALTER TABLE document_files     DISABLE ROW LEVEL SECURITY;
ALTER TABLE document_views     DISABLE ROW LEVEL SECURITY;
