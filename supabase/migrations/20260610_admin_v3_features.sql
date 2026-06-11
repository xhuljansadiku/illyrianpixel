-- ════════════════════════════════════════════════════════════════════════════
-- Admin v3 — Oferta/Fatura, pipeline value, testimoniale, portofol, çmime,
-- newsletter tracking, page views (funnel), blog scheduling
-- Ekzekutoje një herë në Supabase SQL Editor.
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. Oferta & Fatura ───────────────────────────────────────────────────────
create table if not exists quotes (
  id              bigint generated always as identity primary key,
  number          text        not null unique,            -- p.sh. OF-2026-001 / FA-2026-001
  kind            text        not null default 'quote' check (kind in ('quote', 'invoice')),
  contact_id      uuid        references contacts(id) on delete set null,
  client_name     text        not null,
  client_email    text,
  client_business text,
  items           jsonb       not null default '[]'::jsonb, -- [{description, qty, price}]
  discount        numeric     not null default 0,           -- vlerë absolute €
  tax_rate        numeric     not null default 0,           -- % TVSH
  notes           text,
  status          text        not null default 'draft'
                  check (status in ('draft', 'sent', 'accepted', 'rejected', 'paid')),
  issued_at       date        not null default current_date,
  due_at          date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists quotes_contact_id_idx on quotes (contact_id);
create index if not exists quotes_created_at_idx on quotes (created_at desc);

alter table quotes enable row level security;

drop policy if exists "service role only" on quotes;
create policy "service role only"
  on quotes for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.quotes to service_role;
grant usage, select on sequence quotes_id_seq to service_role;

-- ── 2. Kontaktet: vlera e pipeline (€) + burimi i lead-it ───────────────────
alter table contacts
  add column if not exists value numeric;

alter table contacts
  add column if not exists source_path text;

-- ── 3. Testimoniale ──────────────────────────────────────────────────────────
create table if not exists testimonials (
  id         bigint generated always as identity primary key,
  quote      text        not null,
  name       text        not null,
  company    text,
  result     text,                                        -- vendndodhja / rezultati
  logo       text,                                        -- URL e logos (opsionale)
  visible    boolean     not null default true,
  sort       int         not null default 0,
  created_at timestamptz not null default now()
);

alter table testimonials enable row level security;

drop policy if exists "service role only" on testimonials;
create policy "service role only"
  on testimonials for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.testimonials to service_role;
grant usage, select on sequence testimonials_id_seq to service_role;

-- Seed me testimonialet ekzistuese të faqes
insert into testimonials (quote, name, company, result, logo, sort)
select * from (values
  ('Më përpara na duhej t''u shpjegonim njerëzve çdo gjë nga fillimi në telefon. Website-i na ka shpëtuar, sepse tani klientët vijnë gati të informuar. Futen, shohin punët tona dhe kur na shkruajnë, e dinë fiks çfarë duan. Na ka kursyer pafund kohë.', 'Mariglent S.', 'ESM Group', 'Milano, Itali', '/images/logos/esm-group.png', 0),
  ('Në fushën e fitnesit është e vështirë të krijosh besim, por ky Website i ri nga zero na ka ndryshuar komplet lojën. Më përpara njerëzit na shkruanin pafund pyetje për programet dhe ngatërroheshin. Tani që çdo paketë është e ndarë kaq qartë, klientët futen, binden dhe na kontaktojnë direkt për të filluar, pa ato diskutimet e gjata.', 'Bardhi U.', 'Bardhi Wellness', 'Prishtinë & Köln', '/images/logos/bardhi-wellness.png', 1),
  ('Mendonim se na mjaftonte thjesht të bënim punë të mirë, por pa një Website si duhet nuk na merrnin seriozisht. Që kur u bë kjo faqja e Webit, gjithçka ka ndryshuar. Klientët Gjermanë futen, shohin shërbimet tona të ndara qartë dhe kërkesat tani na vijnë shumë më të sakta dhe profesionale, pa humbur kohë me telefonata.', 'Amir S.', 'Hauswerk Niederbayern', 'Straubing, Gjermani', '/images/logos/hauswerk-niederbayern.png', 2),
  ('Në tregun e ndërtimit është shumë e vështirë të gjesh klientë seriozë. Ky Website i ri nga zero dhe sistemi me Google Ads na kanë shpëtuar nga telefonatat e gjata që nuk mbylleshin kurrë me punë. Tani na vijnë kërkesa reale nga njerëz që e kanë ndarë mendjen; na kontaktojnë duke e ditur fiks çfarë duan dhe çfarë ofrojmë që në sekondën e parë.', 'Vehbi P.', 'Palushi Brothers', 'Londër, Angli', '/images/logos/palushi-brothers.webp', 3)
) as seed(quote, name, company, result, logo, sort)
where not exists (select 1 from testimonials);

-- ── 4. Portofol ──────────────────────────────────────────────────────────────
create table if not exists portfolio_items (
  id          bigint generated always as identity primary key,
  title       text        not null,
  category    text,
  location    text,
  year        text,
  description text,
  result      text,
  tags        text[]      not null default '{}',
  image_url   text,
  live_url    text,
  visible     boolean     not null default true,
  sort        int         not null default 0,
  created_at  timestamptz not null default now()
);

alter table portfolio_items enable row level security;

drop policy if exists "service role only" on portfolio_items;
create policy "service role only"
  on portfolio_items for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.portfolio_items to service_role;
grant usage, select on sequence portfolio_items_id_seq to service_role;

-- Bucket publik për imazhet e portofolit
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- ── 5. Çmimet — override pa deploy ──────────────────────────────────────────
create table if not exists pricing_overrides (
  key        text primary key,                            -- '<categorySlug>||<packageName>'
  price      text not null,
  price_note text,
  updated_at timestamptz not null default now()
);

alter table pricing_overrides enable row level security;

drop policy if exists "service role only" on pricing_overrides;
create policy "service role only"
  on pricing_overrides for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.pricing_overrides to service_role;

-- ── 6. Newsletter — broadcast + open/click tracking ─────────────────────────
create table if not exists newsletter_broadcasts (
  id         uuid primary key default gen_random_uuid(),
  subject    text        not null,
  message    text        not null,
  sent_count int         not null default 0,
  created_at timestamptz not null default now()
);

alter table newsletter_broadcasts enable row level security;

drop policy if exists "service role only" on newsletter_broadcasts;
create policy "service role only"
  on newsletter_broadcasts for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.newsletter_broadcasts to service_role;

create table if not exists newsletter_events (
  id           bigint generated always as identity primary key,
  broadcast_id uuid        not null references newsletter_broadcasts(id) on delete cascade,
  email        text        not null,
  type         text        not null check (type in ('open', 'click')),
  url          text,
  created_at   timestamptz not null default now()
);

create index if not exists newsletter_events_broadcast_idx
  on newsletter_events (broadcast_id, type, email);

alter table newsletter_events enable row level security;

drop policy if exists "service role only" on newsletter_events;
create policy "service role only"
  on newsletter_events for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.newsletter_events to service_role;
grant usage, select on sequence newsletter_events_id_seq to service_role;

-- ── 7. Page views — funnel i konvertimit ────────────────────────────────────
create table if not exists page_views (
  day   date not null,
  path  text not null,
  count int  not null default 0,
  primary key (day, path)
);

alter table page_views enable row level security;

drop policy if exists "service role only" on page_views;
create policy "service role only"
  on page_views for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.page_views to service_role;

create or replace function increment_page_view(p_path text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into page_views (day, path, count)
  values (current_date, p_path, 1)
  on conflict (day, path) do update set count = page_views.count + 1;
$$;

revoke execute on function increment_page_view(text) from public, anon, authenticated;
grant execute on function increment_page_view(text) to service_role;

-- ── 8. Blog — tabela (s'ekzistonte më parë) + publikim i planifikuar ────────
create table if not exists blog_posts (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  slug          text        not null unique,
  title         text        not null,
  category      text        not null,
  excerpt       text        not null,
  content       text[]      not null default '{}',
  date          text        not null,                     -- p.sh. "Qershor 2026"
  published     boolean     not null default true,
  scheduled_for timestamptz
);

-- Në rast se tabela ekzistonte pa kolonat e reja
alter table blog_posts
  add column if not exists published boolean not null default true;

alter table blog_posts
  add column if not exists scheduled_for timestamptz;

create index if not exists blog_posts_published_idx on blog_posts (published, scheduled_for);

alter table blog_posts enable row level security;

drop policy if exists "service role only" on blog_posts;
create policy "service role only"
  on blog_posts for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.blog_posts to service_role;
grant usage, select on sequence blog_posts_id_seq to service_role;
