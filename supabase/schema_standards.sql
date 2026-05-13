ALTER TABLE companies
ADD COLUMN IF NOT EXISTS std_iso22000 boolean default false,
ADD COLUMN IF NOT EXISTS std_iso22301 boolean default false,
ADD COLUMN IF NOT EXISTS std_iso13485 boolean default false,
ADD COLUMN IF NOT EXISTS std_iso42001 boolean default false,
ADD COLUMN IF NOT EXISTS std_iso19443 boolean default false;

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS std_iso22716 boolean default false;
