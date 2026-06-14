-- Admin v5: etiketa projektesh, time tracking, bashkëngjitje skedarësh, shabllone email-esh.

-- ── Etiketa me ngjyra për projektet ──────────────────────────────────────────
alter table projects add column if not exists tags text[] not null default '{}';

-- ── Time tracking për detyrat e projektit ────────────────────────────────────
alter table project_tasks add column if not exists time_spent_minutes int not null default 0;

-- ── Bashkëngjitje skedarësh (kontakte / projekte) ────────────────────────────
create table if not exists attachments (
  id           bigint generated always as identity primary key,
  owner_type   text not null check (owner_type in ('contact', 'project')),
  owner_id     text not null,
  name         text not null,
  path         text not null,
  content_type text,
  size         bigint,
  created_at   timestamptz not null default now()
);

create index if not exists attachments_owner_idx on attachments (owner_type, owner_id);

alter table attachments enable row level security;

drop policy if exists "service role only" on attachments;
create policy "service role only"
  on attachments for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.attachments to service_role;
grant usage, select on sequence attachments_id_seq to service_role;

insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

drop policy if exists "service role attachments" on storage.objects;
create policy "service role attachments"
  on storage.objects for all
  using (bucket_id = 'attachments')
  with check (bucket_id = 'attachments');

-- ── Shabllone të editueshme për email-et automatike ──────────────────────────
create table if not exists email_templates (
  key        text primary key,
  subject    text not null,
  intro      text not null,
  updated_at timestamptz not null default now()
);

alter table email_templates enable row level security;

drop policy if exists "service role only" on email_templates;
create policy "service role only"
  on email_templates for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.email_templates to service_role;

insert into email_templates (key, subject, intro) values
  ('quote_reminder', 'Një kujtesë e vogël — oferta {{number}}',
   'Para disa ditësh ju dërguam ofertën {{number}} me vlerë {{total}}. Donim thjesht të sigurohemi që e keni marrë dhe të pyesim nëse keni ndonjë pyetje.'),
  ('invoice_overdue', 'Kujtesë pagese — fatura {{number}}',
   'Kjo është një kujtesë miqësore se fatura {{number}} me vlerë {{total}} ka kaluar afatin e pagesës.'),
  ('stale_contact', '{{count}} kontakt{{plural}} pa përgjigje prej >{{days}} ditësh',
   'Këto kontakte ende presin një përgjigje. Hidhuni një sy sa më shpejt.'),
  ('daily_summary', 'Përmbledhja e automatizimeve të sotme',
   'Automatizimet e sotme u kryen me sukses:')
on conflict (key) do nothing;
