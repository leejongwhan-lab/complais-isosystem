CREATE TABLE risks (
  id              uuid primary key default gen_random_uuid(),
  risk_number     text unique not null,
  type            text not null default 'risk',
  category        text not null,
  title           text not null,
  description     text,
  likelihood      int  not null check (likelihood between 1 and 5),
  impact          int  not null check (impact between 1 and 5),
  risk_score      int  generated always as (likelihood * impact) stored,
  risk_level      text generated always as (
    case
      when likelihood * impact >= 16 then 'critical'
      when likelihood * impact >= 11 then 'high'
      when likelihood * impact >= 6  then 'medium'
      else 'low'
    end
  ) stored,
  response        text default 'accept',
  action_plan     text,
  owner_name      text,
  due_date        date,
  status          text default 'open',
  related_capa_id uuid references capas(id) on delete set null,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

CREATE TABLE management_reviews (
  id                        uuid primary key default gen_random_uuid(),
  review_number             text unique not null,
  review_date               date not null,
  chairperson               text,
  attendees                 text,
  status                    text default 'planned',
  input_audit_results       text,
  input_customer_feedback   text,
  input_process_performance text,
  input_nonconformities     text,
  input_risk_opportunities  text,
  output_improvement        text,
  output_resource_needs     text,
  output_policy_changes     text,
  created_at                timestamptz default now()
);

ALTER TABLE risks              DISABLE ROW LEVEL SECURITY;
ALTER TABLE management_reviews DISABLE ROW LEVEL SECURITY;
