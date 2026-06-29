-- Mikro-anketë kënaqësie pas mbylljes së projektit ("Përfunduar") + lidhje
-- automatike me testimonialet — klienti vlerëson, nëse vlerësimi është i mirë
-- krijohet vetë një testimonial i fshehur (visible=false) gati për rishikim.
create table if not exists project_feedback (
  id              bigint generated always as identity primary key,
  project_id      bigint not null references projects(id) on delete cascade,
  contact_id      uuid references contacts(id) on delete set null,
  client_name     text not null,
  client_business text,
  rating          int,
  comment         text,
  public_token    text not null default replace(gen_random_uuid()::text, '-', ''),
  submitted_at    timestamptz,
  created_at      timestamptz not null default now()
);

create unique index if not exists project_feedback_token_idx on project_feedback (public_token);
create index if not exists project_feedback_project_idx on project_feedback (project_id);

alter table project_feedback enable row level security;

drop policy if exists "service role only" on project_feedback;
create policy "service role only"
  on project_feedback for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.project_feedback to service_role;
grant usage, select on sequence project_feedback_id_seq to service_role;
