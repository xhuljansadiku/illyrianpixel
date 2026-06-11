-- ════════════════════════════════════════════════════════════════════════════
-- Admin v4 — pranim publik i ofertës, kujtues automatikë, fatura të rikurruese,
-- projekte & detyra, FAQ manager, popup settings
-- Ekzekutoje një herë në Supabase SQL Editor (i riekzekutueshëm pa gabime).
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. Oferta: token publik + përgjigja e klientit + kujtues ────────────────
alter table quotes
  add column if not exists public_token text not null default replace(gen_random_uuid()::text, '-', '');

create unique index if not exists quotes_public_token_idx on quotes (public_token);

alter table quotes add column if not exists accepted_at timestamptz;
alter table quotes add column if not exists declined_at timestamptz;
alter table quotes add column if not exists client_note text;
alter table quotes add column if not exists reminders_sent int not null default 0;
alter table quotes add column if not exists last_reminder_at timestamptz;

-- ── 2. Fatura të rikurruese (mirëmbajtje mujore) ────────────────────────────
create table if not exists recurring_invoices (
  id              bigint generated always as identity primary key,
  contact_id      uuid    references contacts(id) on delete set null,
  client_name     text    not null,
  client_email    text,
  client_business text,
  items           jsonb   not null default '[]'::jsonb,
  discount        numeric not null default 0,
  tax_rate        numeric not null default 0,
  notes           text,
  day_of_month    int     not null default 1 check (day_of_month between 1 and 28),
  active          boolean not null default true,
  last_generated  text,                                  -- muaji i fundit 'YYYY-MM'
  created_at      timestamptz not null default now()
);

alter table recurring_invoices enable row level security;

drop policy if exists "service role only" on recurring_invoices;
create policy "service role only"
  on recurring_invoices for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.recurring_invoices to service_role;
grant usage, select on sequence recurring_invoices_id_seq to service_role;

-- ── 3. Projekte & detyra ─────────────────────────────────────────────────────
create table if not exists projects (
  id          bigint generated always as identity primary key,
  contact_id  uuid references contacts(id) on delete set null,
  name        text not null,
  client_name text,
  phase       text not null default 'discovery'
              check (phase in ('discovery', 'design', 'development', 'review', 'launch')),
  status      text not null default 'active'
              check (status in ('active', 'paused', 'done')),
  deadline    date,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table projects enable row level security;

drop policy if exists "service role only" on projects;
create policy "service role only"
  on projects for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.projects to service_role;
grant usage, select on sequence projects_id_seq to service_role;

create table if not exists project_tasks (
  id         bigint generated always as identity primary key,
  project_id bigint not null references projects(id) on delete cascade,
  title      text   not null,
  done       boolean not null default false,
  due_at     date,
  sort       int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists project_tasks_project_idx on project_tasks (project_id);

alter table project_tasks enable row level security;

drop policy if exists "service role only" on project_tasks;
create policy "service role only"
  on project_tasks for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.project_tasks to service_role;
grant usage, select on sequence project_tasks_id_seq to service_role;

-- ── 4. FAQ — i menaxhueshëm nga admini ──────────────────────────────────────
create table if not exists faqs (
  id         bigint generated always as identity primary key,
  question   text not null,
  answer     text not null,
  visible    boolean not null default true,
  sort       int not null default 0,
  created_at timestamptz not null default now()
);

alter table faqs enable row level security;

drop policy if exists "service role only" on faqs;
create policy "service role only"
  on faqs for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.faqs to service_role;
grant usage, select on sequence faqs_id_seq to service_role;

-- Seed me FAQ-të ekzistuese të faqes
insert into faqs (question, answer, sort)
select * from (values
  ('Sa zgjat ndërtimi i një website?', E'Mesatarisht 2–4 javë, varësisht kompleksitetit dhe sasisë së përmbajtjes.\nProjektet me funksione të avancuara mund të zgjasin deri në 6 javë.\nNë fazën e planifikimit ju japim një afat të saktë.', 0),
  ('A përfshihet SEO?', 'Po, çdo website që ndërtojmë vjen me SEO bazë të instaluar: strukturë e saktë, faqe të shpejta dhe meta të optimizuara. SEO i avancuar dhe strategjia e përmbajtjes është shërbim i veçantë.', 1),
  ('A ofroni mirëmbajtje pas publikimit?', E'Po, ofrojmë paketa mirëmbajtjeje mujore që përfshijnë përditësime, monitorim sigurie dhe ndryshime të vogla.\nNuk ju lëmë vetëm pas lansimit.', 2),
  ('A punoni me klientë ndërkombëtarë?', E'Po, kemi klientë në Itali, Gjermani, Angli dhe SHBA.\nKomunikojmë në shqip, anglisht dhe gjermanisht.\nTakimet bëhen online, procesi është i njëjtë për të gjithë.', 3),
  ('Si funksionon pagesa?', '50% paradhënie për të rezervuar projektin dhe nisur punën menjëherë, dhe 50% para publikimit përfundimtar.', 4),
  ('Çfarë kam nevojë të përgatis para fillimit?', E'Mjafton të na tregoni çfarë bën biznesi juaj, kë synoni të arrini dhe çfarë nuk ju pëlqen tek prezenca juaj aktuale.\nPër pjesën tjetër kujdesemi ne, struktura, tekstet dhe dizajni.', 5)
) as seed(question, answer, sort)
where not exists (select 1 from faqs);

-- ── 5. Gjurmim i shikimeve të ofertës nga klienti ───────────────────────────
alter table quotes add column if not exists viewed_at timestamptz;
alter table quotes add column if not exists view_count int not null default 0;

-- ── 6. Popup settings (exit-intent) ─────────────────────────────────────────
insert into site_settings (key, value) values
  ('popup_enabled', '1'),
  ('popup_eyebrow', 'Para se të largoheni'),
  ('popup_title', 'Merrni një konsultë falas sot.'),
  ('popup_text', 'Tregoni për projektin tuaj dhe marrim një plan konkret pa kosto, pa detyrime.'),
  ('popup_cta', 'Konsultë falas →')
on conflict (key) do nothing;
